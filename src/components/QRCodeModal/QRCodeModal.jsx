import React from "react";
import Modal from "react-modal";
import { QRCodeSVG } from "qrcode.react";
import "./QRCodeModal.css";

export default function QRCodeModal({ isOpen, onClose, mapsUrl, placeName }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="qr__modal"
      overlayClassName="qr__modal-overlay"
      contentLabel="QR Code Modal"
    >
      <div className="qr__modal-content">
        <h2>Scan for directions to {placeName}</h2>
        <div className="qr__code-wrapper">
          <QRCodeSVG
            value={mapsUrl}
            size={300}
            level="H"
            includeMargin={true}
            className="qr__code-large"
          />
        </div>
        <button className="qr__close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
