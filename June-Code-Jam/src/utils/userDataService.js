import { db, handleFirebaseError } from './firebaseUtils.js';
import { 
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
} from 'firebase/firestore';

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
            handleFirebaseError("saving place", error);
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
            handleFirebaseError("getting saved places", error);
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
            handleFirebaseError("checking if place is saved", error);
        }
    }
};