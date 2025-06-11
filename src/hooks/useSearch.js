import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { fetchAutocompleteSuggestions } from "../utils/utils";
import { placesService } from "../utils/index";
import {
  getSearchCount,
  incrementSearchCount,
  getSearchHistory,
  addToSearchHistory,
  clearSearchHistory as clearStoredHistory,
  getSearchLimit,
  getSearchesRemaining,
} from "../utils/searchUtils";

export function useSearch() {
  const { isSignedIn } = useUser();

  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const debounceTimerRef = useRef(null);

  useEffect(() => {
    const history = getSearchHistory();
    setSearchHistory(history);
  }, []);

  const fetchPredictions = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await fetchAutocompleteSuggestions(searchTerm);
      setPredictions(results);
      setShowDropdown(results.length > 0);
    } catch (err) {
      setError("Failed to fetch suggestions");
      console.error("Error fetching autocomplete suggestions:", err);
      setPredictions([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchInput = useCallback(
    (value) => {
      setQuery(value);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        fetchPredictions(value);
      }, 300);
    },
    [fetchPredictions]
  );

  const handleSelectPrediction = useCallback((prediction) => {
    setQuery(prediction.description);
    setShowDropdown(false);
    setPredictions([]);
  }, []);

  const checkSearchLimit = useCallback(() => {
    if (isSignedIn) return true;

    const count = getSearchCount();
    const limit = getSearchLimit();
    if (count >= limit) {
      setError(
        "You have reached your free search limit for this month. Please sign in for unlimited searches."
      );
      return false;
    }
    return true;
  }, [isSignedIn]);

  const performSearch = useCallback(
    async (searchTerm) => {
      const termToSearch = searchTerm || query;

      if (!termToSearch.trim()) {
        setError("Please enter a search term");
        return [];
      }

      if (!checkSearchLimit()) {
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        if (!isSignedIn) {
          incrementSearchCount();
        }

        console.log("🔍 Searching for:", termToSearch);
        const results = await placesService.searchPlaces(termToSearch);
        console.log("🎯 Search results received:", results);

        setSearchResults(results);

        const newHistory = addToSearchHistory(termToSearch);
        setSearchHistory(newHistory);

        setShowDropdown(false);
        return results;
      } catch (err) {
        setError("Search failed. Please try again.");
        console.error("Error performing search:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [query, checkSearchLimit, isSignedIn]
  );

  const handleSearchSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      return await performSearch();
    },
    [performSearch]
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setSearchResults([]);
    setPredictions([]);
    setShowDropdown(false);
    setError(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  const clearSearchHistory = useCallback(() => {
    clearStoredHistory();
    setSearchHistory([]);
  }, []);

  const showPredictionsDropdown = useCallback(() => {
    if (predictions.length > 0) {
      setShowDropdown(true);
    }
  }, [predictions.length]);

  const hidePredictionsDropdown = useCallback(() => {
    setTimeout(() => setShowDropdown(false), 150);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    query,
    searchResults,
    predictions,
    searchHistory,
    showDropdown,
    loading,
    error,

    handleSearchInput,
    handleSelectPrediction,
    handleSearchSubmit,
    performSearch,
    clearSearch,
    clearSearchHistory,

    showPredictionsDropdown,
    hidePredictionsDropdown,

    searchesRemaining: getSearchesRemaining(isSignedIn),

    clearError: () => setError(null),
  };
}
