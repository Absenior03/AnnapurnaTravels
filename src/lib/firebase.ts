import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Provide fallback values to prevent errors during development or when environment variables are missing
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-app.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Define a class to ensure Firebase is initialized only once
class FirebaseClient {
  private static instance: FirebaseClient;
  private app: FirebaseApp | null = null;
  private _auth: Auth | null = null;
  private _db: Firestore | null = null;
  private _storage: FirebaseStorage | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        if (!getApps().length) {
          this.app = initializeApp(firebaseConfig);
        } else {
          this.app = getApps()[0];
        }
        this._auth = getAuth(this.app);
        this._db = getFirestore(this.app);
        this._storage = getStorage(this.app);
      } catch (error) {
        console.error("Firebase initialization error:", error);
        // Fallbacks remain null
      }
    }
  }

  public static getInstance(): FirebaseClient {
    if (!FirebaseClient.instance) {
      FirebaseClient.instance = new FirebaseClient();
    }
    return FirebaseClient.instance;
  }

  get auth() {
    return this._auth;
  }

  get db() {
    return this._db;
  }

  get storage() {
    return this._storage;
  }
}

// Only initialize client-side
let firebase: FirebaseClient;

if (typeof window !== "undefined") {
  firebase = FirebaseClient.getInstance();
}

export const app = typeof window !== "undefined" ? firebase?.app : null;
export const auth = typeof window !== "undefined" ? firebase?.auth : null;
export const db = typeof window !== "undefined" ? firebase?.db : null;
export const storage = typeof window !== "undefined" ? firebase?.storage : null;
