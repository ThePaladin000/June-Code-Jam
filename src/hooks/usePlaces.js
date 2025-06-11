import { useState, useEffect, useCallback } from "react";
import { placesService } from "../utils/placesService.js";

export function usePlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const getPlaces = await placesService.getAllPlaces();
      setPlaces(getPlaces);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching places:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPlace = useCallback(async (placeData) => {
    setLoading(true);
    setError(null);

    try {
      const newPlaceId = await placesService.addPlace(placeData);

      const newPlace = { id: newPlaceId, ...placeData };
      setPlaces((prevPlaces) => [...prevPlaces, newPlace]);

      return newPlaceId;
    } catch (err) {
      setError(err.message);
      console.error("Error adding place:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPlaces = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);

    try {
      const searchResults = await placesService.searchPlaces(searchTerm);
      setPlaces(searchResults);
      return searchResults;
    } catch (err) {
      setError(err.message);
      console.error("Error searching places:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return {
    places,
    loading,
    error,

    addPlace,
    searchPlaces,
    refetchPlaces: fetchPlaces,

    clearError: () => setError(null),
  };
}
