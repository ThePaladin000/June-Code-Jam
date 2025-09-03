import { useState } from "react";
import "./App.css";
import Home from "../Home/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import Profile from "../Profile/Profile";
import Modal from "react-modal";

Modal.setAppElement("#root");

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
