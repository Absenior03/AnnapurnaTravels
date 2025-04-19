import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import {
  firebaseConfig,
  isFirebaseConfigValid,
  maskSensitiveValue,
} from "@/lib/env";

// Define a class to ensure Firebase is initialized only once
class FirebaseClient {
  private static instance: FirebaseClient;
  private app: FirebaseApp | null = null;
  private _auth: Auth | null = null;
  private _db: Firestore | null = null;
  private _storage: FirebaseStorage | null = null;
  private _isInitialized: boolean = false;
  private _initError: Error | null = null;
  private _isMockMode: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        // Check if we have valid Firebase config values
        if (!isFirebaseConfigValid()) {
          console.warn(
            "Firebase configuration is incomplete. API key or project ID is missing."
          );
          this._isInitialized = false;
          this._isMockMode = true;
          this._initError = new Error("Firebase configuration is incomplete");
          return;
        }

        // Log masked API key for debugging (only in development)
        if (process.env.NODE_ENV !== "production") {
          console.log(
            `Initializing Firebase with API key: ${maskSensitiveValue(
              firebaseConfig.apiKey
            )}`
          );
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
        this._isMockMode = false;

        console.log("Firebase initialized successfully");
      } catch (error) {
        this._initError =
          error instanceof Error ? error : new Error(String(error));
        console.error("Firebase initialization error:", error);
        console.warn("Firebase services will be mocked");
        this._isInitialized = false;
        this._isMockMode = true;
      }
    } else {
      // Server-side initialization not supported
      this._isInitialized = false;
      this._isMockMode = true;
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

  get isMockMode() {
    return this._isMockMode;
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
export const isMockMode =
  typeof window !== "undefined" ? firebase?.isMockMode : true;
