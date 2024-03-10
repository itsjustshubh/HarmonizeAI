import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lightLogo from '../icons/light-logo.png';
import darkLogo from '../icons/dark-logo.png';
import {FaArrowRight, FaSignOutAlt, FaSpotify} from "react-icons/fa";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import {Helmet} from "react-helmet";

const SpotifyLogin = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [savedTracks, setSavedTracks] = useState([]); // State for saved tracks
    const navigate = useNavigate();
    const [currentLogo, setCurrentLogo] = useState(lightLogo);

    useEffect(() => {
        const matchDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
        const handleThemeChange = (e) => {
            setCurrentLogo(e.matches ? darkLogo : lightLogo);
        };

        handleThemeChange(matchDarkMode);
        matchDarkMode.addEventListener('change', handleThemeChange);

        const getTokenFromHash = () => {
            const hash = window.location.hash
                .substring(1)
                .split('&')
                .reduce((initial, item) => {
                    if (item) {
                        const parts = item.split('=');
                        initial[parts[0]] = decodeURIComponent(parts[1]);
                    }
                    return initial;
                }, {});
            window.location.hash = ''; // Clear the hash to prevent token in URL
            return hash.access_token || null;
        };

        const storedToken = localStorage.getItem('spotifyAccessToken');
        const accessToken = storedToken || getTokenFromHash();

        if (accessToken) {
            if (!storedToken) {
                localStorage.setItem('spotifyAccessToken', accessToken);
            }
            fetchUserDetails(accessToken);
            fetchSavedTracks(accessToken);
        }

        // Fetch recently played tracks
        if (accessToken) {
            fetchRecentlyPlayedTracks(accessToken).then(tracks => {
                setRecentlyPlayedTracks(tracks);
            });
        }
    }, [navigate]);

    // Fetch User Details
    const fetchUserDetails = async (token) => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Response not OK');
            const userData = await response.json();

            if (userData.error) {
                console.error('Error fetching user details:', userData.error);
                handleLogout(); // Logout on error
                return; // Exit the function
            }

            // Set basic user details
            setUserDetails({
                id: userData.id,
                displayName: userData.display_name,
                email: userData.email || 'Email not provided',
                profileImage: userData.images.length > 0 ? userData.images[0].url : undefined,
                country: userData.country || 'Country not provided',
                subscriptionType: userData.product === 'premium' ? 'Premium' : 'Free',
            });

            // Fetch additional details like top artists
            await fetchTopArtists(token);

            // Fetch Top Tracks
            await fetchTopTracks(token);

        } catch (error) {
            console.error('Error fetching user details:', error);
            handleLogout(); // Ensure logout on fetch error
        }
    };

    // Fetch Top Tracks
    const fetchTopTracks = async (token) => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Response not OK');
            const data = await response.json();

            const topTracks = data.items.map(track => ({
                name: track.name,
                artist: track.artists.map(artist => artist.name).join(', '),
                album: track.album.name
            }));

            setUserDetails(prevDetails => ({
                ...prevDetails,
                topTracks: topTracks
            }));
        } catch (error) {
            console.error('Error fetching top tracks:', error);
        }
    };

    // Fetch Top Artists
    const fetchTopArtists = async (token) => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/top/artists', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Response not OK');
            const data = await response.json();

            // Extract artist names
            const artists = data.items.map(artist => artist.name).join(', ');

            // Update the userDetails state with the top artists
            setUserDetails(prevDetails => ({
                ...prevDetails,
                topArtists: artists
            }));
        } catch (error) {
            console.error('Error fetching top artists:', error);
        }
    };

    // State for recently played tracks
    const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState([]);

    const fetchRecentlyPlayedTracks = async (token) => {
        try {
            // Fetch recently played tracks
            const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Response not OK');
            const data = await response.json();

            // Combine track details with their audio features
            const tracksWithDetails = data.items.map(item => ({
                name: item.track.name,
                id: item.track.id,
                albumImageUrl: item.track.album.images[0]?.url || 'path_to_default_image', // Use the first image or a default one
                artist: item.track.artists.map(artist => artist.name).join(', ')
                // Add other details if needed
            }));

            console.log('Recently Played Tracks with Details:', tracksWithDetails);
            return tracksWithDetails; // Return the tracks with details
        } catch (error) {
            console.error('Error fetching recently played tracks:', error);
        }
    };

    const fetchSavedTracks = async (token) => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/tracks', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Response not OK');
            const data = await response.json();

            // Process and store the saved tracks
            const tracks = data.items.map(item => ({
                name: item.track.name,
                artist: item.track.artists.map(artist => artist.name).join(', '),
                album: item.track.album.name
            }));
            setSavedTracks(tracks);
        } catch (error) {
            console.error('Error fetching saved tracks:', error);
        }
    };

    const handleLogin = () => {
        const clientId = 'b564775eab8f4d6e976a1179ff673e6c'; // Replace with your Spotify Client ID
        const redirectUri = encodeURIComponent(`${window.location.origin}/spotify-login`);
        const scopes = [
            'user-read-private',
            'user-read-email',
            'user-read-recently-played',
            'user-library-read',
            'user-top-read' // Include this scope
        ];
        window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(scopes.join(' '))}&redirect_uri=${redirectUri}&show_dialog=true`;
    };

    const handleLogout = () => {
        localStorage.removeItem('spotifyAccessToken');
        setUserDetails(null);
    };

    const handleContinue = () => {
        navigate('/biometric-form'); // Navigate to the next page
    };

    // State to keep track of screen width
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    // Update screenWidth state on window resize
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        // Cleanup listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Determine the number of items to display based on screen width
    const displayLimit = screenWidth < 768 ? 2 : 3; // Mobile: 3 items, Laptop: 5 items

    return (
        <div
            // className="bg-gradient-to-r from-green-400 to-blue-500 dark:from-gray-700 dark:to-gray-900 min-h-screen flex items-center justify-center px-4 py-10"
        >
            <Helmet>
                <title>HarmonizeAI: Spotify Music Personalization</title>
                <meta name="description" content="HarmonizeAI creates a unique Spotify listening experience by adapting playlists to your mood and preferences. Log in with Spotify and discover music that echoes your emotions." />
                <meta name="keywords" content="HarmonizeAI, Spotify integration, personalized playlists, mood-based music, Spotify music experience, user mood analysis, music curation, emotion-driven playlists" />
                <meta property="og:title" content="HarmonizeAI: Your Personal Spotify Music Curator" />
                <meta property="og:description" content="HarmonizeAI enhances your Spotify experience by curating playlists that reflect your current mood and preferences. Connect with Spotify and let your emotions guide your music journey." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:image" content={darkLogo} /> {/* Use the dynamic currentLogo for the image */}
            </Helmet>

            <div className="max-w-3xl w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6 text-center">
                {userDetails ? (
                    <>
                        <div className="flex flex-col items-center justify-center">
                            <img
                                src={userDetails.profileImage || currentLogo}
                                alt="Profile"
                                className="h-24 w-24 rounded-full shadow-lg"
                            />
                            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-2">
                                Hello {userDetails.displayName}
                            </h1>
                        </div>

                        <div className="mt-4 sm:grid sm:grid-cols-2 sm:gap-4">
                            <div className="text-lg text-gray-600 dark:text-gray-300 text-left mb-4 sm:mb-0">
                                {/* Left column content */}
                                <p><strong>ID:</strong> {userDetails.id}</p>
                                <p><strong>Email:</strong> {userDetails.email}</p>
                                <p><strong>Country:</strong> {userDetails.country}</p>
                                {
                                    userDetails && userDetails.topArtists
                                        ? <p><strong>Top Artists:</strong> {
                                            userDetails.topArtists.split(', ').length > displayLimit
                                                ? `${userDetails.topArtists.split(', ').slice(0, displayLimit).join(', ')} ...more`
                                                : userDetails.topArtists
                                        }</p>
                                        : <p>Loading top artists...</p>
                                }
                                <p><strong>Subscription Type:</strong> {userDetails.subscriptionType}</p>
                            </div>
                            <div className="text-lg text-gray-600 dark:text-gray-300 text-left">
                                {/* Right column content */}
                                <p><strong>Your Top Tracks:</strong></p>
                                {userDetails.topTracks && userDetails.topTracks.length > 0 ? (
                                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                                        {userDetails.topTracks.slice(0, displayLimit).map((track, index) => (
                                            <li key={index}>{track.name} by {track.artist}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No top tracks available.</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 w-full">
                            <div className="overflow-x-auto hide-scrollbar py-4 max-w-full">
                                <div className="flex space-x-4">
                                    {recentlyPlayedTracks && recentlyPlayedTracks.length > 0 &&
                                        recentlyPlayedTracks.map((track, index) => (
                                            <div key={index} className="flex-none w-24 h-24 relative flex-shrink-0">
                                                <img
                                                    src={track.albumImageUrl}
                                                    alt={track.name}
                                                    className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                                                    onError={(e) => e.target.src = 'path_to_default_image'}
                                                />
                                                <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate text-center">
                                                    {track.name}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <ResponsiveMasonry columnsCountBreakPoints={{350: 2, 750: 2}}>
                                <Masonry gutter="20px">
                                    <button onClick={handleLogout}
                                            className="flex items-center justify-center w-half px-4 py-2 border border-transparent text-base rounded-2xl text-white bg-red-600 hover:bg-red-700 transition-transform duration-200 hover:scale-105
                                        animate-none hover:animate-pulse
                                        font-bold">
                                        Logout <FaSignOutAlt className="ml-2"/>
                                    </button>

                                    <button onClick={handleContinue}
                                            className="flex items-center justify-center w-half mb-4 px-4 py-2 border border-transparent text-base rounded-2xl text-white bg-green-600 hover:bg-green-700 transition-transform duration-200 hover:scale-105
                                        animate-none hover:animate-pulse font-bold">
                                        Continue <FaArrowRight className="ml-2"/>
                                    </button>
                                </Masonry>
                            </ResponsiveMasonry>
                        </div>

                        <div className="mt-4 text-left">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Your Saved
                                Tracks:</h2>
                            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                                {savedTracks.map((track, index) => (
                                    <li key={index}>{track.name} by {track.artist} ({track.album})</li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <>
                        <img src={currentLogo} alt="Spotify" className="mx-auto h-32"/>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome to HarmonizeAI</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Experience music tailored to your
                            emotions.</p>

                        <button onClick={handleLogin}
                                className="mt-6 w-full flex justify-center items-center px-6 py-3 border border-transparent text-lg rounded-3xl text-white bg-green-600 hover:bg-green-700 transition-transform duration-200 hover:scale-105
                                animate-pulse hover:animate-none font-bold">
                            <FaSpotify className="mr-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl"/> Login with Spotify
                        </button>

                        <div className="mt-8 text-left">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">How HarmonizeAI
                                Enhances Your Spotify Experience:</h3>

                            <ul className="mt-3 text-md text-gray-700 dark:text-gray-300 list-inside list-disc">
                                <li className="py-1.5">
                                    <span
                                        className="text-md font-semibold">Personalized Access to Your Spotify Data:</span>
                                    <ul className="mt-2 pl-6 text-sm">
                                        <li>Name, Username, and Profile Picture
                                        </li>
                                        <li>Followers and Public Playlists
                                        </li>
                                    </ul>
                                </li>
                                <li className="py-1.5">
                                    <span
                                        className="text-md font-semibold py-6">In-Depth Analysis of Your Spotify Activity:</span>
                                    <ul className="mt-2 pl-6 text-sm">
                                    <li>Recently Played Content
                                        </li>
                                        <li>Your Iconic Tracks
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                            <p className="mt-6 italic text-md text-gray-700 dark:text-gray-300">
                                Your privacy matters to us. Your Spotify data is only used to tailor your music
                                experience and is not stored or shared.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SpotifyLogin;
