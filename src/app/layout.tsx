import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Annapurna Tours and Travels",
  description:
    "Experience the beauty of the Himalayas with our exclusive tour packages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
