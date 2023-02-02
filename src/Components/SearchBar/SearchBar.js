import React, {useState} from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const search = () => {
    onSearch(searchTerm)
  }

  const handleTermChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="SearchBar">
      <input placeholder="Enter A Song, Album, or Artist" onChange={handleTermChange} required/>
      <button className="SearchButton" onClick={search}>SEARCH</button>
    </div>
  );
};

export default SearchBar;
