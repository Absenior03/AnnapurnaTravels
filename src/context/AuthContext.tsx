"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  auth,
  db,
  isFirebaseInitialized,
  firebaseInitError,
} from "@/lib/firebase";
import { User } from "@/types";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  firebaseError: Error | null;
}

// Create the context with a default value to avoid undefined errors
const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  signIn: async () => {
    console.warn("Auth context not yet initialized");
  },
  signUp: async () => {
    console.warn("Auth context not yet initialized");
  },
  logout: async () => {
    console.warn("Auth context not yet initialized");
  },
  isAdmin: false,
  firebaseError: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<Error | null>(
    firebaseInitError
  );

  // Check if Firebase auth is available (client-side only)
  const isFirebaseAvailable =
    typeof window !== "undefined" &&
    isFirebaseInitialized &&
    auth !== null &&
    db !== null;

  // Update isAdmin check to look for role === 'admin' instead of just email
  const isAdmin =
    user?.role === "admin" ||
    user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (!isFirebaseAvailable) {
      console.warn(
        "Firebase not initialized or not available - using demo mode"
      );
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Try to get user data from Firestore
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: userDoc.data().role || "user",
              });
            } else {
              // If this is the admin email, set role to admin automatically
              const isAdminEmail =
                firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: isAdminEmail ? "admin" : "user",
              });

              // Create user document if it doesn't exist
              await setDoc(doc(db, "users", firebaseUser.uid), {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                role: isAdminEmail ? "admin" : "user",
                createdAt: new Date(),
              });
            }
          } catch (firestoreError) {
            console.error("Error accessing Firestore:", firestoreError);

            // Still set basic user info from Firebase Auth even if Firestore fails
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: "user", // Default role if Firestore fails
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setFirebaseError(
          error instanceof Error ? error : new Error(String(error))
        );
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isFirebaseAvailable]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    if (!isFirebaseAvailable || !auth) {
      const error = new Error(
        "Firebase authentication is not available. Please check your internet connection or try again later."
      );
      console.error(error);
      setFirebaseError(error);
      throw error;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      const authError =
        error instanceof Error ? error : new Error(String(error));
      setFirebaseError(authError);
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    if (!isFirebaseAvailable || !auth || !db) {
      const error = new Error(
        "Firebase services are not available. Please check your internet connection or try again later."
      );
      console.error(error);
      setFirebaseError(error);
      throw error;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName: name });

      // Store user in Firestore
      try {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name,
          role: "user",
          createdAt: new Date(),
        });
      } catch (firestoreError) {
        console.error(
          "Error saving user to Firestore (but account was created):",
          firestoreError
        );
        // We don't rethrow here because the account was created in Auth
      }
    } catch (error) {
      console.error("Signup error:", error);
      const authError =
        error instanceof Error ? error : new Error(String(error));
      setFirebaseError(authError);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    if (!isFirebaseAvailable || !auth) {
      console.error("Firebase auth not available");
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const contextValue = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    isAdmin,
    firebaseError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
