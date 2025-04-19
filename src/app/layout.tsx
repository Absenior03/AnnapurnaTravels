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
  title: "Annapurna Tours and Travels",
  description:
    "Experience the beauty of the Himalayas with our exclusive tour packages",
  keywords: "travel, tours, Annapurna, Himalayas, trekking, adventure, Nepal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: addFontStyles() }} />
      </head>
      <body className={`${fontClasses.body} antialiased`}>
        <AuthProvider>
          {children}
          <ToastContainer position="top-right" />
          <FirebaseNotice />
          <PexelsNotice />
        </AuthProvider>
      </body>
    </html>
  );
}
