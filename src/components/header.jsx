import Navbar from "./navbar";
import "./header.css";

export default function Header() {
  return (
    <>
      <Navbar />
      <div className="header__container">
        <h1 className="header__title">GREEN FINDER</h1>
        {/* <p>Tagline goes here... or one liner about what to do</p> */}
      </div>
    </>
  );
}
