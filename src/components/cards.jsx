import React from "react";

export default function Cards({ places = [] }) {
  if (!places.length) {
    return <div className="cards-containers">No places to display.</div>;
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
          </div>
        </div>
      ))}
    </div>
  );
}
