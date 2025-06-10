import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { SignedIn, useUser, SignedOut } from "@clerk/clerk-react";
import { useState } from "react";
import { useSavedPlaces } from "../../context/SavedPlacesContext.jsx";
import "./Cards.css";
import PlaceModal from "../PlaceModal/PlaceModal";

export default function Cards({ places = [] }) {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const openModal = (place) => {
    if (selectedPlace === place) return;
    setSelectedPlace(place);
  };

  const closeModal = () => {
    setSelectedPlace(null);
  };

  const { user, isSignedIn } = useUser();
  const { saveUserPlaces, removeUserPlaces, isPlaceSaved, loading } =
    useSavedPlaces();

  const handleSavePlace = async (place) => {
    if (!isSignedIn) {
      alert("Please sign in to save places");
      return;
    }

    try {
      const placeId = place.id || place.placeId;
      const placeName =
        place.name || place.displayName?.text || "Unknown Place";

      if (isPlaceSaved(placeId)) {
        // If already saved, remove it
        await removeUserPlaces(placeId);
        console.log(`Removed place: ${placeId} for user: ${user.id}`);
      } else {
        // If not saved, save it
        await saveUserPlaces(placeId, placeName);
        console.log(`Saved place: ${placeId} for user: ${user.id}`);
      }
    } catch (error) {
      console.error("Error saving/removing place:", error);
    }
  };

  if (!places.length) {
    return (
      <div className="cards-containers">
        <img
          src="https://6tlg35rybd.ufs.sh/f/JT0pvUmaDUtZBNzrJheQ2aqORSW8MCezTibwhEHBFkt7xAcG"
          alt="No places to display"
          className="globe-image"
        />
      </div>
    );
  }
  return (
    <div className="cards-containers">
      {places.map((place, idx) => {
        const placeId = place.id || place.placeId;
        const isSaved = isPlaceSaved(placeId);

        return (
          <div className="card-container" key={placeId || idx}>
            <div className="card">
              <img
                src={place.photoUrl || "https://placehold.co/600x400"}
                alt={place.name || "Place"}
                onClick={() => openModal(place)}
                className="card-image"
              />
            </div>
            <div className="card-info">
              <h2 className="card-description">
                {place.name || place.displayName?.text || "Unknown Place"}
              </h2>
              <p className="card-address">
                {place.formatted_address || place.formattedAddress}
              </p>

              <SignedIn>
                <div className="save-button">
                  <button
                    className="heart-button"
                    onClick={() => handleSavePlace(place)}
                    disabled={loading}
                    title={isSaved ? "Remove from saved places" : "Save place"}
                  >
                    {isSaved ? (
                      <FaHeart className="heart-icon filled" />
                    ) : (
                      <FaRegHeart className="heart-icon empty" />
                    )}
                    {isSaved ? " Saved" : " Save"}
                  </button>
                </div>
              </SignedIn>

              <SignedOut>
                <div className="save-button">
                  <button
                    className="heart-button"
                    onClick={() => alert("Please sign in to save places")}
                    title="Sign in to save places"
                  >
                    <FaRegHeart className="heart-icon empty" />
                    Sign In to Save
                  </button>
                </div>
              </SignedOut>
            </div>
          </div>
        );
      })}
      <PlaceModal
        isOpen={!!selectedPlace}
        onRequestClose={closeModal}
        place={selectedPlace}
      />
    </div>
  );
}
