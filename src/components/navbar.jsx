import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import Logo from "../assets/GreenFindericon.svg";
import { FaHome, FaLocationArrow } from "react-icons/fa";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();

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
      <img className="navbar__logo" src={Logo} alt="Green Findr Logo" />
      <div className="navbar-right">
        <SignedOut>
          <SignInButton className="navbar__signin-btn" mode="modal" />
        </SignedOut>
        <SignedIn>
          {user && (
        <UserButton 
        appearance={{
          elements: {
            avatarBox: "navbar__avatar" // Use your existing CSS
          }
        }}
      />
          )}
        </SignedIn>
      </div>
    </header>
  );
}
