import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../firebaseConfig.js';

class FirebaseAuthService {
  constructor() {
    this.isSigningIn = false;
  }

  /**
   * Sign into Firebase Auth using Clerk session
   * @param {string} sessionToken - Clerk session token
   * @param {string} userId - Clerk user ID
   */
  async signInWithClerk(sessionToken, userId) {
    if (this.isSigningIn) {
      console.log('Already signing in to Firebase...');
      return;
    }

    try {
      this.isSigningIn = true;
      
      // Exchange Clerk token for Firebase custom token
      const response = await fetch('/api/firebase-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionToken,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get Firebase token: ${response.statusText}`);
      }

      const { firebaseToken } = await response.json();

      // Sign in to Firebase Auth with custom token
      const userCredential = await signInWithCustomToken(auth, firebaseToken);
      
      console.log('✅ Successfully signed into Firebase Auth:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('❌ Error signing into Firebase Auth:', error);
      throw error;
    } finally {
      this.isSigningIn = false;
    }
  }

  /**
   * Sign out of Firebase Auth
   */
  async signOut() {
    try {
      await auth.signOut();
      console.log('✅ Signed out of Firebase Auth');
    } catch (error) {
      console.error('❌ Error signing out of Firebase Auth:', error);
    }
  }

  /**
   * Get current Firebase Auth user
   */
  getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Check if user is signed into Firebase Auth
   */
  isSignedIn() {
    return !!auth.currentUser;
  }
}

export const firebaseAuthService = new FirebaseAuthService(); 