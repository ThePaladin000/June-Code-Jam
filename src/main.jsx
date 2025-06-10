import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./components/App/App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { SavedPlacesProvider } from "./context/SavedPlacesContext.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <SavedPlacesProvider>
        <App />
        </SavedPlacesProvider>
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>
);
