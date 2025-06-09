import React from "react";
import { useState } from "react";
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
      {places.map((place, idx) => (
        <div
          className="card-container"
          key={place.id || place.place_id || idx}
          onClick={() => openModal(place)}
          style={{ cursor: "pointer" }}
        >
          <div className="card">
            <img
              src={place.photoUrl || "https://placehold.co/600x400"}
              alt={place.name || "Place"}
              className="card-image"
            />
          </div>
          <div>
            <h2 className="card-description">
              {place.name || place.displayName?.text || "Unknown Place"}
            </h2>
            <p style={{ fontSize: 14, color: "#888" }}>
              {place.formatted_address || "No address available"}
            </p>
          </div>
        </div>
      ))}
      <PlaceModal
        isOpen={!!selectedPlace}
        onRequestClose={closeModal}
        place={selectedPlace}
      />
    </div>
  );
}
