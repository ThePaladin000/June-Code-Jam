import { 
    db,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    calculateDistance,
    handleFirebaseError
} from './firebaseUtils.js';

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
            handleFirebaseError("adding place", error);
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
            handleFirebaseError("getting all places", error);
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
            console.log(`✅ Retrieved place: ${place.name}`);
            return place;
        } catch (error) {
            handleFirebaseError("getting place by ID", error);
        }
    },
    async updatePlace(placeId, updates) {
        try {
            const placeRef = doc(db, "places", placeId);        
            const placeDoc = await getDoc(placeRef);
            if (!placeDoc.exists()) {
                throw new Error(`Place with ID ${placeId} not found`);
            }         
            const updateData = {
                ...updates,
                lastUpdated: serverTimestamp()
            };         
            await updateDoc(placeRef, updateData);      
            console.log(`✅ Place ${placeId} updated successfully`);
            return true;
        } catch (error) {
            handleFirebaseError("updating place", error);
        }
    },
    async deletePlace(placeId) {
        try {
            const placeRef = doc(db, "places", placeId);         
            const placeDoc = await getDoc(placeRef);
            if (!placeDoc.exists()) {
                throw new Error(`Place with ID ${placeId} not found`);
            }       
          await deleteDoc(placeRef);        
            console.log(`✅ Place ${placeId} deleted successfully`);
            return true;
        } catch (error) {
            handleFirebaseError("deleting place", error);
        }
    },
    async searchPlaces(searchTerm) {
        try {
            if (!searchTerm || searchTerm.trim() === '') {
                return await this.getAllPlaces();
            }
            const searchLower = searchTerm.toLowerCase();
            const allPlaces = await this.getAllPlaces();        
            const filteredPlaces = allPlaces.filter(place => {
                const nameMatch = place.name?.toLowerCase().includes(searchLower);
                const descMatch = place.description?.toLowerCase().includes(searchLower);
                const addressMatch = place.address?.toLowerCase().includes(searchLower);             
                return nameMatch || descMatch || addressMatch;
            });
            console.log(`✅ Found ${filteredPlaces.length} places matching "${searchTerm}"`);
            return filteredPlaces;
        } catch (error) {
            handleFirebaseError("searching places", error);
        }
    },
    async getPlacesByType(placeType) {
        try {
            const q = query(
                collection(db, "places"),
                where("type", "==", placeType),
                orderBy("name")
            );
            const querySnapshot = await getDocs(q);
            const places = [];    
            querySnapshot.forEach((doc) => {
                places.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            console.log(`✅ Found ${places.length} places of type "${placeType}"`);
            return places;
        } catch (error) {
            handleFirebaseError("filtering places by type", error);
        }
    },
    async getPlacesByAmenity(amenity) {
        try {
            const q = query(
                collection(db, "places"),
                where("amenities", "array-contains", amenity),
                orderBy("name")
            );    
            const querySnapshot = await getDocs(q);
            const places = [];        
            querySnapshot.forEach((doc) => {
                places.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            console.log(`✅ Found ${places.length} places with amenity "${amenity}"`);
            return places;
        } catch (error) {
            handleFirebaseError("filtering places by amenity", error);
        }
    },
    async getNearbyPlaces(lat, lng, radiusKm = 5) {
        try {
            const allPlaces = await this.getAllPlaces();       
            const nearbyPlaces = allPlaces.filter(place => {
                if (!place.location?.lat || !place.location?.lng) return false;   
                const distance = calculateDistance(
                    lat, lng, 
                    place.location.lat, place.location.lng
                );             
                return distance <= radiusKm;
            });
            nearbyPlaces.sort((a, b) => {
                const distA = calculateDistance(lat, lng, a.location.lat, a.location.lng);
                const distB = calculateDistance(lat, lng, b.location.lat, b.location.lng);
                return distA - distB;
            });
            console.log(`✅ Found ${nearbyPlaces.length} places within ${radiusKm}km`);
            return nearbyPlaces;
        } catch (error) {
            handleFirebaseError("finding nearby places", error);
        }
    },
    async getRecentPlaces(limitCount = 10) {
        try {
            const q = query(
                collection(db, "places"),
                orderBy("createdAt", "desc"),
                limit(limitCount)
            );            
            const querySnapshot = await getDocs(q);
            const places = [];        
            querySnapshot.forEach((doc) => {
                places.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            console.log(`✅ Retrieved ${places.length} most recent places`);
            return places;
        } catch (error) {
            handleFirebaseError("getting recent places", error);
        }
    },
    async getPlacesByTypeAndAmenity(placeType, amenity) {
        try {
            const q = query(
                collection(db, "places"),
                where("type", "==", placeType),
                where("amenities", "array-contains", amenity),
                orderBy("name")
            );        
            const querySnapshot = await getDocs(q);
            const places = [];         
            querySnapshot.forEach((doc) => {
                places.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            console.log(`✅ Found ${places.length} ${placeType}s with ${amenity}`);
            return places;
        } catch (error) {
            handleFirebaseError("filtering by type and amenity", error);
        }
    },
    async updatePlaceField(placeId, fieldName, fieldValue) {
        try {
            const updates = {
                [fieldName]: fieldValue,
                lastUpdated: serverTimestamp()
            };        
            await this.updatePlace(placeId, updates);
            console.log(`✅ Updated ${fieldName} for place ${placeId}`);
            return true;
        } catch (error) {
            handleFirebaseError(`updating ${fieldName}`, error);
        }
    },
    async addAmenityToPlace(placeId, amenity) {
        try {
            const placeRef = doc(db, "places", placeId);
            
            await updateDoc(placeRef, {
                amenities: arrayUnion(amenity),
                lastUpdated: serverTimestamp()
            });         
            console.log(`✅ Added amenity '${amenity}' to place ${placeId}`);
            return true;
        } catch (error) {
            handleFirebaseError("adding amenity", error);
        }
    },
    async removeAmenityFromPlace(placeId, amenity) {
        try {
            const placeRef = doc(db, "places", placeId);
            
            await updateDoc(placeRef, {
                amenities: arrayRemove(amenity),
                lastUpdated: serverTimestamp()
            });         
            console.log(`✅ Removed amenity '${amenity}' from place ${placeId}`);
            return true;
        } catch (error) {
            handleFirebaseError("removing amenity", error);
        }
    }
};