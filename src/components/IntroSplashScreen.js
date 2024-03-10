import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lightLogo from '../icons/light-logo.png';
import darkLogo from '../icons/dark-logo.png';
import { FaHeadphonesAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

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

        return () => {
            matchDarkMode.removeEventListener('change', handleThemeChange);
        };
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay: 2,
                duration: 1
            }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.1 },
        tap: { scale: 0.95 }
    };

    return (
        <div
            // className="bg-gradient-to-r from-green-400 to-blue-500 dark:from-gray-700 dark:to-gray-900 min-h-screen flex items-center justify-center px-4 py-10"
        >
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
                <h1 className={`text-5xl font-bold my-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    Welcome to Harmonize AI
                </h1>
                <p className={`text-xl ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                    Discover music that matches your mood.
                </p>
                <motion.div
                    className="flex justify-center items-center mt-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.button
                        onClick={() => navigate('/intro')}
                        className="py-2 px-6 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Welcome
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default IntroSplashScreen;
