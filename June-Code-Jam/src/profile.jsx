import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Cards from "./components/cards";
import "./components/cards.css";
import { useSavedPlaces } from "./hooks/useSavedPlaces";
import { useSearch } from "./hooks/useSearch";
import { useLocation } from "./hooks/useLocation"; // Add this
import { useFilters } from "./hooks/useFilter";   // Add this
import { usePlaces } from "./hooks/usePlaces";     // Add this for filter testing

function Profile() {
  const savedPlacesHook = useSavedPlaces();
  const searchHook = useSearch();
  const locationHook = useLocation();              // Add this
  const placesHook = usePlaces();                  // Add this
  const filtersHook = useFilters(placesHook.places); // Add this - pass places for filtering

  // Expose all hooks for testing
  useEffect(() => {
    window.testHooks = {
      savedPlaces: savedPlacesHook,
      search: searchHook,
      location: locationHook,     // Add this
      filters: filtersHook,       // Add this
      places: placesHook          // Add this
    };
    console.log('🧪 All hooks exposed to window.testHooks');
  }, [savedPlacesHook, searchHook, locationHook, filtersHook, placesHook]);

  return (
    <>
      <Navbar />
      <div className="main-container">
        <h1>My Green Bucket List</h1>
        
        {/* Location Hook Testing Info */}
        <div style={{border: '2px solid green', padding: '10px', margin: '10px'}}>
          <h3>📍 Location Testing</h3>
          <p>Has Location: {locationHook.hasLocation ? 'Yes' : 'No'}</p>
          <p>Permission: {locationHook.permissionStatus}</p>
          <p>Nearby Places: {locationHook.nearbyPlaces.length}</p>
          <p>Loading: {locationHook.loading ? 'Yes' : 'No'}</p>
          {locationHook.error && <p style={{color: 'red'}}>Error: {locationHook.error}</p>}
        </div>

        {/* Filters Hook Testing Info */}
        <div style={{border: '2px solid purple', padding: '10px', margin: '10px'}}>
          <h3>🔍 Filters Testing</h3>
          <p>All Places: {placesHook.places.length}</p>
          <p>Filtered Places: {filtersHook.filteredPlaces.length}</p>
          <p>Active Filters: {filtersHook.filterCount}</p>
          <p>Type Filter: {filtersHook.filters.type || 'None'}</p>
          <p>Amenity Filters: {filtersHook.filters.amenities.length}</p>
          <p>Search Term: "{filtersHook.filters.searchTerm}"</p>
          {filtersHook.error && <p style={{color: 'red'}}>Error: {filtersHook.error}</p>}
        </div>

        <p>Saved Places: {savedPlacesHook.savedPlaces.length}</p>
        <Cards />
      </div>
      <Footer />
    </>
  );
}

export default Profile;
