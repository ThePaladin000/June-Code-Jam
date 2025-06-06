import { useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Search from "./components/search";
import { loadGoogleMapsScript } from "./utils/loadGoogleMaps";

function App() {
  useEffect(() => {
    loadGoogleMapsScript(import.meta.env.MAPS_API_KEY);
  }, []);

  return (
    <>
      <Navbar />
      <div className="main-container">
        <h1>Green Finder</h1>
        <Search />
      </div>
      <Footer />
    </>
  );
}

export default App;
