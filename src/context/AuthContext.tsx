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
import { auth, db } from "@/lib/firebase";
import { User } from "@/types";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
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
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if Firebase auth is available (client-side only)
  const isFirebaseAvailable =
    typeof window !== "undefined" && auth !== null && db !== null;

  // Update isAdmin check to look for role === 'admin' instead of just email
  const isAdmin =
    user?.role === "admin" ||
    user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (!isFirebaseAvailable) {
      console.warn("Firebase not initialized - using demo mode");
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
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
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isFirebaseAvailable]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    if (!isFirebaseAvailable || !auth) {
      console.error("Firebase auth not available");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    if (!isFirebaseAvailable || !auth || !db) {
      console.error("Firebase not available");
      return;
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
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: "user",
        createdAt: new Date(),
      });
    } catch (error) {
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
