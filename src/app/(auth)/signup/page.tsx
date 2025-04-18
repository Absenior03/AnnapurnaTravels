import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the client component with SSR disabled
const SignUpForm = dynamic(() => import("./SignUpForm"), {
  ssr: false,
  loading: () => <div className="p-12 text-center">Loading signup form...</div>,
});

export default function SignUpPage() {
  return (
    <Suspense
      fallback={<div className="p-12 text-center">Loading signup form...</div>}
    >
      <SignUpForm />
    </Suspense>
  );
}
