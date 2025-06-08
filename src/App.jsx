import React, { useState } from "react";
import "./App.css";
import Footer from "./components/footer";
import Search from "./components/search";
import { Routes, Route } from "react-router-dom";
import Profile from "./profile";
import Cards from "./components/cards";
import "./components/cards.css";
import Header from "./components/header";

function Home() {
  const [places, setPlaces] = useState([]);
  return (
    <>
      <Header />
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
    </Routes>
  );
}

export default App;
