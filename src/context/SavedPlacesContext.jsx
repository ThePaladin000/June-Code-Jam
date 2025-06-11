import { createContext, useContext } from "react";
import { useSavedPlacesInternal } from "../hooks/useSavedPlacesInternal.js";

export const SavedPlacesContext = createContext(null);
export const useSavedPlaces = () => useContext(SavedPlacesContext);

export function SavedPlacesProvider({ children }) {
  const savedPlacesApi = useSavedPlacesInternal();
  return (
    <SavedPlacesContext.Provider value={savedPlacesApi}>
      {children}
    </SavedPlacesContext.Provider>
  );
}
