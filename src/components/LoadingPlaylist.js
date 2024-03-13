import React, { useState, useEffect, useContext } from 'react';
import socketio from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { TrackContext } from "./TrackContext"; // Adjust path as needed

const LoadingPlaylist = () => {
    const [messages, setMessages] = useState([]);
    const [finalResults, setFinalResults] = useState(null);
    const [additionalTracks, setAdditionalTracks] = useState([]);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const { tracks, setTracks } = useContext(TrackContext);

    const navigate = useNavigate();

    useEffect(() => {
        const sio = socketio('http://127.0.0.1:5000');

        sio.on('progress', (data) => {
            setMessages(prevMessages => [...prevMessages, data]);
        });

        sio.on('completed', (data) => {
            setFinalResults(data.results);
            sio.disconnect();
        });

        return () => sio.disconnect();
    }, []);

    const latestMessage = messages[messages.length - 1];

    const handleLogout = () => {
        localStorage.removeItem('spotifyAccessToken');
    };

    const renderDetails = (details) => {
        return Object.entries(details).map(([key, value], index) => (
            <div key={index} className="text-lg font-medium text-gray-700 dark:text-gray-400">
                <span className="capitalize">{key.replace(/_/g, ' ')}:</span> {value.toString()}
            </div>
        ));
    };

    const ErrorPopup = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
                <h2 className="text-xl font-bold mb-2">Recently Played Tracks</h2>
                <p>You don't have any recently played tracks. We are signing you out, Bye!</p>
            </div>
        </div>
    );

    useEffect(() => {
        if (finalResults) {
            fetchAdditionalTracks();
        }
    }, [finalResults]);

    useEffect(() => {
        if (!tracks || tracks.length === 0) {
            setShowErrorPopup(true);
            handleLogout();
            setTimeout(() => navigate('/spotify-login'), 3000);
        }
    }, [tracks, navigate]);

    // Function to remove duplicates from the tracks array
    const removeDuplicates = (tracks) => {
        const uniqueTracks = new Map();
        tracks.forEach(track => {
            if (!uniqueTracks.has(track.id)) {
                uniqueTracks.set(track.id, track);
            }
        });
        return Array.from(uniqueTracks.values());
    };

    const fetchAdditionalTracks = async () => {
        let allNewTracks = [];
        for (const prediction of finalResults.flatMap(result => result.Predictions)) {
            const newTracks = await searchFamousSongs(prediction['Valence Range']);
            allNewTracks.push(...newTracks);
        }
        setAdditionalTracks(removeDuplicates(allNewTracks));
    };

    const filterTracksByValence = (results, availableTracks) => {
        if (!results || !availableTracks) {
            return [];
        }

        let relevantTracks = [];
        results.forEach(result => {
            result.Predictions.forEach(prediction => {
                const valenceRange = prediction['Valence Range'];
                const matchedTracks = availableTracks.filter(track =>
                    track.valence >= valenceRange[0] && track.valence <= valenceRange[1]
                );
                relevantTracks.push(...matchedTracks);
            });
        });

        const tracks = removeDuplicates(relevantTracks);
        setTracks(tracks);
        return tracks;
    };

    const playlistTracks = filterTracksByValence(finalResults, tracks);

    const searchFamousSongs = async (valenceRange) => {
        const accessToken = localStorage.getItem('spotifyAccessToken');
        const query = `valence:${valenceRange[0]}-${valenceRange[1]} AND year:2020-2022`; // Modify the query as needed
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&market=US&limit=10`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await response.json();
        return data.tracks.items;
    };

    return (
        <div>
            {!showErrorPopup &&
                <div className="message-box bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg max-w-lg w-full">
                    {latestMessage && (
                        <div className="animate-fade-in-down">
                            <p className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">{latestMessage.stage}</p>
                            {latestMessage.details &&
                                <div className="space-y-2 mt-3">{renderDetails(latestMessage.details)}</div>}
                        </div>
                    )}

                    {finalResults && (
                        <div>
                            <div className="animate-fade-in-down mt-4">
                                <p className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">Analysis Results:</p>
                                <div className="space-y-2 mt-3 text-lg font-medium text-gray-700 dark:text-gray-400">
                                    {JSON.stringify(finalResults, null, 2)}
                                </div>
                            </div>

                            <div className="animate-fade-in-down mt-4">
                                <div className="mt-4">
                                    <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Playlist
                                        Tracks</h3>
                                    <div className="space-y-4">
                                        {/*{playlistTracks.map((track, index) => (*/}
                                        {/*    <div key={index}*/}
                                        {/*         className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow">*/}
                                        {/*        <img src={track.albumImageUrl} alt={track.name}*/}
                                        {/*             className="w-12 h-12 object-cover rounded-full mr-4"/>*/}
                                        {/*        <div>*/}
                                        {/*            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">{track.name}</p>*/}
                                        {/*            <p className="text-sm text-gray-500 dark:text-gray-400">{track.artist}</p>*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*))}*/}
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/playlist')}
                                    className="py-2 px-6 bg-indigo-600 text-white w-full font-bold rounded-lg shadow-md hover:bg-indigo-700 mt-6"
                                >
                                    View Playlist
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            }

            {showErrorPopup && <ErrorPopup/>}
        </div>
    );
};

export default LoadingPlaylist;
