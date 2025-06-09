import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Cards from "../Cards/Cards";
import "./profile.css";

function Profile() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <div className="main-container">
        <h1 className="profile__title">MY GREEN BUCKET LIST</h1>
        <Cards />
      </div>
      <Footer />
    </>
  );
}

export default Profile;
