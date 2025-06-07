import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { FaHome, FaLocationArrow } from "react-icons/fa";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="navbar">
      <div className="navbar-left">
        <FaHome
          className="navbar-icon"
          title="Home"
          onClick={() => navigate("/")}
        />
        <SignedIn>
          <FaLocationArrow
            className="navbar-icon"
            title="Profile"
            onClick={() => navigate("/profile")}
          />
        </SignedIn>
      </div>
      <div className="navbar-right">
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
