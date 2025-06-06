import { FaHome, FaLocationArrow } from "react-icons/fa";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <FaHome className="navbar-icon" title="Home" />
        <FaLocationArrow className="navbar-icon" title="GPS" />
      </div>
      <div className="navbar-right">
        <button className="navbar-btn">Sign up</button>
        <button className="navbar-btn">Login</button>
      </div>
    </nav>
  );
}
