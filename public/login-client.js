import React from "react";
import { createRoot } from "react-dom/client";
import dynamic from "next/dynamic";

// This is a client-side only file
const LoginForm = dynamic(() => import("../src/app/(auth)/login/LoginForm"), {
  ssr: false,
});

export default function initializeLoginClient(container) {
  // Wait for all client-side dependencies to load
  setTimeout(() => {
    const root = createRoot(container);
    root.render(React.createElement(LoginForm));
  }, 100);
}
