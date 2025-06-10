import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { userDataService } from "../utils/userDataService.js";

export function useSavedPlaces() {
  //get user from clerk
  const { user, isSignedIn } = useUser();

  //State management - the react way!! ^.^
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user's saved places
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

  //save a place to user's bucket list
  const saveUserPlaces = useCallback(
    async (placeId, placeName) => {
      if (!isSignedIn || !user) {
        throw new Error("User not signed in");
      }

      setLoading(true);
      setError(null);

      try {
        await userDataService.savePlace(user.id, placeId, placeName);

        //optimistically update state
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

  //Remove a place from user's bucket list
  const removeUserPlaces = useCallback(
    async (placeId) => {
      if (!isSignedIn || !user) {
        throw new Error("You must be signed in to remove a place");
      }
      setLoading(true);
      setError(null);

      try {
        await userDataService.removeSavedPlace(user.id, placeId);

        //optimistically update state
        setSavedPlaces((prevPlaces) =>
          prevPlaces.filter((place) => place.id !== placeId)
        );

        return true;
      } catch (err) {
        setError(err.message);
        console.error("Error removing user places:", err);
        //refresh on error to show the latest state
        await fetchSavedPlaces();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, isSignedIn, fetchSavedPlaces]
  );
  //check if a place is saved from local state instead of making api call otherwise we'll be making too many api calls
  const isPlaceSaved = useCallback(
    (placeId) => {
      if (!isSignedIn || !user) {
        return false;
      }

      // Check local state instead of making API call
      return savedPlaces.some((place) => place.id === placeId);
    },
    [savedPlaces, isSignedIn, user]
  );

  //Auto fetch saved places when (user signs in)component mounts
  useEffect(() => {
    if (isSignedIn && user) {
      fetchSavedPlaces();
    } else {
      setSavedPlaces([]);
    }
  }, [isSignedIn, user, fetchSavedPlaces]);

  //return clean interface
  return {
    // data
    savedPlaces,
    loading,
    error,
    isSignedIn,

    //actions
    saveUserPlaces,
    removeUserPlaces,
    isPlaceSaved,

    //utilities
    clearError: () => setError(null),
  };
}
