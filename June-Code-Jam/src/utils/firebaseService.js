import {db} from '../../firebaseConfig.js';

import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
} from 'firebase/firestore';

export const placesService = {

    async addPlace(placeData) {
        try {
          const docRef = await addDoc(collection(db, "places"), {
            ...placeData,
            createdAt: serverTimestamp()
          });
          console.log("Place added with ID: ", docRef.id);
          return docRef.id;
        } catch (error) {
          console.error("Error adding place:", error);
          throw error;
        }
      },

      async getAllPlaces() {
        try {
          const querySnapshot = await getDocs(collection(db, "places"));
          const places = [];
          querySnapshot.forEach((doc) => {
            places.push({
              id: doc.id,
              ...doc.data()
            });
          });
          return places;
        } catch (error) {
          console.error("Error getting places:", error);
          throw error;
        }
      }
}

export const userDataService = {

  async savePlace(userId, placeId) {
    try {
        console.log("Saving place for user:", userId, "with place:", placeId);
        return true;
    } catch (error) {
        console.error("Error saving place:", error);
        throw error;
    }
  },

  async getSavedPlaces(userId) {
    try {
      console.log(`Getting saved places for user ${userId}`);
      return [];
    } catch (error) {
      console.error("Error getting saved places:", error);
      throw error;
    }
  }
}