import React from "react";
import Modal from "react-modal";
import { QRCodeSVG } from "qrcode.react";
import "./QRCodeModal.css";

export default function QRCodeModal({ isOpen, onClose, mapsUrl, placeName }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="qr-modal"
      overlayClassName="qr-modal-overlay"
      contentLabel="QR Code Modal"
    >
      <div className="qr-modal-content">
        <h2>Scan for directions to {placeName}</h2>
        <div className="qr-code-wrapper">
          <QRCodeSVG
            value={mapsUrl}
            size={300}
            level="H"
            includeMargin={true}
            className="qr-code-large"
          />
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
