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

export default function Search() {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error] = useState("");
  const { isSignedIn } = useUser();

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
    const data = { query, predictions };
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
    </div>
  );
}
