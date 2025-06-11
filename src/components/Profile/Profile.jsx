import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSavedPlaces } from "../../context/SavedPlacesContext.jsx";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Cards from "../Cards/Cards";
import "./Profile.css";
import Spinner from "../Spinner/Spinner";

function Profile() {
  const { isSignedIn } = useUser();
  const { savedPlaces } = useSavedPlaces();
  const [savedPlaceDetails, setSavedPlaceDetails] = useState([]);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSlide] = useState(0);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (!savedPlaces.length) {
        setSavedPlaceDetails([]);
        return;
      }
      setFetchingDetails(true);

      try {
        const detailsPromises = savedPlaces.map(async (placeObj) => {
          const placeId = placeObj.id || placeObj;
          const placeName = placeObj.name || undefined;
          try {
            const response = await fetch(
              `/api/place-details?placeId=${placeId}`
            );

            if (response.ok) {
              const data = await response.json();
              return { ...data, id: placeId, name: placeName };
            } else {
              console.error(`Failed to fetch details for place: ${placeId}`);
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
  }, [savedPlaces, isSignedIn, setFetchingDetails]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === savedPlaceDetails.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? savedPlaceDetails.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    console.log("goToSlide", index);
    setCurrentIndex(index);
  };

  if (!isSignedIn) {
    return <div>Please sign in to view your saved places</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <h1 className="profile-title">MY GREEN BUCKET LIST</h1>

        {fetchingDetails ? (
          <div className="loading-state">
            <p className="profile-text">Cards are loading</p>
            <Spinner />
          </div>
        ) : savedPlaceDetails.length === 0 ? (
          <div className="empty-state">
            <p className="profile-text">No saved places yet!</p>
            <p className="profile-text">
              Search for places on the home page and click the heart to save
              them here.
            </p>
          </div>
        ) : (
          <div className="carousel-section">
            <p className="carousel-section-text">
              You have {savedPlaceDetails.length} saved place
              {savedPlaceDetails.length !== 1 ? "s" : ""}
            </p>

            {/* ✨ CAROUSEL CONTAINER */}
            <div className="carousel-container">
              {/* LEFT ARROW */}
              <button
                className="carousel-arrow carousel-arrow-left"
                onClick={handlePrev}
                disabled={savedPlaceDetails.length <= 1}
              >
                ←
              </button>

              {/* CAROUSEL CONTENT */}
              <div className="carousel-viewport">
                <div
                  className="carousel-track"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {savedPlaceDetails.map((place, index) => (
                    <div key={place.id || index} className="carousel-slide">
                      {fetchingDetails ? (
                        <Spinner />
                      ) : (
                        <Cards places={[place]} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT ARROW */}
              <button
                className="carousel-arrow carousel-arrow-right"
                onClick={handleNext}
                disabled={savedPlaceDetails.length <= 1}
              >
                →
              </button>
            </div>

            {/* ✨ PAGINATION DOTS */}
            {savedPlaceDetails.length > 1 && (
              <div className="carousel-dots">
                {savedPlaceDetails.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${
                      index === currentSlide ? "active" : ""
                    }`}
                    onClick={() => {
                      goToSlide(index);
                    }}
                    style={{
                      backgroundColor:
                        index === currentIndex
                          ? "rgba(230, 230, 230, .9)"
                          : "rgba(100, 100, 100, .9)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
