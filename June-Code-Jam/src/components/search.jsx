import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSearch } from "../hooks/useSearch";
import "./search.css";

export default function Search() {
  const {
    query,
    predictions,
    showDropdown,
    loading,
    error,
    handleSearchInput,
    handleSelectPrediction,
    handleSearchSubmit,
    showPredictionsDropdown,
    hidePredictionsDropdown,
    searchesRemaining
  } = useSearch();

  const handleChange = (e) => {
    handleSearchInput(e.target.value);
  };

  const handleSelect = (prediction) => {
    handleSelectPrediction(prediction);
  };

  return (
    <div className="search-container">
      <form className="search-form" autoComplete="off" onSubmit={handleSearchSubmit}>
        <span className="search-icon">
          <FaSearch />
        </span>
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={handleChange}
          onFocus={showPredictionsDropdown}
          onBlur={hidePredictionsDropdown}
          placeholder="Search for green spaces..."
        />
        {showDropdown && predictions.length > 0 && (
          <ul className="autocomplete-dropdown">
            {predictions.map((p) => (
              <li
                key={p.placeId}
                onMouseDown={() => handleSelect(p)}
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
      
      {/* Optional: Show search limits for free users */}
      {searchesRemaining !== null && (
        <p style={{ fontSize: '12px', color: '#666' }}>
          {searchesRemaining} free searches remaining this month
        </p>
      )}
      
      {/* Show loading/error states */}
      {loading && <p>Searching...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}