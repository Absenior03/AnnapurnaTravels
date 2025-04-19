import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import {
  firebaseConfig,
  isFirebaseConfigValid,
  maskSensitiveValue,
} from "@/lib/env";

// Define interfaces for mock functionality
interface MockAuth {
  currentUser: User | null;
  signInWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<UserCredential>;
  createUserWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  onAuthStateChanged: (callback: (user: User | null) => void) => () => void;
}

interface MockFirestore {
  collection: (path: string) => any;
  doc: (colRef: any, id: string) => any;
  getDoc: (docRef: any) => Promise<any>;
  setDoc: (docRef: any, data: any) => Promise<void>;
}

// Mock implementations
class MockFirebaseClient {
  private static instance: MockFirebaseClient;
  private _auth: MockAuth;
  private _db: MockFirestore;
  private _storage: any;
  private _currentUser: User | null = null;
  private _listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Mock Auth implementation
    this._auth = {
      currentUser: null,
      signInWithEmailAndPassword: async (email: string, password: string) => {
        if (email === "demo@example.com" && password === "password") {
          const mockUser = {
            uid: "mock-user-123",
            email: email,
            displayName: "Demo User",
            emailVerified: true,
            providerData: [],
            metadata: {},
            toJSON: () => ({}),
          } as unknown as User;

          this._currentUser = mockUser;
          this._notifyAuthStateChange();

          return { user: mockUser } as UserCredential;
        }

        // Demo admin user
        if (email === "admin@example.com" && password === "admin123") {
          const mockUser = {
            uid: "mock-admin-123",
            email: email,
            displayName: "Admin User",
            emailVerified: true,
            providerData: [],
            metadata: {},
            toJSON: () => ({}),
          } as unknown as User;

          this._currentUser = mockUser;
          this._notifyAuthStateChange();

          return { user: mockUser } as UserCredential;
        }

        throw new Error("auth/invalid-credential");
      },
      createUserWithEmailAndPassword: async (
        email: string,
        password: string
      ) => {
        const mockUser = {
          uid: `mock-${Math.random().toString(36).substring(2, 9)}`,
          email: email,
          displayName: "",
          emailVerified: false,
          providerData: [],
          metadata: {},
          toJSON: () => ({}),
        } as unknown as User;

        this._currentUser = mockUser;
        this._notifyAuthStateChange();

        return { user: mockUser } as UserCredential;
      },
      signOut: async () => {
        this._currentUser = null;
        this._notifyAuthStateChange();
      },
      onAuthStateChanged: (callback: (user: User | null) => void) => {
        this._listeners.push(callback);
        // Initial callback
        callback(this._currentUser);
        // Return unsubscribe function
        return () => {
          this._listeners = this._listeners.filter(
            (listener) => listener !== callback
          );
        };
      },
    };

    // Mock Firestore implementation
    this._db = {
      collection: (path: string) => ({ path }),
      doc: (colRef: any, id: string) => ({
        colRef,
        id,
        path: `${colRef.path}/${id}`,
      }),
      getDoc: async (docRef: any) => ({
        exists: () =>
          docRef.id === "mock-user-123" || docRef.id === "mock-admin-123",
        data: () => {
          if (docRef.id === "mock-user-123") {
            return { role: "user", displayName: "Demo User" };
          }
          if (docRef.id === "mock-admin-123") {
            return { role: "admin", displayName: "Admin User" };
          }
          return null;
        },
      }),
      setDoc: async (docRef: any, data: any) => {
        console.log("Mock setDoc:", docRef.path, data);
        return Promise.resolve();
      },
    };

    // Mock Storage
    this._storage = {
      ref: (path: string) => ({ path }),
    };

    console.log("🔶 Firebase initialized in MOCK MODE");
  }

  private _notifyAuthStateChange() {
    this._listeners.forEach((callback) => callback(this._currentUser));
  }

  public static getInstance(): MockFirebaseClient {
    if (!MockFirebaseClient.instance) {
      MockFirebaseClient.instance = new MockFirebaseClient();
    }
    return MockFirebaseClient.instance;
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
  private _mockClient: MockFirebaseClient | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        // Check if we're in development mode and if mock mode is enabled
        const forceMockMode =
          process.env.NODE_ENV !== "production" &&
          (process.env.NEXT_PUBLIC_FIREBASE_MOCK_MODE === "true" ||
            !isFirebaseConfigValid());

        // Check if we have valid Firebase config values
        if (forceMockMode) {
          console.warn(
            "🔶 Firebase is running in MOCK MODE (development environment with missing or invalid config)"
          );
          this._isInitialized = true;
          this._isMockMode = true;
          this._mockClient = MockFirebaseClient.getInstance();
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
        console.warn("Firebase services will be mocked instead");
        this._isInitialized = true;
        this._isMockMode = true;
        this._mockClient = MockFirebaseClient.getInstance();
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
    return this._isMockMode && this._mockClient
      ? (this._mockClient.auth as unknown as Auth)
      : this._auth;
  }

  get db() {
    return this._isMockMode && this._mockClient
      ? (this._mockClient.db as unknown as Firestore)
      : this._db;
  }

  get storage() {
    return this._isMockMode && this._mockClient
      ? (this._mockClient.storage as unknown as FirebaseStorage)
      : this._storage;
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

// Force mock mode in development if environment variable is set
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  if (process.env.NEXT_PUBLIC_FIREBASE_MOCK_MODE === "true") {
    console.log("⚠️ Firebase mock mode is enabled via environment variable");
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

// Export mock credentials for development
export const MOCK_CREDENTIALS = {
  REGULAR_USER: {
    email: "demo@example.com",
    password: "password",
  },
  ADMIN_USER: {
    email: "admin@example.com",
    password: "admin123",
  },
};
