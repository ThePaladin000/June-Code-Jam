import {db} from '../../firebaseConfig.js';

export { db };


//  (Haversine formula)
export function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance; // Distance in kilometers
}

export function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

export function handleFirebaseError(operation, error) {
    console.error(`Error during ${operation}:`, error); 
    if (error.code === 'permission-denied') {
        throw new Error(`Permission denied. You don't have access to ${operation}.`);
    }
    if (error.code === 'not-found') {
        throw new Error(`Item not found. It may have been deleted.`);
    }  
    if (error.message?.includes('network')) {
        throw new Error(`Network error. Please check your connection and try again.`);
    }   
    throw new Error(`Something went wrong during ${operation}. Please try again.`);
}