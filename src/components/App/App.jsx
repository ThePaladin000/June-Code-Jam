import { useState } from "react";
import "./App.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Search from "../Search/Search";
import { Routes, Route, Navigate } from "react-router-dom";
import Profile from "../Profile/Profile";
import Cards from "../Cards/Cards";
import Modal from "react-modal";
import Spinner from "../Spinner/Spinner";

Modal.setAppElement("#root");

function Home() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Navbar />
      <Search onPlacesFetched={setPlaces} onLoading={setLoading} />
      {loading ? <Spinner /> : <Cards places={places} />}
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
