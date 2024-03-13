import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransitionWrapper } from './PageTransitionWrapper'; // Ensure correct path
import { Analytics } from "@vercel/analytics/react"

// Import your page components
import IntroSplashScreen from './components/IntroSplashScreen';
import IntroPage from './components/IntroPage';
import SpotifyLogin from './components/SpotifyLogin';
import BiometricForm from './components/BiometricForm';
import PlaylistDisplay from './components/PlaylistDisplay';
import OutroPage from './components/OutroPage';
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingPlaylist from "./components/LoadingPlaylist";

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
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <ErrorBoundary>
            <div
                className="bg-gradient-to-r from-green-400 to-blue-500 dark:from-gray-700 dark:to-gray-900 min-h-screen flex items-center justify-center px-5 py-5 p-6">
                <AnimatedRoutes/>
            </div>
            </ErrorBoundary>
            <Analytics/>
        </Router>
    );
}

export default App;
