import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { fetchAutocompleteSuggestions } from "../utils/utils";
import Cards from "./cards";
import "./cards.css";
import "./search.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value) {
      const results = await fetchAutocompleteSuggestions(value);
      setPredictions(results);
      setShowDropdown(results.length > 0);
    } else {
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (desc) => {
    setQuery(desc);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted query:", query);
    console.log("Predictions:", predictions);
  };

  return (
    <div className="search-container">
      <form className="search-form" autoComplete="off" onSubmit={handleSubmit}>
        <span className="search-icon">
          <FaSearch />
        </span>
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={handleChange}
          onFocus={() => predictions.length && setShowDropdown(true)}
        />
        {showDropdown && predictions.length > 0 && (
          <ul className="autocomplete-dropdown">
            {predictions.map((p) => (
              <li
                key={p.placeId}
                onMouseDown={() => handleSelect(p.description)}
                className="autocomplete-item"
              >
                <span style={{ fontWeight: "bold" }}>{p.mainText}</span>
                <span style={{ color: "#888", marginLeft: 4 }}>
                  {p.secondaryText}
                </span>
              </li>
            ))}
          </ul>
        )}
      </form>
      <Cards />
    </div>
  );
}
