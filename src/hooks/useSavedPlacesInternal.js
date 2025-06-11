import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { userDataService } from "../utils/userDataService.js";

export function useSavedPlacesInternal() {
  const { user, isSignedIn } = useUser();

  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavedPlaces = useCallback(async () => {
    if (!isSignedIn || !user) {
      setSavedPlaces([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const getUserSavedPlaces = await userDataService.getSavedPlaces(user.id);
      setSavedPlaces(getUserSavedPlaces);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching saved places from user:", err);
    } finally {
      setLoading(false);
    }
  }, [user, isSignedIn]);

  const saveUserPlaces = useCallback(
    async (placeId, placeName) => {
      if (!isSignedIn || !user) {
        throw new Error("User not signed in");
      }

      setLoading(true);
      setError(null);

      try {
        await userDataService.savePlace(user.id, placeId, placeName);

        setSavedPlaces((prevPlaces) => [
          ...prevPlaces,
          { id: placeId, name: placeName },
        ]);

        return true;
      } catch (err) {
        setError(err.message);
        console.error("Error saving user place:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, isSignedIn]
  );

  const removeUserPlaces = useCallback(
    async (placeId) => {
      if (!isSignedIn || !user) {
        throw new Error("You must be signed in to remove a place");
      }
      setLoading(true);
      setError(null);

      try {
        await userDataService.removeSavedPlace(user.id, placeId);

        setSavedPlaces((prevPlaces) =>
          prevPlaces.filter((place) => place.id !== placeId)
        );

        return true;
      } catch (err) {
        setError(err.message);
        console.error("Error removing user places:", err);

        await fetchSavedPlaces();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, isSignedIn, fetchSavedPlaces]
  );

  const isPlaceSaved = useCallback(
    (placeId) => {
      if (!isSignedIn || !user) {
        return false;
      }

      return savedPlaces.some((place) => place.id === placeId);
    },
    [savedPlaces, isSignedIn, user]
  );

  useEffect(() => {
    if (isSignedIn && user) {
      fetchSavedPlaces();
    } else {
      setSavedPlaces([]);
    }
  }, [isSignedIn, user, fetchSavedPlaces]);

  return {
    savedPlaces,
    loading,
    error,
    isSignedIn,

    saveUserPlaces,
    removeUserPlaces,
    isPlaceSaved,

    clearError: () => setError(null),
  };
}
