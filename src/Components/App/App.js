import React, { useState } from "react";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Spotify from "../../util/Spotify";
import PlaylistList from "../PlaylistList/PlaylistList";
import "./App.css";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);

  const addTrack = (track) => {
    if (!playlistTracks.some((song) => song.id === track.id)) {
      setPlaylistTracks((prev) => [track, ...prev]);
    }
  };

  const removeTrack = (track) => {
    setPlaylistTracks(() =>
      playlistTracks.filter((song) => song.id !== track.id)
    );
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylist = async () => {
    const trackURIs = playlistTracks.map(track => track.uri);

    await Spotify.savePlaylist(playlistName, trackURIs, playlistId);

    setPlaylistName('New Playlist');
    setPlaylistTracks([]); 
    setPlaylistId(null);
  }

  const search = async (term) => {
    const searchResults = await Spotify.search(term);
    setSearchResults(searchResults); 
  }

  const selectPlaylist = async (id) => {
    const spotify = await Spotify.getPlaylist(id);
    
    setPlaylistTracks(spotify.tracks);
    setPlaylistName(spotify.name);
    setPlaylistId(id);
  }

  const createPlaylist = () => {
    setPlaylistName('New Playlist');
    setPlaylistTracks([]);
    setPlaylistId(null);
  }

  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        <SearchBar onSearch={search}/>
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist} 
          />
          <PlaylistList selectPlaylist={selectPlaylist} createPlaylist={createPlaylist}/>
        </div>
      </div>
    </div>
  );
};

export default App;
