import { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Cards from "./cards";
import "./cards.css";
import "./search.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const autocompleteServiceRef = useRef(null);

  // Only initialize AutocompleteService if available
  if (
    !autocompleteServiceRef.current &&
    window.google &&
    window.google.maps &&
    window.google.maps.places
  ) {
    autocompleteServiceRef.current =
      new window.google.maps.places.AutocompleteService();
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        { input: value },
        (preds) => {
          setPredictions(preds || []);
          setShowDropdown(!!preds && preds.length > 0);
        }
      );
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
                key={p.place_id}
                onMouseDown={() => handleSelect(p.description)}
                className="autocomplete-item"
              >
                {p.description}
              </li>
            ))}
          </ul>
        )}
      </form>
      <Cards />
    </div>
  );
}
