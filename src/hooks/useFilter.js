import { useState, useCallback, useMemo } from 'react';
import { placesService } from '../utils/index';

export function useFilters(allPlaces = []) {
  const [filters, setFilters] = useState({
    type: null,
    amenities: [],
    distance: null,
    searchTerm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // set place type filter
  const setTypeFilter = useCallback((placeType) => {
    setFilters(prev => ({
      ...prev,
      type: placeType
    }));
  }, []);

  // add/remove amenity filter
  const toggleAmenity = useCallback((amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  }, []);

  // set distance filter
  const setDistance = useCallback((distance) => {
    setFilters(prev => ({
      ...prev,
      distance
    }));
  }, []);

  // set search filter
  const setSearchTerm = useCallback((searchTerm) => {
    setFilters(prev => ({
      ...prev,
      searchTerm
    }));
  }, []);

  // clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      type: null,
      amenities: [],
      distance: null,
      searchTerm: ''
    });
  }, []);

  // clear specific filter
  const clearFilter = useCallback((filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: filterType === 'amenities' ? [] : null
    }));
  }, []);

  // filter places locally
  const filteredPlaces = useMemo(() => {
    let result = [...allPlaces];

    // filter by type
    if (filters.type) {
      result = result.filter(place => place.type === filters.type);
    }

    // filter by amenities - place must have ALL selected amenities
    if (filters.amenities.length > 0) {
      result = result.filter(place => 
        filters.amenities.every(amenity => 
          place.amenities?.includes(amenity)
        )
      );
    }

    // filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(place => 
        place.name?.toLowerCase().includes(searchLower) ||
        place.description?.toLowerCase().includes(searchLower) ||
        place.address?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [allPlaces, filters]);

  // get places by type from firebase
  const getPlacesByType = useCallback(async (placeType) => {
    setLoading(true);
    setError(null);

    try {
      const places = await placesService.getPlacesByType(placeType);
      setTypeFilter(placeType);
      return places;
    } catch (err) {
      setError('Failed to filter by type');
      console.error('Error filtering by type:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [setTypeFilter]);

  // get places by amenity from firebase  
  const getPlacesByAmenity = useCallback(async (amenity) => {
    setLoading(true);
    setError(null);

    try {
      const places = await placesService.getPlacesByAmenity(amenity);
      toggleAmenity(amenity);
      return places;
    } catch (err) {
      setError('Failed to filter by amenity');
      console.error('Error filtering by amenity:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [toggleAmenity]);

  // check if any filters active
  const hasActiveFilters = useMemo(() => {
    return filters.type !== null ||
           filters.amenities.length > 0 ||
           filters.distance !== null ||
           filters.searchTerm !== '';
  }, [filters]);

  // count active filters
  const filterCount = useMemo(() => {
    let count = 0;
    if (filters.type) count++;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.distance) count++;
    if (filters.searchTerm) count++;
    return count;
  }, [filters]);

  return {
    // data
    filters,
    filteredPlaces,
    loading,
    error,
    hasActiveFilters,
    filterCount,

    // actions
    setTypeFilter,
    toggleAmenity,
    setDistance,
    setSearchTerm,
    clearAllFilters,
    clearFilter,

    // firebase actions
    getPlacesByType,
    getPlacesByAmenity,

    // utilities
    clearError: () => setError(null)
  };
}