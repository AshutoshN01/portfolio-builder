/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { auth, db, isFirebaseInitialized } from '@/firebase/firebase';
import { FirebaseDiagnostics } from '@/components/FirebaseDiagnostics';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up a new user, validating username uniqueness in a transaction
  const signup = async (email, password, username, name) => {
    const cleanUsername = username.trim().toLowerCase();
    
    // Create the firebase authentication account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    const defaultProfile = {
      uid,
      email,
      username: cleanUsername,
      name: name || '',
      title: 'Software Developer',
      tagline: 'Developer | Builder | Creator',
      location: '',
      bio: 'A passionate software developer focused on building clean, performant, and user-friendly applications.',
      heroDescription: 'Building clean, scalable software solutions.',
      heroHeadlinePrefix: 'Building ',
      heroHeadlineHighlight: 'great software',
      heroHeadlineSuffix: ' for the web.',
      availabilityStatus: 'Open to Opportunities',
      resumeUrl: '',
      contactDescription: 'Have a project idea, collaboration opportunity, or developer role? Send an inquiry below.',
      contactSuccessMessage: 'Message received! I will review your inquiry and get back to you as soon as possible.',
      theme: {
        accentColor: '#3B82F6', // Steel Blue default
        backgroundGlow: 'rgba(59, 130, 246, 0.15)',
        fontFamily: 'Inter',
      },
      createdAt: new Date().toISOString(),
    };

    // Use a Firestore transaction to write the username and profile, guaranteeing uniqueness
    await runTransaction(db, async (transaction) => {
      const usernameDocRef = doc(db, 'usernames', cleanUsername);
      const usernameSnap = await transaction.get(usernameDocRef);

      if (usernameSnap.exists()) {
        throw new Error('Username has already been claimed.');
      }

      const userDocRef = doc(db, 'users', uid);

      // Write registry doc
      transaction.set(usernameDocRef, { uid });

      // Write default user profile doc
      transaction.set(userDocRef, defaultProfile);
    });

    // Manually seed the auth context profile immediately upon successful database write
    setUserProfile(defaultProfile);

    return userCredential.user;
  };

  // Sign in an existing user
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign out
  const logout = () => {
    return signOut(auth);
  };

  // Auth listener
  useEffect(() => {
    if (!isFirebaseInitialized) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Load user profile
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // Only overwrite to null if the UID differs from the loaded profile
            setUserProfile((prev) => (prev && prev.uid === user.uid ? prev : null));
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile((prev) => (prev && prev.uid === user.uid ? prev : null));
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    signup,
    logout,
    setUserProfile, // Allow manual local state updates on save
  };

  if (!isFirebaseInitialized) {
    return <FirebaseDiagnostics />;
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
