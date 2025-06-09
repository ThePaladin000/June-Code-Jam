import React from "react";
import { FaHeart } from "react-icons/fa";
import { SignedIn, useUser } from "@clerk/clerk-react";
import { FaRegHeart } from "react-icons/fa";
import { userDataService } from "../../utils/userDataService";
import "./Cards.css";

function handleSavePlace(placeId) {
  if (!SignedIn) {
    alert("Please sign in to save places");
    return;
  }
  console.log(placeId);
}

export default function Cards({ places = [] }) {
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
        <div className="card-container" key={place.id || place.place_id || idx}>
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
            <div
              className="heart-container"
              onClick={() => handleSavePlace(place.place_id)}
            >
              <FaHeart />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
