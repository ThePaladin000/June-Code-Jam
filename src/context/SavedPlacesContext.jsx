// src/context/SavedPlacesContext.jsx
import { createContext, useContext } from "react";
import {useSavedPlacesInternal} from "../hooks/useSavedPlacesInternal.js";

// a tiny helper so we never forget to wrap the tree
export const SavedPlacesContext = createContext(null);
export const useSavedPlaces = () => useContext(SavedPlacesContext);

export function SavedPlacesProvider({ children }) {
  // this is *exactly* what your hook already does
  const savedPlacesApi = useSavedPlacesInternal();
  return (
    <SavedPlacesContext.Provider value={savedPlacesApi}>
      {children}
    </SavedPlacesContext.Provider>
  );
}