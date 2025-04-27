import React from "react";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import FirebaseNotice from "@/components/FirebaseNotice";
import PexelsNotice from "@/components/PexelsNotice";
import { fontClasses, addFontStyles } from "./fonts";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "South Asia Tours | Adventure Travel Specialists",
  description: "Discover spectacular mountain adventures across South Asia with our expert guides. Book your next journey today!",
  keywords: ["tours", "adventure", "South Asia", "travel", "Himalayas", "trekking", "mountains"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style dangerouslySetInnerHTML={{ __html: addFontStyles() }} />
      </head>
      <body className={`${fontClasses.body} antialiased`}>
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        
        <AuthProvider>
          <main id="main-content">
            {children}
          </main>
          <ToastContainer position="top-right" />
          <FirebaseNotice />
          <PexelsNotice />
        </AuthProvider>
      </body>
    </html>
  );
}
