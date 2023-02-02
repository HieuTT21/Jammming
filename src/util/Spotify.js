const clientId = 'b463fd7b51444b38b2db57366549a693';
const redirectURI = 'http://localhost:3000/';

let accessToken;
let userId;

const Spotify = {
    getAccessToken: () => {
        if (accessToken) return accessToken;

        const href = window.location.href;
        const accessTokenMatch = href.match(/access_token=([^&]*)/);
        const expiresInMatch = href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');

            return accessToken;
        } else {
            window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
        }
    },

    getCurrentUserId: async () => {
        if (userId) return;

        const accessToken = Spotify.getAccessToken();
        const header = { Authorization: `Bearer ${accessToken}` };

        try {
            const response = await fetch('https://api.spotify.com/v1/me', { headers: header });
            if (response.ok) {
                const json = await response.json();
                userId = json.id;
            }
        } catch (e) {
            console.log(e)
        }
    },

    search: async (term) => {
        const accessToken = Spotify.getAccessToken();

        try {
            const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })

            if (response.ok) {
                const json = await response.json();

                if (!json.tracks) return [];
    
                return json.tracks.items.map((track) => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                    preview: track.preview_url,
                    image: track.album.images[0].url
                }));
            }
        } catch (e) {
            console.log(e);
        }
    },

    savePlaylist: async (name, trackURIs, id) => {
        if (!name || !trackURIs.length) return;

        const accessToken = Spotify.getAccessToken();
        const header = { Authorization: `Bearer ${accessToken}` };

        await Spotify.getCurrentUserId();

        if (id) {
            try {
                const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${id}`, {
                    headers: header,
                    method: 'PUT',
                    body: JSON.stringify({ name: name })
                })
                if (response.ok) {
                    try {
                        await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${id}/tracks`, {
                            headers: header,
                            method: 'PUT',
                            body: JSON.stringify({ uris: trackURIs })
                        })
                    } catch(e) {
                        console.log(e)
                    }
                }
            } catch(e) {
                console.log(e);
            }
        } else {
            try {
                const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: header,
                    method: 'POST',
                    body: JSON.stringify({ name: name })
                })
                if (response.ok) {
                    const json = await response.json();
                    const playlistId = json.id;
    
                    try {
                        await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                            headers: header,
                            method: 'POST',
                            body: JSON.stringify({ uris: trackURIs })
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
            } catch (e) {
                console.log(e)
            }
        } 
    },

    getUserPlaylist: async () => {
        const accessToken = Spotify.getAccessToken();
        const header = { Authorization: `Bearer ${accessToken}` };

        await Spotify.getCurrentUserId();

        try {
            const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: header
            })

            if (response.ok) {
                const json = await response.json();

                if (!json.items) return [];
 
                return json.items.map(playlist => ({
                    playlistId: playlist.id,
                    name: playlist.name
                }))
            }
        } catch(e) {
            console.log(e);     
        }
    },

    getPlaylist: async (id) => {
        const accessToken = Spotify.getAccessToken();
        const header = { Authorization: `Bearer ${accessToken}` };

        await Spotify.getCurrentUserId();

        try {
            const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${id}`, {
                headers: header
            })

            if (response.ok) {
                const json = await response.json();
                const playlistName = json.name;

                try {
                    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${id}/tracks`, {
                        headers: header
                    })
        
                    if (response.ok) {
                        const json = await response.json();
        
                        const trackList = json.items.map(track => track.track);
                        const getAllTracks = trackList.map(track => ({
                            id: track.id,
                            name: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            uri: track.uri,
                            preview: track.preview_url,
                            image: track.album.images[0].url
                        }))

                        return {
                            name: playlistName,
                            tracks: getAllTracks
                        };
                    }
                } catch(e) {
                    console.log(e)
                }
            }
        } catch(e) {
            console.log(e);
        }        
    }
}

export default Spotify;

