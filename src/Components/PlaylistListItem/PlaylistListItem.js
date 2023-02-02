import React from "react";
import './PlaylistListItem.css';

const PlaylistListItem = ({ name, selectPlaylist, id }) => {
    return (
        <div className="ListItem" onClick={() => selectPlaylist(id)}>
            <p>{name}</p>
        </div>
    )
}

export default PlaylistListItem;