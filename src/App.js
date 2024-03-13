import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext'; // Ensure correct path
import { Analytics } from "@vercel/analytics/react"
import ErrorBoundary from "./components/ErrorBoundary";

// Import your page components
import IntroSplashScreen from './components/IntroSplashScreen';
import IntroPage from './components/IntroPage';
import SpotifyLogin from './components/SpotifyLogin';
import BiometricForm from './components/BiometricForm';
import PlaylistDisplay from './components/PlaylistDisplay';
import OutroPage from './components/OutroPage';
import LoadingPlaylist from "./components/LoadingPlaylist";
import NotFoundPage from "./components/NotFoundPage";
import {MoonIcon, SunIcon} from "@heroicons/react/solid";
import {AnimatePresence} from "framer-motion";
import {PageTransitionWrapper} from "./PageTransitionWrapper";
import ThemeSwitch from "./components/ThemeSwitch";

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransitionWrapper><IntroSplashScreen /></PageTransitionWrapper>} exact />
                <Route path="/intro" element={<PageTransitionWrapper><IntroPage /></PageTransitionWrapper>} />
                <Route path="/spotify-login" element={<PageTransitionWrapper><SpotifyLogin /></PageTransitionWrapper>} />
                <Route path="/biometric-form" element={<PageTransitionWrapper><BiometricForm /></PageTransitionWrapper>} />
                <Route path="/loading-playlist" element={<PageTransitionWrapper><LoadingPlaylist /></PageTransitionWrapper>} />
                <Route path="/playlist" element={<PageTransitionWrapper><PlaylistDisplay /></PageTransitionWrapper>} />
                <Route path="/outro" element={<PageTransitionWrapper><OutroPage /></PageTransitionWrapper>} />
                <Route path="*" element={<PageTransitionWrapper><NotFoundPage /></PageTransitionWrapper>} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    const [darkTheme, setDarkTheme] = useState(true);

    useEffect(() => {
        // Apply the theme class to the body element
        if (darkTheme) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkTheme]); // Re-run effect when darkTheme state changes

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    return (
        <Router>
            <ThemeProvider>
                <ErrorBoundary>
                    {/*<div*/}
                    {/*    className="bg-gradient-to-r from-green-400 to-blue-500 dark:from-gray-700 dark:to-gray-900 min-h-screen flex items-center justify-center px-5 py-5 p-6">*/}
                    {/*    <AnimatedRoutes/>*/}
                    {/*</div>*/}

                    <div
                        className="
                        dark:bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] dark:from-blue-700 dark:via-blue-800 dark:to-gray-900
                        bg-gradient-to-r from-green-400 via-teal-500 to-cyan-600
                        min-h-screen flex items-center justify-center px-5 py-5 p-6">
                        <AnimatedRoutes/>
                    </div>

                    {/*<button*/}
                    {/*    onClick={toggleTheme}*/}
                    {/*    className="fixed top-10 right-10 bg-blue-500 dark:bg-gray-700 text-white p-2 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-gray-500 transition duration-300"*/}
                    {/*>*/}
                    {/*    {darkTheme ? <SunIcon className="h-6 w-6"/> : <MoonIcon className="h-6 w-6"/>}*/}
                    {/*</button>*/}
                </ErrorBoundary>
                <Analytics/>
            </ThemeProvider>
        </Router>
    );
}

export default App;
