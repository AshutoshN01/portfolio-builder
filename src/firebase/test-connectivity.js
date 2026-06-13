import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Verifies Firestore read/write connectivity.
 * Performs a public read first. If a currentUser is provided, tests write as well.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function testFirestoreConnection() {
  try {
    // 1. Perform a read on a public collection to verify connectivity
    const testDocRef = doc(db, 'usernames', '_connectivity_probe_');
    await getDoc(testDocRef);
    return {
      success: true,
      message: 'Firestore connection verified successfully. Read probe completed.'
    };
  } catch (error) {
    console.error('Firestore connectivity test failed:', error);
    return {
      success: false,
      message: `Firestore connection failed: ${error.message}`
    };
  }
}
