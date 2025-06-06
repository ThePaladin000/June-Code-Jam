import { useState } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Search from "./components/search";

function App() {
  const [count, setCount] = useState(0);

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
