import { db, handleFirebaseError } from "./firebaseUtils.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

export const userDataService = {
  async savePlace(userId, placeId, placeName) {
    try {
      const userDocRef = doc(db, "userSavedPlaces", userId);
      const userDoc = await getDoc(userDocRef);
      const placeObj = { id: placeId, name: placeName };
      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          savedPlaces: arrayUnion(placeObj),
          lastUpdated: serverTimestamp(),
        });
      } else {
        await setDoc(userDocRef, {
          userId: userId,
          savedPlaces: [placeObj],
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
        });
      }
      console.log(`Place ${placeId} saved for user ${userId}`);
      return true;
    } catch (error) {
      handleFirebaseError("saving place", error);
    }
  },
  async removeSavedPlace(userId, placeId) {
    try {
      const userDocRef = doc(db, "userSavedPlaces", userId);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) return true;
      const savedPlaces = userDoc.data().savedPlaces || [];
      const updatedPlaces = savedPlaces.filter((p) =>
        typeof p === "string" ? p !== placeId : p.id !== placeId
      );
      await updateDoc(userDocRef, {
        savedPlaces: updatedPlaces,
        lastUpdated: serverTimestamp(),
      });
      console.log(
        `Place ${placeId} removed from user ${userId}'s saved places`
      );
      return true;
    } catch (error) {
      handleFirebaseError("removing saved place", error);
    }
  },
  async getSavedPlaces(userId) {
    try {
      const userDocRef = doc(db, "userSavedPlaces", userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.log(`No saved places found for user ${userId}`);
        return [];
      }

      const savedPlaces = userDoc.data().savedPlaces || [];
      return savedPlaces;
    } catch (error) {
      handleFirebaseError("getting saved places", error);
      return [];
    }
  },
  async isPlaceSaved(userId, placeId) {
    try {
      const userDocRef = doc(db, "userSavedPlaces", userId);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        return false;
      }
      const savedPlaces = userDoc.data().savedPlaces || [];
      return savedPlaces.some((p) =>
        typeof p === "string" ? p === placeId : p.id === placeId
      );
    } catch (error) {
      handleFirebaseError("checking if place is saved", error);
    }
  },
};
