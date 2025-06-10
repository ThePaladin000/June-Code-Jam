import React from "react";
import Modal from "react-modal";
import "./PlaceModal.css";

export default function PlaceModal({ isOpen, onRequestClose, place }) {
  if (!place) return null;
  console.log("Modal image URL:", place.photoUrl);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Place Details"
      overlayClassName="place__modal_overlay"
      className="place__modal_content"
    >
      <div className="place__modal">
        <img
          className="place__modal_image"
          src={place.photoUrl || "https://placehold.co/600x400"}
          alt={place.name || "Place Image"}
        />
        <h2 className="place__modal_title">
          {place.name || place.displayName?.text || "Unknown Place"}
        </h2>
        <p className="place__modal_address">
          {place.formatted_address || place.formattedAddress}
        </p>
        {/* Add qr code, reviews or other information here and a remove bucket option ect*/}
        <button className="place__modal_close-btn" onClick={onRequestClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
