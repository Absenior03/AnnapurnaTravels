import React from "react";
import { createRoot } from "react-dom/client";
import dynamic from "next/dynamic";

// This is a client-side only file
const SignUpForm = dynamic(
  () => import("../src/app/(auth)/signup/SignUpForm"),
  {
    ssr: false,
  }
);

export default function initializeSignupClient(container) {
  // Wait for all client-side dependencies to load
  setTimeout(() => {
    const root = createRoot(container);
    root.render(React.createElement(SignUpForm));
  }, 100);
}
