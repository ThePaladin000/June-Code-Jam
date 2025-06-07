import "./App.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Search from "./components/search";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./profile";
import Cards from "./components/cards";
import "./components/cards.css";

function Home() {
  return (
    <>
      <Navbar />
      <div className="main-container">
        <h1>Green Findr</h1>
        <Search />
        <Cards />
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
