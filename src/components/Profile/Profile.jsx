import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSavedPlaces } from "../../hooks/useSavedPlaces.js";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Cards from "../Cards/Cards";
import "./Profile.css";

function Profile() {
  const { isSignedIn } = useUser();
  const { savedPlaces, loading, error } = useSavedPlaces();
  const [savedPlaceDetails, setSavedPlaceDetails] = useState([]);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (!savedPlaces.length) {
        setSavedPlaceDetails([]);
        return;
      }
      setFetchingDetails(true);
      
      try {
        // Fetch details for each saved place ID
        const detailsPromises = savedPlaces.map(async (placeId) => {
          try {
            const response = await fetch(`/api/place-details?placeId=${placeId}`);
            
            if (response.ok) {
              const data = await response.json();
              return { ...data, id: placeId };
            } else {
              console.error(`❌ Failed to fetch details for place: ${placeId}`);
              return null;
            }
          } catch (error) {
            console.error(`💥 Error fetching details for place ${placeId}:`, error);
            return null;
          }
        });

        const details = await Promise.all(detailsPromises);
        const validDetails = details.filter(detail => detail !== null);
        
        setSavedPlaceDetails(validDetails);
      } catch (error) {
        console.error('💥 Error fetching saved place details:', error);
      } finally {
        setFetchingDetails(false);
      }
    };

    if (isSignedIn && savedPlaces.length > 0) {
      fetchPlaceDetails();
    } else {
      setSavedPlaceDetails([]);
    }
  }, [savedPlaces, isSignedIn]);

  if (!isSignedIn) {
    return (
      <>
        <Navbar />
        <div className="main-container">
          <h1 className="profile__title">MY GREEN BUCKET LIST</h1>
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <p style={{ fontSize: '18px', margin: 0 }}>Please sign in to view your saved places</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="main-container">
        <h1 className="profile__title">MY GREEN BUCKET LIST</h1>
        {(loading || fetchingDetails) && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            <p style={{ fontSize: '16px', margin: 0 }}>Loading your saved places...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#e74c3c' }}>
            <p style={{ fontSize: '16px', margin: 0 }}>Error loading saved places: {error}</p>
          </div>
        )}

        {!loading && !fetchingDetails && savedPlaceDetails.length > 0 && (
          <div style={{ textAlign: 'center', padding: '10px 20px 20px', color: '#556b2f' }}>
            <p style={{ fontSize: '14px', margin: 0, fontWeight: 500 }}>
              You have {savedPlaceDetails.length} saved place{savedPlaceDetails.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {!loading && !fetchingDetails && savedPlaces.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <p style={{ fontSize: '18px', margin: 0 }}>No saved places yet!</p>
            <p style={{ fontSize: '14px', margin: '10px 0 0 0' }}>
              Search for places on the home page and click the heart to save them here.
            </p>
          </div>
        )}

        <Cards places={savedPlaceDetails} />
      </div>
      <Footer />
    </>
  );
}



export default Profile;
