import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import lightLogo from '../icons/light-logo.png';
import darkLogo from '../icons/dark-logo.png';
import {FaArrowRight, FaSignOutAlt, FaSpotify} from "react-icons/fa";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import {Helmet} from "react-helmet";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {TrackContext} from "./TrackContext";

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

    const { tracks, setTracks } = useContext(TrackContext);

    const fetchRecentlyPlayedTracks = async (token) => {
        try {
            // Fetch recently played tracks
            const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Response not OK');
            const data = await response.json();

            // Extract track IDs for fetching audio features
            const trackIds = data.items.map(item => item.track.id);

            // Fetch audio features in batches to reduce the number of requests
            const batchSize = 100; // Spotify API max limit for audio features request
            const audioFeatures = [];
            for (let i = 0; i < trackIds.length; i += batchSize) {
                const batch = trackIds.slice(i, i + batchSize);
                const featuresResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${batch.join(',')}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!featuresResponse.ok) throw new Error('Response not OK');
                const featuresData = await featuresResponse.json();
                audioFeatures.push(...featuresData.audio_features);
            }

            // Combine track details with their audio features
            const tracksWithDetails = data.items.map((item, index) => ({
                name: item.track.name,
                id: item.track.id,
                albumImageUrl: item.track.album.images[0]?.url || 'path_to_default_image',
                artist: item.track.artists.map(artist => artist.name).join(', '),
                spotifyUrl: item.track.external_urls.spotify, // Spotify URL for the track
                valence: audioFeatures[index]?.valence // Valence value from the audio features
            }));

            console.log('Recently Played Tracks with Details:', tracksWithDetails);
            setTracks(tracksWithDetails)

            return tracksWithDetails;
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

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

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

                        <div className="mt-4 w-full max-w-full px-4 hidden sm:block">
                            <hr className="border-t-2 border-gray-700 dark:border-gray-300 my-4"/>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Recently Played
                                Tracks:</h2>
                            <div className="slider-container" style={{maxWidth: '100%'}}>
                                <Slider {...settings}>
                                    {recentlyPlayedTracks.map((track, index) => (
                                        <div key={index} className="p-2"
                                             onClick={() => window.open(track.spotifyUrl, "_blank")}>
                                            <div className="album-cover relative"
                                                 style={{width: '150px', height: '150px'}}>
                                                <img
                                                    src={track.albumImageUrl}
                                                    alt={track.name}
                                                    className="w-full h-full object-cover rounded-lg shadow-md"
                                                    onError={(e) => e.target.src = 'path_to_default_default_image'} // Path to your default image
                                                />
                                                <p className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-70 text-white font-bold flex items-center justify-center text-center opacity-0 hover:opacity-100 transition-all duration-300 rounded-lg">
                                                    {track.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>

                        {/*<div className="mt-4 text-left">*/}
                        {/*    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Your Saved*/}
                        {/*        Tracks:</h2>*/}
                        {/*    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">*/}
                        {/*        {savedTracks.map((track, index) => (*/}
                        {/*            <li key={index}>{track.name} by {track.artist} ({track.album})</li>*/}
                        {/*        ))}*/}
                        {/*    </ul>*/}
                        {/*</div>*/}
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
