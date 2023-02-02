import React, { useState, useEffect, useCallback } from "react";
import Spotify from "../../util/Spotify";
import "./PlaylistList.css";
import PlaylistListItem from "../PlaylistListItem/PlaylistListItem";

const PlaylistList = ({ selectPlaylist, createPlaylist }) => {
    const [playlistList, setplaylistList] = useState([]);

    const fetchData = useCallback(async () => {
        const list = await Spotify.getUserPlaylist();
        setplaylistList(list);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="PlaylistList">
            <h2>Local Playlists</h2>
            {playlistList.map((playlist) => (
                <PlaylistListItem
                    key={playlist.playlistId}
                    id={playlist.playlistId}
                    name={playlist.name}
                    selectPlaylist={selectPlaylist}
                />
            ))}
            <button className="createPlaylist" onClick={() => createPlaylist()}>CREATE NEW PLAYLIST</button>
        </div>
    );
};

export default PlaylistList;
