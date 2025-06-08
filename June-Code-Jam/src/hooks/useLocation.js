import { useState, useEffect, useCallback } from 'react';
import { placesService } from '../utils/index';

export function useLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  // get users location - FIXED!
  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setPermissionStatus('denied');
      return false;
    }

    setLoading(true);
    setError(null);
    console.log('🔄 Requesting location...');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      console.log('📍 Location acquired:', location);
      setUserLocation(location);
      setPermissionStatus('granted');
      return location;
    } catch (err) {
      let errorMsg = 'Failed to get location';
      
      if (err.code === 1) {
        errorMsg = 'Location access denied';
        setPermissionStatus('denied');
      } else if (err.code === 2) {
        errorMsg = 'Location unavailable';
      } else if (err.code === 3) {
        errorMsg = 'Location request timed out';
      }
      
      console.error('❌ Location error:', err);
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []); // ← Fixed dependencies!

  // find places near user - FIXED!
  const findNearbyPlaces = useCallback(async (radiusKm = 5, location = userLocation) => {
    if (!location) {
      setError('Need location first');
      return [];
    }

    setLoading(true);
    setError(null);
    console.log(`🔍 Finding places within ${radiusKm}km of:`, location);

    try {
      const places = await placesService.getNearbyPlaces(location.lat, location.lng, radiusKm);
      console.log(`✅ Found ${places.length} nearby places`);
      setNearbyPlaces(places);
      return places;
    } catch (err) {
      setError('Failed to find nearby places');
      console.error('❌ Error finding nearby places:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userLocation]); // ← Fixed dependencies!

  // auto find nearby when we get location
  useEffect(() => {
    if (userLocation && nearbyPlaces.length === 0) {
      console.log('🚀 Auto-finding nearby places...');
      findNearbyPlaces();
    }
  }, [userLocation, findNearbyPlaces, nearbyPlaces.length]);

  // clear everything
  const clearLocation = useCallback(() => {
    console.log('🧹 Clearing location data...');
    setUserLocation(null);
    setNearbyPlaces([]);
    setError(null);
    setPermissionStatus('prompt');
  }, []);

  return {
    // data
    userLocation,
    nearbyPlaces,
    loading,
    error,
    permissionStatus,

    // actions
    requestLocation,
    findNearbyPlaces,
    clearLocation,

    // utilities
    clearError: () => setError(null),
    hasLocation: !!userLocation
  };
}