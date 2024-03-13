import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaHome } from 'react-icons/fa'; // Importing home icon for navigation

const NotFoundPage = () => {
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    };

    return (
        <div
            // className="bg-gradient-to-r from-green-400 to-blue-500 dark:from-gray-700 dark:to-gray-900 min-h-screen flex items-center justify-center px-4 py-10"
        >
            <Helmet>
                <title>404 Not Found - HarmonizeAI</title>
                <meta name="description" content="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable." />
            </Helmet>
            <div className="max-w-2xl w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 space-y-6 text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                    Oops! Page Not Found.
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <button
                    onClick={navigateHome}
                    className="mt-6 w-full flex justify-center items-center px-6 py-3 border border-transparent text-lg font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out hover:scale-105"
                >
                    Return Home
                    <FaHome className="ml-2" />
                </button>
                <p className="text-sm text-gray-500 mt-4">
                    Let's take you back to a safe place.
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;
