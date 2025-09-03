import "./Header.css";
import Navbar from "../Navbar/Navbar";

export default function Header() {
  return (
    <>
      <header>
        <Navbar />
        <div className="header__container">
          <h1 className="header__title">GREEN FINDR</h1>
          <p className="header__tagline">Parks Made Easy</p>
        </div>
      </header>
    </>
  );
}
