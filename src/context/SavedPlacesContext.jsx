import { createContext, useContext, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSavedPlacesInternal } from "../hooks/useSavedPlacesInternal.js";
import { firebaseAuthService } from "../utils/firebaseAuth.js";

export const SavedPlacesContext = createContext(null);
export const useSavedPlaces = () => useContext(SavedPlacesContext);

export function SavedPlacesProvider({ children }) {
  const { user, isSignedIn } = useUser();
  const savedPlacesApi = useSavedPlacesInternal();

  // Sync Clerk auth with Firebase Auth
  useEffect(() => {
    const syncFirebaseAuth = async () => {
      if (isSignedIn && user) {
        try {
          // Get Clerk session token
          const session = await user.getToken();
          
          // Sign into Firebase Auth with Clerk credentials
          await firebaseAuthService.signInWithClerk(session, user.id);
        } catch (error) {
          console.error('Failed to sync Firebase Auth:', error);
        }
      } else {
        // Sign out of Firebase Auth when Clerk user signs out
        await firebaseAuthService.signOut();
      }
    };

    syncFirebaseAuth();
  }, [isSignedIn, user]);

  return (
    <SavedPlacesContext.Provider value={savedPlacesApi}>
      {children}
    </SavedPlacesContext.Provider>
  );
}
