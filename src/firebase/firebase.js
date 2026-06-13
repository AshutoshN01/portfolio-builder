import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const requiredEnv = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingEnv = requiredEnv.filter((key) => !import.meta.env[key]);

let app = null;
let auth = null;
let db = null;

if (missingEnv.length > 0) {
  console.error('Firebase configuration invalid');
  console.error('Missing Firebase configuration variables:\n' + missingEnv.join('\n'));

  // Define helper proxy to throw clear, descriptive errors if app tries to perform firebase actions
  const createInvalidConfigProxy = (serviceName) => {
    return new Proxy({}, {
      get(_, prop) {
        throw new Error(
          `Firebase ${serviceName} is not initialized. Cannot access property "${String(prop)}" because of invalid or missing configuration. Missing keys: ${missingEnv.join(', ')}`
        );
      }
    });
  };

  auth = createInvalidConfigProxy('Auth');
  db = createInvalidConfigProxy('Firestore');
} else {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log(`Firebase initialized successfully\nProject ID: ${firebaseConfig.projectId}`);
  } catch (error) {
    console.error('Firebase configuration invalid', error);
    const createErrorProxy = (serviceName) => {
      return new Proxy({}, {
        get(_, prop) {
          throw new Error(
            `Firebase ${serviceName} initialization failed: ${error.message}. Cannot access property "${String(prop)}".`
          );
        }
      });
    };
    auth = createErrorProxy('Auth');
    db = createErrorProxy('Firestore');
  }
}

export const isFirebaseInitialized = missingEnv.length === 0 && app !== null;
export const missingFirebaseEnv = missingEnv;
export { auth, db };
export default app;
