import React, { useState } from "react";
import Modal from "react-modal";
import { QRCodeSVG } from "qrcode.react";
import QRCodeModal from "../QRCodeModal/QRCodeModal";
import { SignedIn } from "@clerk/clerk-react";
import "./PlaceModal.css";

export default function PlaceModal({ isOpen, onRequestClose, place }) {
  const [qrModalOpen, setQrModalOpen] = useState(false);

  if (!place) return null;
  console.log("Modal image URL:", place.photoUrl);

  const name = place.name || place.displayName?.text || "Unknown Place";
  const address = place.formatted_address || place.formattedAddress || "";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${name}, ${address}`
  )}`;

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
          alt={name}
        />
        <div className="place__modal_info-row">
          <div className="place__modal_info-text">
            <h2 className="place__modal_title">{name}</h2>
            <p className="place__modal_address">{address}</p>
          </div>
          <SignedIn>
            <div className="place__modal_qr-section">
              <div
                className="place__modal_qr-wrapper"
                onClick={() => setQrModalOpen(true)}
                title="Click QR code to enlarge"
                style={{ cursor: "pointer" }}
              >
                <QRCodeSVG
                  value={mapsUrl}
                  size={60}
                  level="H"
                  includeMargin={true}
                  className="place__modal_qr"
                />
                <div className="place__modal_qr-label">
                  Click QR code to scan
                </div>
              </div>
            </div>
          </SignedIn>
        </div>
        <button className="place__modal_close-btn" onClick={onRequestClose}>
          Close
        </button>
      </div>
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        mapsUrl={mapsUrl}
        placeName={name}
      />
    </Modal>
  );
}
