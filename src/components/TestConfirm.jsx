import { useState } from "react";
import ConfirmModal from "./ConfirmModal/ConfirmModal";

export default function ModalTest() {
  const [isOpen, setIsOpen] = useState(true); // Always open for now for testing purposes

  const handleClose = () => {
    setIsOpen(false);
    alert("Modal closed");
  };

  const handleConfirm = () => {
    alert("Confirmed delete");
    setIsOpen(false);
  };

  return (
    <div>
      <ConfirmModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
