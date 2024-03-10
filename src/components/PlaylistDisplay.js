import React, { Component } from 'react';

class PlaylistDisplay extends Component {
    render() {
        // Dummy data for the playlist
        const playlist = [
            { id: 1, name: 'Song One' },
            { id: 2, name: 'Song Two' },
            { id: 3, name: 'Song Three' },
            // ... more songs
        ];

        return (
            <div>
                <h1>Your Playlist</h1>
                <ul>
                    {playlist.map(song => (
                        <li key={song.id}>{song.name}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default PlaylistDisplay;
