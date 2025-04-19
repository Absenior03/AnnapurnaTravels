"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiSettings,
  FiCalendar,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Tours", href: "/tours" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();

  // Check if the authentication is complete (to avoid flashing login/logout state)
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Set authChecked to true after the first render
    setAuthChecked(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <span className="text-xl font-bold text-emerald-600">
                Annapurna Tours
              </span>
            </Link>
            <div className="hidden md:ml-6 md:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href));

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 ${
                        isActive
                          ? "text-emerald-700 bg-emerald-50"
                          : "text-gray-700"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            {authChecked && (
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/dashboard" className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || "User"}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <FiUser className="h-4 w-4" />
                        )}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {user.displayName || user.email?.split("@")[0]}
                      </span>
                    </Link>

                    <Link
                      href="/bookings"
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-emerald-50 transition-colors duration-200 ${
                        pathname === "/bookings"
                          ? "text-emerald-700 bg-emerald-50"
                          : "text-gray-700"
                      }`}
                    >
                      <FiCalendar className="mr-2 h-4 w-4" />
                      My Bookings
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-emerald-600 hover:bg-emerald-50"
                      >
                        <FiSettings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Link
                      href="/login"
                      className="px-4 py-2 text-sm font-medium rounded-md border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-colors duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-2 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-emerald-600 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white"
          >
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/bookings"
                    className={`block px-3 py-2 text-base font-medium rounded-md ${
                      pathname === "/bookings"
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 h-4 w-4" />
                      My Bookings
                    </div>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
