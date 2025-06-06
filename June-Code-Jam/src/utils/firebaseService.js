import {db} from '../../firebaseConfig.js';

import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
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
    },

    async getPlaceById(placeId) {
        try {
          const placeDoc = await getDoc(doc(db, "places", placeId));
          
          if (!placeDoc.exists()) {
            throw new Error(`Place with ID ${placeId} not found`);
          }
          
          const place = {
            id: placeDoc.id,
            ...placeDoc.data()
          };
          
          console.log(`Retrieved place: ${place.name}`);
          return place;
        } catch (error) {
          console.error("Error getting place by ID:", error);
          throw error;
        }
    },

    async updatePlace(placeId, updates) {
        try {
          const placeRef = doc(db, "places", placeId);
          
          // Check if place exists first
          const placeDoc = await getDoc(placeRef);
          if (!placeDoc.exists()) {
            throw new Error(`Place with ID ${placeId} not found`);
          }
          
          // Add update timestamp
          const updateData = {
            ...updates,
            lastUpdated: serverTimestamp()
          };
          
          await updateDoc(placeRef, updateData);
          
          console.log(`Place ${placeId} updated successfully`);
          return true;
        } catch (error) {
          console.error("Error updating place:", error);
          throw error;
        }
    },

    async deletePlace(placeId) {
        try {
          const placeRef = doc(db, "places", placeId);
          
          // Check if place exists first
          const placeDoc = await getDoc(placeRef);
          if (!placeDoc.exists()) {
            throw new Error(`Place with ID ${placeId} not found`);
          }
          
          await deleteDoc(placeRef);
          
          console.log(`Place ${placeId} deleted successfully`);
          return true;
        } catch (error) {
          console.error("Error deleting place:", error);
          throw error;
        }
    },
    
    async updatePlaceField(placeId, fieldName, fieldValue) {
        try {
          const updates = {
            [fieldName]: fieldValue,
            lastUpdated: serverTimestamp()
          };
          
          await this.updatePlace(placeId, updates);
          console.log(`Updated ${fieldName} for place ${placeId}`);
          return true;
        } catch (error) {
          console.error(`Error updating ${fieldName}:`, error);
          throw error;
        }
    },

    async addAmenityToPlace(placeId, amenity) {
        try {
          const placeRef = doc(db, "places", placeId);
          
          await updateDoc(placeRef, {
            amenities: arrayUnion(amenity),
            lastUpdated: serverTimestamp()
          });
          
          console.log(`Added amenity '${amenity}' to place ${placeId}`);
          return true;
        } catch (error) {
          console.error("Error adding amenity:", error);
          throw error;
        }
    },

    async removeAmenityFromPlace(placeId, amenity) {
        try {
          const placeRef = doc(db, "places", placeId);
          
          await updateDoc(placeRef, {
            amenities: arrayRemove(amenity),
            lastUpdated: serverTimestamp()
          });
          
          console.log(`Removed amenity '${amenity}' from place ${placeId}`);
          return true;
        } catch (error) {
          console.error("Error removing amenity:", error);
          throw error;
        }
    }
}

export const userDataService = {

    async savePlace(userId, placeId) {
        try {
          const userDocRef = doc(db, "userSavedPlaces", userId);
          
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            await updateDoc(userDocRef, {
              savedPlaces: arrayUnion(placeId),
              lastUpdated: serverTimestamp()
            });
          } else {
            await setDoc(userDocRef, {
              userId: userId,
              savedPlaces: [placeId],
              createdAt: serverTimestamp(),
              lastUpdated: serverTimestamp()
            });
          }
          
          console.log(`Place ${placeId} saved for user ${userId}`);
          return true;
        } catch (error) {
          console.error("Error saving place:", error);
          throw error;
        }
      },

      async removeSavedPlace(userId, placeId) {
        try {
          const userDocRef = doc(db, "userSavedPlaces", userId);
          
          await updateDoc(userDocRef, {
            savedPlaces: arrayRemove(placeId),
            lastUpdated: serverTimestamp()
          });
          
          console.log(`Place ${placeId} removed from user ${userId}'s saved places`);
          return true;
        } catch (error) {
          console.error("Error removing saved place:", error);
          throw error;
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
          
          const savedPlaceIds = userDoc.data().savedPlaces || [];
          
          if (savedPlaceIds.length === 0) {
            return [];
          }
          
          const savedPlaces = [];
          for (const placeId of savedPlaceIds) {
            const placeDoc = await getDoc(doc(db, "places", placeId));
            if (placeDoc.exists()) {
              savedPlaces.push({
                id: placeDoc.id,
                ...placeDoc.data()
              });
            }
          }
          
          console.log(`Retrieved ${savedPlaces.length} saved places for user ${userId}`);
          return savedPlaces;
        } catch (error) {
          console.error("Error getting saved places:", error);
          throw error;
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
          return savedPlaces.includes(placeId);
        } catch (error) {
          console.error("Error checking if place is saved:", error);
          throw error;
        }
      }
}