import { useState } from "react";
import "./Home.css";
import Navbar from "../Navbar/Navbar";
import Search from "../Search/Search";
import Cards from "../Cards/Cards";
import Footer from "../Footer/Footer";
import Spinner from "../Spinner/Spinner";
import Header from "../Header/Header";

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="home__layout">
      <div className="home__header">
        <Header />
        <Search onPlacesFetched={setPlaces} onLoading={setLoading} />
      </div>
      <div className={`home__content ${places.length > 0 ? "has-cards" : ""}`}>
        {" "}
        {loading ? <Spinner /> : <Cards places={places} />}
      </div>
      <Footer />
    </div>
  );
}
