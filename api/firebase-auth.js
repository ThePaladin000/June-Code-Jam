import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  try {
    // Try to use service account file
    const serviceAccount = await import('../firebase-service-account.json', { assert: { type: 'json' } });
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount.default),
    });
  } catch (error) {
    // Fallback to environment variables for production
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionToken, userId } = req.body;

    if (!sessionToken || !userId) {
      return res.status(400).json({ error: 'Missing sessionToken or userId' });
    }

    // Verify the Clerk session token
    const response = await fetch(`https://api.clerk.com/v1/sessions/${sessionToken}/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Invalid Clerk session');
    }

    const sessionData = await response.json();
    
    // Verify the user ID matches
    if (sessionData.user_id !== userId) {
      throw new Error('User ID mismatch');
    }

    // Create Firebase custom token
    const customToken = await admin.auth().createCustomToken(userId, {
      clerkUserId: userId,
    });

    res.status(200).json({ firebaseToken: customToken });
  } catch (error) {
    console.error('Error creating Firebase token:', error);
    res.status(500).json({ error: 'Failed to create Firebase token' });
  }
} 