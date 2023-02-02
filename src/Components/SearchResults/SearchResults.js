import React, {useState} from "react";
import TrackList from "../TrackList/TrackList";
import "./SearchResults.css";

const SearchResults = ({searchResults, onAdd}) => {
  const [isRemoval, setIsRemoval] = useState(false);

  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <TrackList tracks={searchResults} onAdd={onAdd} isRemoval={isRemoval}/>
    </div>
  );
};

export default SearchResults;
