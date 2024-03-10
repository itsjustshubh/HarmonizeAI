import React, { createContext, useState } from 'react';

export const TrackContext = createContext();

export const TrackProvider = ({ children }) => {
    const [tracks, setTracks] = useState([]);

    return (
        <TrackContext.Provider value={{ tracks, setTracks }}>
            {children}
        </TrackContext.Provider>
    );
};
