import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { fetchAutocompleteSuggestions } from "../../utils/utils";
import { useUser } from "@clerk/clerk-react";
import "./Search.css";
import Header from "../Header/Header";

const SEARCH_LIMIT = 10;
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

export default function Search({ onPlacesFetched, onLoading }) {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const { isSignedIn } = useUser();

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedPrediction(null);
    setHighlightedIndex(-1);
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
    setTimeout(() => {
      document
        .querySelector(".search-form")
        .dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || predictions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % predictions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(
        (prev) => (prev - 1 + predictions.length) % predictions.length
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < predictions.length) {
        handleSelect(predictions[highlightedIndex].description);
        e.preventDefault();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowDropdown(false);
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
      if (onLoading) onLoading(true);
      const response = await fetch(
        `/api/nearby-parks?placeId=${predictionToFetch.placeId}`
      );
      if (!response.ok) throw new Error("Failed to fetch nearby parks");
      const data = await response.json();
      if (onPlacesFetched) onPlacesFetched(data.parks || []);
    } catch (err) {
      setError("Error fetching nearby parks");
      if (onPlacesFetched) onPlacesFetched([]);
      console.error("Error fetching nearby parks", err);
    } finally {
      if (onLoading) onLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="search-container">
        <form
          className="search-form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <span className="search-icon">
            <FaSearch />
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Add an address to find nearby parks"
            value={query}
            onChange={handleChange}
            onFocus={() => predictions.length && setShowDropdown(true)}
            onKeyDown={handleKeyDown}
          />
          {showDropdown && predictions.length > 0 && (
            <ul className="autocomplete-dropdown">
              {predictions.map((p, i) => (
                <li
                  key={p.placeId}
                  onMouseDown={() => handleSelect(p.description)}
                  className={`autocomplete-item${
                    i === highlightedIndex ? " highlighted" : ""
                  }`}
                >
                  <span className="autocomplete-suggestion-main">
                    {p.mainText}
                  </span>
                  <span className="autocomplete-suggestion-secondary">
                    {p.secondaryText}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
}
