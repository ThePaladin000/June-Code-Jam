import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { fetchAutocompleteSuggestions } from "../utils/utils";
import { useUser } from "@clerk/clerk-react";
import "./search.css";

const SEARCH_LIMIT = 3;
const STORAGE_KEY = "searches_this_month";

function getMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

function getSearchCount() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const key = getMonthKey();
  return data[key] || 0;
}

function incrementSearchCount() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const key = getMonthKey();
  data[key] = (data[key] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function Search({ onPlacesFetched }) {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const { isSignedIn } = useUser();

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedPrediction(null);
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
    const prediction = predictions.find((p) => p.description === desc);
    setSelectedPrediction(prediction || null);
    setShowDropdown(false);
  };

  const fetchPlaceDetails = async (placeId) => {
    const response = await fetch(`/api/place-details?placeId=${placeId}`);
    if (!response.ok) throw new Error("Failed to fetch place details");
    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      const count = getSearchCount();
      if (count >= SEARCH_LIMIT) {
        alert(
          "You have reached your free search limit for this month. Please sign in for unlimited searches."
        );
        return;
      }
      incrementSearchCount();
    }
    try {
      let predictionToFetch = selectedPrediction;
      if (!predictionToFetch && predictions.length > 0) {
        predictionToFetch = predictions[0];
      }
      if (!predictionToFetch) {
        setError("Please select a place from the suggestions.");
        if (onPlacesFetched) onPlacesFetched([]);
        return;
      }
      // Fetch nearby parks for the selected place
      const response = await fetch(
        `/api/nearby-parks?placeId=${predictionToFetch.placeId}`
      );
      if (!response.ok) throw new Error("Failed to fetch nearby parks");
      const data = await response.json();
      if (onPlacesFetched) onPlacesFetched(data.parks || []);
    } catch (err) {
      setError("Error fetching nearby parks");
      if (onPlacesFetched) onPlacesFetched([]);
    }
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
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
