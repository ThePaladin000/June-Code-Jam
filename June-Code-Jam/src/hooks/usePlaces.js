import { useState, useEffect, useCallback } from 'react'
import { placesService } from '../utils/placeService'

export function usePlaces() {

const [places, setPlaces] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Fetch places from the API
const fetchPlaces = useCallback(async ()=> {
 setLoading(true);
 setError(null);

 try {
    const getPlaces = await placesService.getAllPlaces();
    setPlaces(getPlaces);
  } catch (err) {
    setError(err.message);
    console.error('Error fetching places:', err);
  } finally {
    setLoading(false);
  }
}, []);

// Add a new place
const addPlace = useCallback(async (placeData) => {
setLoading(true);
setError(null);

try {
    const newPlaceId = await placesService.addPlace(placeData);

    const newPlace = { id: newPlaceId, ...placeData};
    setPlaces((prevPlaces) => [...prevPlaces, newPlace]);

    return newPlaceId;
  } catch (err) {
    setError(err.message);
    console.error('Error adding place:', err);
    throw err;
  } finally {
    setLoading(false);
  }
},[]);

// search places
const searchPlaces = useCallback(async (searchTerm)=> {
 setLoading(true);
 setError(null);

 try {
    const searchResults = await placesService.searchPlaces(searchTerm);
    setPlaces(searchResults);
    return searchResults;
   } catch (err) {
    setError(err.message);
    console.error('Error searching places:', err);
    return [];
   } finally {
    setLoading(false);
   }
}, []);

// filter places by type 
const getPlacesByType = useCallback(async (placeType)=> {
    setLoading(true);
    setError(null);

    try {
        const filteredPlaces = await placesService.getPlacesByType(placeType);
        setPlaces(filteredPlaces);
        return filteredPlaces;
    } catch (err) {
        setError(err.message);
        console.error('Error filtering places by type:', err);
        return [];
    } finally {
        setLoading(false);
    }
}, []);

// Auto fetch places when components used(mounts)
useEffect(()=> {
    fetchPlaces();
}, [fetchPlaces]);

//return clean interface
return {
    //data 
    places,
    loading,
    error,

    //actions
    addPlace,
    searchPlaces,
    getPlacesByType,
    refetchPlaces: fetchPlaces,

    //Utilitites
    clearError: () => setError(null)
  };
}