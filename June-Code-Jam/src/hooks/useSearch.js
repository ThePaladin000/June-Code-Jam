import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { fetchAutocompleteSuggestions } from '../utils/utils';
import { placesService } from '../utils/index';
import { 
  getSearchCount, 
  incrementSearchCount, 
  getSearchHistory, 
  addToSearchHistory, 
  clearSearchHistory as clearStoredHistory,
  getSearchLimit,
  getSearchesRemaining 
} from '../utils/searchUtils';

export function useSearch() {
  const { isSignedIn } = useUser();
  
  // Search state
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  // Debouncing state
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Load search history on mount
  useEffect(() => {
    const history = getSearchHistory();
    setSearchHistory(history);
  }, []);

  // Debounced autocomplete function
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
      setError('Failed to fetch suggestions');
      console.error('Error fetching autocomplete suggestions:', err);
      setPredictions([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search input with debouncing
  const handleSearchInput = useCallback((value) => {
    setQuery(value);

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for debounced search
    const newTimer = setTimeout(() => {
      fetchPredictions(value);
    }, 300); // 300ms debounce

    setDebounceTimer(newTimer);
  }, [debounceTimer, fetchPredictions]);

  // Handle selecting a prediction
  const handleSelectPrediction = useCallback((prediction) => {
    setQuery(prediction.description);
    setShowDropdown(false);
    setPredictions([]);
  }, []);

  // Check search limits for non-signed-in users
  const checkSearchLimit = useCallback(() => {
    if (isSignedIn) return true;
    
    const count = getSearchCount();
    const limit = getSearchLimit();
    if (count >= limit) {
      setError("You have reached your free search limit for this month. Please sign in for unlimited searches.");
      return false;
    }
    return true;
  }, [isSignedIn]);

  // Perform actual search
  const performSearch = useCallback(async (searchTerm = query) => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return [];
    }

    if (!checkSearchLimit()) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Increment search count for non-signed-in users
      if (!isSignedIn) {
        incrementSearchCount();
      }

      // Search places using Firebase
      const results = await placesService.searchPlaces(searchTerm);
      setSearchResults(results);

      // Update search history
      const newHistory = addToSearchHistory(searchTerm);
      setSearchHistory(newHistory);

      setShowDropdown(false);
      return results;
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error performing search:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [query, checkSearchLimit, isSignedIn]);

  // Submit search (for form submission)
  const handleSearchSubmit = useCallback(async (e) => {
    e.preventDefault();
    return await performSearch();
  }, [performSearch]);

  // Clear search results
  const clearSearch = useCallback(() => {
    setQuery("");
    setSearchResults([]);
    setPredictions([]);
    setShowDropdown(false);
    setError(null);
  }, []);

  // Clear search history
  const clearSearchHistory = useCallback(() => {
    clearStoredHistory();
    setSearchHistory([]);
  }, []);

  // Focus dropdown
  const showPredictionsDropdown = useCallback(() => {
    if (predictions.length > 0) {
      setShowDropdown(true);
    }
  }, [predictions.length]);

  // Hide dropdown
  const hidePredictionsDropdown = useCallback(() => {
    // Small delay to allow for selection clicks
    setTimeout(() => setShowDropdown(false), 150);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return {
    // Search state
    query,
    searchResults,
    predictions,
    searchHistory,
    showDropdown,
    loading,
    error,

    // Search actions  
    handleSearchInput,
    handleSelectPrediction,
    handleSearchSubmit,
    performSearch,
    clearSearch,
    clearSearchHistory,

    // Dropdown actions
    showPredictionsDropdown,
    hidePredictionsDropdown,

    // Search limits
    searchesRemaining: getSearchesRemaining(isSignedIn),

    // Utilities
    clearError: () => setError(null)
  };
}



