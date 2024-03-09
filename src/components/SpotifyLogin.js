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
    }, [navigate]);

    const fetchUserDetails = (token) => {
        fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error fetching user details:', data.error);
                    return handleLogout(); // Logout on error
                }
                setUserDetails({
                    id: data.id,
                    displayName: data.display_name,
                    email: data.email || 'Email not provided',
                    profileImage: data.images.length > 0 ? data.images[0].url : undefined,
                    country: data.country || 'Country not provided',
                    followers: data.followers ? data.followers.total : 'Followers not provided',
                });
                // After setting user details, fetch the recently played tracks
                fetchRecentlyPlayedTracks(token);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                handleLogout(); // Ensure logout on fetch error
            });
    };

    const fetchAudioFeaturesForTrack = async (token, trackId) => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Response not OK');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching audio features:', error);
            return null;
        }
    };

    const fetchRecentlyPlayedTracks = async (token) => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Response not OK');
            const data = await response.json();

            const tracksWithFeatures = [];

            for (const item of data.items) {
                const track = item.track;
                const audioFeatures = await fetchAudioFeaturesForTrack(token, track.id);
                if (audioFeatures) {
                    tracksWithFeatures.push({
                        name: track.name,
                        id: track.id,
                        valence: audioFeatures.valence // Store the valence value
                    });
                }
            }

            // Sort tracks by valence in ascending order
            tracksWithFeatures.sort((a, b) => a.valence - b.valence);

            console.log('Sorted Tracks by Valence:', tracksWithFeatures);
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
        const clientId = 'b564775eab8f4d6e976a1179ff673e6c'; // Your actual Spotify Client ID
        const redirectUri = encodeURIComponent(`${window.location.origin}/spotify-login`);
        const scopes = ['user-read-private', 'user-read-email', 'user-read-recently-played', 'user-library-read'];
        window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(scopes.join(' '))}&redirect_uri=${redirectUri}&show_dialog=true`;
    };

    const handleLogout = () => {
        localStorage.removeItem('spotifyAccessToken');
        setUserDetails(null);
    };

    const handleContinue = () => {
        navigate('/biometric-form'); // Navigate to the next page
    };

    return (
        <div className="bg-gradient-to-r from-green-400 to-blue-500 dark:from-gray-700 dark:to-gray-900 min-h-screen flex items-center justify-center px-4 py-10">
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
            <div className="max-w-2xl w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 space-y-6 text-center">
                {userDetails ? (
                    <>
                        <img src={userDetails.profileImage || currentLogo} alt="Profile" className="mx-auto h-20 w-20 rounded-full"/>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome, {userDetails.displayName}</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">ID: {userDetails.id}</p>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Email: {userDetails.email}</p>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Country: {userDetails.country}</p>

                        <ResponsiveMasonry columnsCountBreakPoints={{350: 2, 750: 2, 900: 2}}>
                            <Masonry gutter="20px">
                                <button onClick={handleLogout}
                                        className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-base font-medium hover:font-bold rounded-md text-white bg-red-600 hover:bg-red-700 transition-transform duration-200 hover:scale-105">
                                    Logout <FaSignOutAlt className="ml-2"/>
                                </button>

                                <button onClick={handleContinue}
                                        className="flex items-center justify-center w-full mb-4 px-4 py-2 border border-transparent text-base font-medium hover:font-bold rounded-md text-white bg-green-600 hover:bg-green-700 transition-transform duration-200 hover:scale-105">
                                    Continue <FaArrowRight className="ml-2"/>
                                </button>
                            </Masonry>
                        </ResponsiveMasonry>

                        <div className="mt-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Your Saved Tracks:</h2>
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
                        <p className="text-lg text-gray-600 dark:text-gray-300">Experience music tailored to your emotions.</p>
                        <button onClick={handleLogin}
                                className="mt-6 w-full flex justify-center items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-transform duration-200 hover:scale-105">
                            <FaSpotify className="mr-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl"/> Login with Spotify
                        </button>
                        <div className="mt-8 text-left">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">HarmonizeAI Access:</h3>
                            <ul className="mt-2 text-sm text-gray-700 dark:text-gray-300 list-inside list-disc">
                                <li>Access to your Spotify account data</li>
                                <ul className="pl-6">
                                    <li>Name, username, and profile picture</li>
                                    <li>Followers and public playlists</li>
                                </ul>
                                <li>Analysis of your Spotify activity</li>
                                <ul className="pl-6">
                                    <li>Recently played content</li>
                                    <li>Your most iconic tracks</li>
                                </ul>
                            </ul>
                            <p className="mt-4 italic text-gray-700 dark:text-gray-300">
                                We value your privacy and only use your data to enhance your music experience.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SpotifyLogin;
