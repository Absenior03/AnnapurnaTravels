"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Default AuthContext implementation for when Firebase is not available
const defaultAuthContext: AuthContextProps = {
  user: null,
  loading: false,
  signIn: async () => {
    console.log("Firebase auth not initialized - sign in unavailable");
  },
  signUp: async () => {
    console.log("Firebase auth not initialized - sign up unavailable");
  },
  logout: async () => {
    console.log("Firebase auth not initialized - logout unavailable");
  },
  isAdmin: false,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if Firebase auth is available
  const isFirebaseAvailable = auth !== null && db !== null;

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

  // If Firebase is not available, return a demo context
  if (!isFirebaseAvailable) {
    return (
      <AuthContext.Provider value={defaultAuthContext}>
        {children}
      </AuthContext.Provider>
    );
  }

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
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

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
