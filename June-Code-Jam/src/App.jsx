import "./App.css";
import Footer from "./components/footer";
import Search from "./components/search";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./profile";
import Cards from "./components/cards";
import "./components/cards.css";
import Header from "./components/header";

function Home() {
  return (
    <>
      <Header />
      <Search />
      <Cards />

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
