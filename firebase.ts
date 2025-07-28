/**
 * Firebase Configuration and Utilities
 * Optimized for free tier usage
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { DreamspellCalculator } from './dreamspell';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export interface UserProfile {
  email: string;
  displayName: string;
  photoURL?: string;
  userId: string;
  galacticSignature: {
    kin: number;
    solarSeal: string;
    galacticTone: number;
    wavespell: number;
    color: string;
  };
  birthData?: {
    date: string; // ISO date string
    time: string;
    latitude: number;
    longitude: number;
    timezone: string;
    city?: string;
    country?: string;
  };
  profile: {
    bio: string;
    joinedAt: Timestamp;
    preferences: {
      notifications: boolean;
      privacy: 'public' | 'friends' | 'private';
    };
  };
  subscription: {
    tier: 'free' | 'premium' | 'new_earth_pioneer';
    status: 'active' | 'canceled' | 'expired';
    currentPeriodEnd?: Timestamp;
  };
}

export interface CalendarEntry {
  date: string; // YYYY-MM-DD
  kin: number;
  solarSeal: string;
  galacticTone: number;
  wavespell: number;
  oracle: {
    guide: string;
    challenge: string;
    occult: string;
    analog: string;
  };
  createdAt: Timestamp;
}

export interface Community {
  id: string;
  name: string;
  wavespell: number;
  createdBy: string;
  memberCount: number;
  members: string[]; // User IDs
  settings: {
    allowPosts: boolean;
    requireApproval: boolean;
    isPrivate: boolean;
  };
  createdAt: Timestamp;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhotoURL?: string;
  timestamp: Timestamp;
  communityId?: string;
}

// Authentication functions
export const authFunctions = {
  signInWithGoogle: async (): Promise<User | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Create or update user profile
      await createOrUpdateUserProfile(user);
      
      return user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },

  signOut: async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};

// Helper function to create or update user profile
const createOrUpdateUserProfile = async (user: User) => {
  if (!user.email) return;

  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    // Calculate galactic signature for new users based on current date
    // In a real app, this would be calculated from birth date
    const dreamspell = new DreamspellCalculator();
    const signature = dreamspell.getCurrentSignature();

    const newUserProfile: UserProfile = {
      email: user.email,
      displayName: user.displayName || 'Cosmic Explorer',
      photoURL: user.photoURL || '',
      userId: user.uid,
      galacticSignature: {
        kin: signature.kin,
        solarSeal: signature.solarSeal.name,
        galacticTone: signature.galacticTone.id,
        wavespell: signature.wavespell,
        color: signature.color
      },
      profile: {
        bio: `Kin ${signature.kin} - ${signature.galacticTone.name} ${signature.solarSeal.name}`,
        joinedAt: serverTimestamp() as Timestamp,
        preferences: {
          notifications: true,
          privacy: 'public'
        }
      },
      subscription: {
        tier: 'free',
        status: 'active'
      }
    };

    await setDoc(userDocRef, newUserProfile);
  } else {
    // Update existing user's display info
    const existingData = userDoc.data() as UserProfile;
    await setDoc(userDocRef, {
      ...existingData,
      displayName: user.displayName || existingData.displayName,
      photoURL: user.photoURL || existingData.photoURL
    }, { merge: true });
  }
};

// Database functions
export const dbFunctions = {
  createUser: async (userData: Partial<UserProfile>): Promise<void> => {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userDocRef, userData, { merge: true });
  },

  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  updateUserBirthData: async (birthData: UserProfile['birthData']): Promise<void> => {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    // Calculate galactic signature from birth date
    const dreamspell = new DreamspellCalculator();
    const birthDate = new Date(birthData?.date || '');
    const signature = dreamspell.getBirthSignature(birthDate);

    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userDocRef, {
      birthData,
      galacticSignature: {
        kin: signature.kin,
        solarSeal: signature.solarSeal.name,
        galacticTone: signature.galacticTone.id,
        wavespell: signature.wavespell,
        color: signature.color
      }
    }, { merge: true });
  },

  getCalendarEntry: async (date: string): Promise<CalendarEntry | null> => {
    try {
      const calendarDocRef = doc(db, 'calendar', date);
      const calendarDoc = await getDoc(calendarDocRef);
      
      if (calendarDoc.exists()) {
        return calendarDoc.data() as CalendarEntry;
      }
      
      // Generate calendar entry if it doesn't exist
      const dreamspell = new DreamspellCalculator();
      const dateObj = new Date(date);
      const signature = dreamspell.getGalacticSignature(dateObj);
      
      const calendarEntry: CalendarEntry = {
        date,
        kin: signature.kin,
        solarSeal: signature.solarSeal.name,
        galacticTone: signature.galacticTone.id,
        wavespell: signature.wavespell,
        oracle: {
          guide: 'Guide calculation', // Simplified for now
          challenge: 'Challenge calculation',
          occult: 'Occult calculation',
          analog: 'Analog calculation'
        },
        createdAt: serverTimestamp() as Timestamp
      };
      
      // Save to database
      await setDoc(calendarDocRef, calendarEntry);
      return calendarEntry;
    } catch (error) {
      console.error('Error getting calendar entry:', error);
      return null;
    }
  },

  createCommunity: async (communityData: Omit<Community, 'id' | 'createdAt' | 'members'>): Promise<string> => {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    const communityDocRef = await addDoc(collection(db, 'communities'), {
      ...communityData,
      members: [auth.currentUser.uid],
      createdAt: serverTimestamp()
    });
    
    return communityDocRef.id;
  },

  sendMessage: async (communityId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<void> => {
    const messagesRef = collection(db, 'communities', communityId, 'messages');
    await addDoc(messagesRef, {
      ...message,
      timestamp: serverTimestamp()
    });
  },

  subscribeToMessages: (
    communityId: string, 
    callback: (messages: ChatMessage[]) => void
  ) => {
    const messagesRef = collection(db, 'communities', communityId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(100));
    
    return onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      callback(messages.reverse()); // Reverse to show oldest first
    });
  }
};

// Cache management for free tier optimization
export class FirebaseCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const firebaseCache = new FirebaseCache();