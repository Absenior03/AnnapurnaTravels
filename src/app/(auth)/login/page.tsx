import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the client component with SSR disabled
const LoginForm = dynamic(() => import("./LoginForm"), {
  ssr: false,
  loading: () => <div className="p-12 text-center">Loading login form...</div>,
});

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="p-12 text-center">Loading login form...</div>}
    >
      <LoginForm />
    </Suspense>
  );
}
