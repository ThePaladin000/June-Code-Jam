import { useState } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Cards from "./components/cards";
import "./components/cards.css";

function Profile() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <div className="main-container">
        <h1>My Green Bucket List</h1>
        <Cards />
      </div>
      <Footer />
    </>
  );
}

export default Profile;
