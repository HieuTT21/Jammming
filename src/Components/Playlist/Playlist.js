import React, {useState} from "react";
import TrackList from "../TrackList/TrackList";
import "./Playlist.css";

const Playlist = ({ playlistTracks, onRemove, onNameChange, onSave, playlistName }) => {
  const [isRemoval, setIsRemoval] = useState(true);

  const handleNameChange = (e) => {
    onNameChange(e.target.value);
  }

  return (
    <div className="Playlist">
      {
        playlistName ? 
          <input value={playlistName} onChange={handleNameChange}/>
        : <input defaultValue={"New Playlist"} onChange={handleNameChange}/>
      }
      
      <TrackList tracks={playlistTracks} onRemove={onRemove} isRemoval={isRemoval}/>
      <button className="Playlist-save" onClick={onSave}>SAVE TO SPOTIFY</button>
    </div>
  );
};

export default Playlist;
