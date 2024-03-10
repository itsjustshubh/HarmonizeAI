import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackContext } from './TrackContext';

const PlaylistDisplay = () => {
    const navigate = useNavigate();

    const { tracks } = useContext(TrackContext);
    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('spotifyAccessToken');
    };

    // Check if tracks array is empty and redirect if necessary
    useEffect(() => {
        if (tracks.length === 0) {
            handleLogout();
            navigate('/spotify-login');
        }
    }, [tracks, navigate]);

    const navigateToOutro = () => {
        navigate('/outro');
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Your Recently Played Songs:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tracks.map((track, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg transform hover:scale-105 transition duration-500 overflow-hidden">
                        <div className="flex items-center p-4">
                            <img src={track.albumImageUrl} alt={track.name} className="w-24 h-24 object-cover rounded-full mr-4"/>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{track.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Artist: {track.artist}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Valence: {track.valence}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-10">
                <button
                    onClick={navigateToOutro}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-lg"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default PlaylistDisplay;
