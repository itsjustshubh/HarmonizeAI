import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lightLogo from '../icons/light-logo.png';
import darkLogo from '../icons/dark-logo.png';
import { FaHeadphonesAlt } from 'react-icons/fa';
import {Helmet} from "react-helmet"; // Importing icon for aesthetics

const IntroSplashScreen = () => {
    const navigate = useNavigate();
    const [currentLogo, setCurrentLogo] = useState(lightLogo);
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

    useEffect(() => {
        const matchDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
        const handleThemeChange = (e) => {
            setIsDarkMode(e.matches);
            setCurrentLogo(e.matches ? darkLogo : lightLogo);
        };

        handleThemeChange(matchDarkMode);
        matchDarkMode.addEventListener('change', handleThemeChange);

        const timer = setTimeout(() => navigate('/intro'), 3000); // Total display time including fade-out

        return () => {
            clearTimeout(timer);
            matchDarkMode.removeEventListener('change', handleThemeChange);
        };
    }, [navigate]);

    return (
        <div
            className="bg-gradient-to-r from-green-400 to-blue-500 dark:from-gray-700 dark:to-gray-900 min-h-screen flex items-center justify-center px-4 py-10">
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
            <div className="text-center">
                <img src={currentLogo} alt="Logo" className="mx-auto h-48 animate-pulse"/>
                <h1 className={`text-5xl font-bold my-4 transition-colors duration-500 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    Welcome to Harmonize AI
                </h1>
                <p className={`text-xl transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                    Discover music that matches your mood.
                </p>
                <FaHeadphonesAlt className="mx-auto text-6xl my-4 text-indigo-500 animate-pulse"/>
            </div>
        </div>
    );
};

export default IntroSplashScreen;
