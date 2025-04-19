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
  private _isInitialized: boolean = false;
  private _initError: Error | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        // Check if we have valid Firebase config values - at minimum we need apiKey
        if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
          console.warn(
            "Firebase API key is missing, initializing in mock mode"
          );
          this._isInitialized = false;
          return;
        }

        if (!getApps().length) {
          this.app = initializeApp(firebaseConfig);
        } else {
          this.app = getApps()[0];
        }

        this._auth = getAuth(this.app);
        this._db = getFirestore(this.app);
        this._storage = getStorage(this.app);
        this._isInitialized = true;

        console.log("Firebase initialized successfully");
      } catch (error) {
        this._initError =
          error instanceof Error ? error : new Error(String(error));
        console.error("Firebase initialization error:", error);
        console.warn("Firebase services will be mocked");
        this._isInitialized = false;
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

  get isInitialized() {
    return this._isInitialized;
  }

  get initError() {
    return this._initError;
  }
}

// Only initialize client-side
let firebase: FirebaseClient | null = null;

if (typeof window !== "undefined") {
  try {
    firebase = FirebaseClient.getInstance();
  } catch (error) {
    console.error("Failed to get Firebase instance:", error);
  }
}

export const app = typeof window !== "undefined" ? firebase?.app : null;
export const auth = typeof window !== "undefined" ? firebase?.auth : null;
export const db = typeof window !== "undefined" ? firebase?.db : null;
export const storage = typeof window !== "undefined" ? firebase?.storage : null;
export const isFirebaseInitialized =
  typeof window !== "undefined" ? firebase?.isInitialized : false;
export const firebaseInitError =
  typeof window !== "undefined" ? firebase?.initError : null;
