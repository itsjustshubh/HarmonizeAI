import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaHome } from 'react-icons/fa';
import ThemeSwitch from "./ThemeSwitch"; // Importing home icon for navigation

const OutroPage = () => {
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    };

    return (
        <div
            // className="bg-gradient-to-r from-purple-400 to-pink-500 dark:from-gray-700 dark:to-gray-900 min-h-screen flex items-center justify-center px-4 py-10"
        >
            <Helmet>
                <title>Thank You - HarmonizeAI</title>
                <meta name="description" content="Thank you for experiencing your music journey with HarmonizeAI." />
            </Helmet>
            <div className="max-w-2xl w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 space-y-8 text-center">
                <ThemeSwitch/>

                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Thank You for Using HarmonizeAI!
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    We hope you enjoyed your personalized music experience.
                </p>
                <button
                    onClick={navigateHome}
                    className="mt-6 w-full flex justify-center items-center px-6 py-3 border border-transparent text-lg font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out hover:scale-105"
                >
                    Return Home
                    <FaHome className="ml-2" />
                </button>
                <p className="text-sm text-gray-500 mt-4">
                    Looking forward to your next visit!
                </p>
            </div>
        </div>
    );
};

export default OutroPage;
