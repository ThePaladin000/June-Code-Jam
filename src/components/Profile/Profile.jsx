import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSavedPlaces } from "../../hooks/useSavedPlaces.js";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Cards from "../Cards/Cards";
import "./Profile.css";
import Carousel from "../Carousel/Carousel.jsx";

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
            const response = await fetch(
              `/api/place-details?placeId=${placeId}`
            );

            if (response.ok) {
              const data = await response.json();
              return { ...data, id: placeId };
            } else {
              console.error(`❌ Failed to fetch details for place: ${placeId}`);
              return null;
            }
          } catch (error) {
            console.error(
              `💥 Error fetching details for place ${placeId}:`,
              error
            );
            return null;
          }
        });

        const details = await Promise.all(detailsPromises);
        const validDetails = details.filter((detail) => detail !== null);

        setSavedPlaceDetails(validDetails);
      } catch (error) {
        console.error("💥 Error fetching saved place details:", error);
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
          <div className="profile-subtitle-container">
            <p className="profile-subtitle">
              Please sign in to view your saved places
            </p>
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
          <div className="profile-subtitle-container">
            <p className="profile-subtitle">Loading your saved places...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p className="error-subtitle">
              Error loading saved places: {error}
            </p>
          </div>
        )}

        {!loading && !fetchingDetails && savedPlaceDetails.length > 0 && (
          <div className="profile-subtitle-container">
            <p className="profile-subtitle">
              You have {savedPlaceDetails.length} saved place
              {savedPlaceDetails.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {!loading && !fetchingDetails && savedPlaces.length === 0 && (
          <div className="profile-subtitle-container">
            <p className="profile-subtitle">No saved places yet!</p>
            <p className="profile-subtitle">
              Search for places on the home page and click the heart to save
              them here.
            </p>
          </div>
        )}

        <Carousel places={savedPlaceDetails} />
      </div>
      <Footer />
    </>
  );
}

export default Profile;
