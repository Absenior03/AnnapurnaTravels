"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.3,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

// Premium input field component with animation
const AnimatedInput = ({
  id,
  label,
  type,
  placeholder,
  icon,
  value,
  onChange,
  required = true,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div variants={fadeIn} className="mb-6">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div
        className={`relative transition-all duration-200 ${
          isFocused ? "ring-2 ring-emerald-500 ring-opacity-50" : ""
        }`}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {React.cloneElement(icon, {
            className: `h-5 w-5 ${
              isFocused ? "text-emerald-500" : "text-gray-400"
            }`,
          })}
        </div>
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          placeholder={placeholder}
        />
      </div>
    </motion.div>
  );
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessState, setShowSuccessState] = useState(false);
  const router = useRouter();
  const { signIn, firebaseError } = useAuth();

  // Set initial error if Firebase has initialization errors
  useEffect(() => {
    if (firebaseError) {
      setErrorMessage(
        "Authentication service is temporarily unavailable. Please try again later."
      );
    }
  }, [firebaseError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(email, password);

      // Show success state before redirecting
      setShowSuccessState(true);

      // Redirect after a delay for animation
      setTimeout(() => {
        toast.success("Logged in successfully!");
        router.push("/");
      }, 1200);
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle different error types with user-friendly messages
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setErrorMessage("Invalid email or password");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage(
          "Too many failed login attempts. Please try again later or reset your password."
        );
      } else if (error.code === "auth/network-request-failed") {
        setErrorMessage(
          "Network error. Please check your internet connection."
        );
      } else {
        setErrorMessage(error.message || "Failed to log in. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  if (showSuccessState) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-emerald-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Login Successful
              </h2>
              <p className="text-gray-600 mb-6">
                You are being redirected to your dashboard...
              </p>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-emerald-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center mb-8"
            >
              <motion.div variants={fadeIn} className="inline-block mb-6">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                  <FiLogIn className="h-8 w-8 text-emerald-600" />
                </div>
              </motion.div>
              <motion.h1
                variants={fadeIn}
                className="text-3xl font-bold text-gray-800 mb-2"
              >
                Welcome Back
              </motion.h1>
              <motion.p variants={fadeIn} className="text-gray-600">
                Sign in to access your account
              </motion.p>
            </motion.div>

            {/* Error message display */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r"
                >
                  <div className="flex items-center">
                    <FiAlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <span className="text-red-700">{errorMessage}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <AnimatedInput
                id="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<FiMail />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              <AnimatedInput
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<FiLock />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <motion.div
                variants={fadeIn}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-colors"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </motion.div>

              <motion.div variants={fadeIn}>
                <button
                  type="submit"
                  disabled={isSubmitting || !!firebaseError}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="inline-flex items-center">
                      <FiLogIn className="h-5 w-5 mr-2" />
                      Sign in
                    </span>
                  )}
                </button>
              </motion.div>
            </motion.form>

            <motion.div variants={fadeIn} className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-md shadow-sm bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </motion.div>

            <motion.p
              variants={fadeIn}
              className="mt-8 text-center text-sm text-gray-600"
            >
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center"
              >
                Sign up <FiArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
