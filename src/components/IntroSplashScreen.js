import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lightLogo from '../icons/light-logo.png';
import darkLogo from '../icons/dark-logo.png';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import customDarkLogo from "../icons/dark-logo.png";
import customLightLogo from "../icons/light-logo.png"; // Ensure correct path

const IntroSplashScreen = () => {
    const navigate = useNavigate();
    const { darkTheme } = useTheme();
    const [currentLogo, setCurrentLogo] = useState(darkTheme ? customDarkLogo : customLightLogo);

    useEffect(() => {
        setCurrentLogo(darkTheme ? customDarkLogo : customLightLogo);
    }, [darkTheme]);

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
        <div className="text-center">
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

            <img src={currentLogo} alt="Logo" className="mx-auto h-48 animate-pulse"/>
            <h1 className={`text-5xl font-bold my-4 dark:text-gray-100 text-gray-800'}`}>
                Welcome to Harmonize AI
            </h1>
            <p className={`text-xl dark:text-gray-200 text-gray-600`}>
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
    );
};

export default IntroSplashScreen;
