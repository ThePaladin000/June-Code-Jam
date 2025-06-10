import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import { FaHome, FaLocationArrow } from "react-icons/fa";
import "./Navbar.css";
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
      <img
        className="navbar__logo"
        src="https://6tlg35rybd.ufs.sh/f/JT0pvUmaDUtZlkot58vCy0GJFV1IZ3UXetAnNr4mDQjgHsSa"
        alt="Green Findr Logo"
      />
      <div className="navbar-right">
        <SignedOut>
          <SignInButton className="navbar__signin-btn" mode="modal" />
        </SignedOut>
        <SignedIn>
          {user && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "navbar__avatar",
                  userButtonAvatar: "navbar__avatar-image",
                  userButtonTrigger: "navbar__avatar-trigger",
                },
              }}
            />
          )}
        </SignedIn>
      </div>
    </header>
  );
}
