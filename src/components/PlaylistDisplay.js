import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackContext } from './TrackContext';

const PlaylistDisplay = () => {
    console.log("PlaylistDisplay rendered");
    const navigate = useNavigate();
    const { tracks } = useContext(TrackContext);

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('spotifyAccessToken');
    };

    // Check if tracks array is empty and redirect if necessary
    useEffect(() => {
        if (!tracks || tracks.length === 0) {
            handleLogout();
            navigate('/spotify-login');
        }
    }, [tracks, navigate]);

    const navigateToOutro = () => {
        navigate('/outro');
    };

    return (
        <div className="py-8 px-4">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Your Playlist:</h2>

            {/*<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">*/}
            {/*    {tracks.map((track, index) => (*/}
            {/*        <div key={index}*/}
            {/*             className="bg-white dark:bg-gray-800 rounded-xl shadow-lg transform hover:scale-105 transition duration-500 overflow-hidden">*/}
            {/*            <img src={track.albumImageUrl} alt={track.name} className="w-full h-64 object-cover"/>*/}
            {/*            <div className="p-4">*/}
            {/*                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{track.name}</h3>*/}
            {/*                <p className="text-sm text-gray-600 dark:text-gray-300">Artist: {track.artist}</p>*/}
            {/*                <p className="text-sm text-gray-600 dark:text-gray-300">Valence: {parseFloat(track.valence).toFixed(2)}</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}

            {/*<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">*/}
            {/*    {tracks.map((track, index) => (*/}
            {/*        <div key={index}*/}
            {/*             className="bg-white dark:bg-gray-800 rounded-xl shadow-lg transform hover:scale-105 transition duration-500 overflow-hidden">*/}
            {/*            <img src={track.albumImageUrl} alt={track.name} className="w-full h-64 object-cover"/>*/}
            {/*            <div className="p-4">*/}
            {/*                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{track.name}</h3>*/}
            {/*                <p className="text-sm text-gray-600 dark:text-gray-300">Artist: {track.artist}</p>*/}
            {/*                <p className="text-sm text-gray-600 dark:text-gray-300">Valence: {parseFloat(track.valence).toFixed(2)}</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}

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
