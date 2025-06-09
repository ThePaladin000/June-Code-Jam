import Modal from "react-modal";
import "./placeModal.css";

Modal.setAppElement("#root");

export default function PlaceModal({ isOpen, onRequestClose, place }) {}
if (!place) return null;

return (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Place Details"
    overlayClassName="custom-overlay"
  ></Modal>
);
