import React, { useState } from "react";
import "./App.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Search from "../Search/Search";
import { Routes, Route, Navigate } from "react-router-dom";
import Profile from "../Profile/Profile";
import Cards from "../Cards/Cards";
import Modal from "react-modal";
import ModalTest from "../TestConfirm";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
Modal.setAppElement("#root");

function Home() {
  const [places, setPlaces] = useState([]);
  return (
    <>
      <Navbar />
      <Search onPlacesFetched={setPlaces} />
      <Cards places={places} />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
