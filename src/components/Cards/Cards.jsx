import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { SignedIn, useUser, SignedOut } from "@clerk/clerk-react";
import { useSavedPlaces } from "../../context/SavedPlacesContext.jsx";
import "./Cards.css";
import PlaceModal from "../PlaceModal/PlaceModal";
import QRCodeModal from "../QRCodeModal/QRCodeModal";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

export default function Cards({ places = [] }) {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [placeToRemove, setPlaceToRemove] = useState(null);

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

    const placeId = place.id || place.placeId;
    const placeName = place.name || place.displayName?.text || "Unknown Place";

    if (isPlaceSaved(placeId)) {
      setPlaceToRemove({ placeId, placeName });
      setShowConfirm(true);
      return;
    }

    try {
      await saveUserPlaces(placeId, placeName);
      console.log(`Saved place: ${placeId} for user: ${user.id}`);
    } catch (error) {
      console.error("Error saving place:", error);
    }
  };

  const handleConfirmRemove = async () => {
    if (placeToRemove) {
      try {
        await removeUserPlaces(placeToRemove.placeId);
        console.log(
          `Removed place: ${placeToRemove.placeId} for user: ${user.id}`
        );
      } catch (error) {
        console.error("Error removing place:", error);
      }
    }
    setShowConfirm(false);
    setPlaceToRemove(null);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setPlaceToRemove(null);
  };

  if (!places.length) {
    return (
      <div className="cards__containers">
        <img
          src="https://6tlg35rybd.ufs.sh/f/JT0pvUmaDUtZBNzrJheQ2aqORSW8MCezTibwhEHBFkt7xAcG"
          alt="Picture of a spinning green globe"
          className="globe__image"
        />
      </div>
    );
  }
  return (
    <div className="cards__containers">
      {places.map((place, idx) => {
        const placeId = place.id || place.placeId;
        const isSaved = isPlaceSaved(placeId);
        const placeName =
          place.name || place.displayName?.text || "Unknown Place";

        return (
          <div className="card__container" key={placeId || idx}>
            <div className="card">
              <img
                src={place.photoUrl || "https://placehold.co/600x400"}
                alt={place.name || "Place"}
                onClick={() => openModal(place)}
                className="card__image"
              />
            </div>
            <div className="card__info">
              <h2 onClick={() => openModal(place)} className="card__description">
                {placeName}
              </h2>
              <p onClick={() => openModal(place)} className="card__address">
                {place.formatted_address || place.formattedAddress}
              </p>

              <div className="card__actions">
                <SignedIn>
                  <div className="save__button">
                    <button
                      className="heart__button"
                      onClick={() => handleSavePlace(place)}
                      disabled={loading}
                      title={
                        isSaved ? "Remove from saved places" : "Save place"
                      }
                    >
                      {isSaved ? (
                        <FaHeart className="heart__icon filled" />
                      ) : (
                        <FaRegHeart className="heart__icon empty" />
                      )}
                      {isSaved ? " Saved" : " Save"}
                    </button>
                  </div>
                </SignedIn>

                <SignedOut>
                  <div className="save__button">
                    <button
                      className="heart__button"
                      onClick={() => alert("Please sign in to save places")}
                      title="Sign in to save places"
                    >
                      <FaRegHeart className="heart__icon empty" />
                      Sign In to Save
                    </button>
                  </div>
                </SignedOut>
              </div>
            </div>
          </div>
        );
      })}
      <PlaceModal
        isOpen={!!selectedPlace}
        onRequestClose={closeModal}
        place={selectedPlace}
      />
      <ConfirmModal
        isOpen={showConfirm}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}
