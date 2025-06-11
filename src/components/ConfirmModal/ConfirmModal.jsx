import Modal from "react-modal";
import { useState } from "react";
import "./ConfirmModal.css";

export default function ConfirmModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Place Details"
      overlayClassName="confirm__modal_overlay"
      className="confirm__modal_content"
    >
      <div className="confirm__modal">
        <img
          src="https://6tlg35rybd.ufs.sh/f/JT0pvUmaDUtZBNzrJheQ2aqORSW8MCezTibwhEHBFkt7xAcG"
          alt="GreenFindr Spinning logo"
          className="confirm__modal_globe-image"
        />
        <h2 className="confirm__modal-title">
          Are you sure you want to remove this from your GREEN BUCKET?
        </h2>
        <button onClick={onConfirm}>Yes</button>
        <button style={{ marginLeft: "10px" }} onClick={onClose}>
          No
        </button>
      </div>
    </Modal>
  );
}
