import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your page components
import IntroSplashScreen from './components/IntroSplashScreen';
import IntroPage from './components/IntroPage';
import SpotifyLogin from './components/SpotifyLogin';
import BiometricForm from './components/BiometricForm';
import PlaylistDisplay from './components/PlaylistDisplay';
import OutroPage from './components/OutroPage';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<IntroSplashScreen />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/spotify-login" element={<SpotifyLogin />} />
          <Route path="/biometric-form" element={<BiometricForm />} />
          <Route path="/playlist" element={<PlaylistDisplay />} />
          <Route path="/outro" element={<OutroPage />} />
        </Routes>
      </Router>
  );
}

export default App;
