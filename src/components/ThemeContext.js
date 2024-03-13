// ThemeContext.js

import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [darkTheme, setDarkTheme] = useState(true);

    return (
        <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
