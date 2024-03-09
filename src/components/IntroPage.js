import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import darkLogo from '../icons/dark-logo.png';
import { FaArrowRight, FaPlay, FaSpotify } from 'react-icons/fa';

const IntroPage = () => {
    const navigate = useNavigate();

    const navigateToNext = () => {
        navigate('/spotify-login');
    };

    return (
        <div className="bg-gradient-to-r from-green-400 to-blue-500 dark:from-gray-700 dark:to-gray-900 min-h-screen flex items-center justify-center px-4 py-10">
            <Helmet>
                <title>HarmonizeAI: Personalized Music Experience</title>
                <meta name="description" content="Experience a unique music journey with HarmonizeAI. Connect with Spotify, input your mood, and enjoy a customized playlist that resonates with your emotions." />
                <meta name="keywords" content="HarmonizeAI, Spotify, music, playlist, mood, emotions, personalization, music experience" />
                <meta property="og:title" content="HarmonizeAI: Personalized Music Experience" />
                <meta property="og:description" content="Connect with Spotify and discover playlists that match your mood with HarmonizeAI." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:image" content={darkLogo} /> {/* Add the path to a representative image */}
            </Helmet>
            <div className="max-w-2xl w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 space-y-6 text-center">
                <FaSpotify className="mx-auto text-6xl text-green-600 dark:text-white" />
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                    Explore Music with Your Emotions
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    Harmonize your mood with personalized Spotify playlists.
                </p>
                <ol className="list-decimal pl-6 text-lg text-gray-700 dark:text-gray-300 space-y-2 mt-4 text-left">
                    <li>Connect with your Spotify account.</li>
                    <li>Input your current mood and preferences.</li>
                    <li>Receive playlists tailored to your emotional state.</li>
                    <li>Immerse in the music that resonates with you!</li>
                </ol>
                <button
                    onClick={navigateToNext}
                    className="mt-6 w-full flex justify-center items-center px-6 py-3 border border-transparent text-lg font-bold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out hover:scale-105 animate-pulse hover:animate-none"
                >
                    Get Started
                    <FaPlay className="ml-2" />
                </button>
                <p className="text-sm text-gray-500 mt-4">
                    We respect your privacy. Your Spotify data is used only for enhancing your music experience.
                </p>
            </div>
        </div>
    );
};

export default IntroPage;
