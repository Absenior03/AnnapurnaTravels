import type { Metadata } from "next";
import { Cormorant_Garamond, Libre_Baskerville } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import FirebaseNotice from "@/components/FirebaseNotice";
import PexelsNotice from "@/components/PexelsNotice";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

// Elegant serif font for headings
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Refined serif font for body text
const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

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
      <body
        className={`${libreBaskerville.variable} ${cormorant.variable} antialiased`}
      >
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
