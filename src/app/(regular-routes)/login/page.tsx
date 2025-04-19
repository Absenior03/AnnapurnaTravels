import React from "react";
import dynamic from "next/dynamic";

// Import the client component with SSR disabled
const LoginForm = dynamic(() => import("../../(auth)/login/LoginForm"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-emerald-100 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mt-6"></div>
        </div>
      </div>
    </div>
  ),
});

export default function LoginPage() {
  return <LoginForm />;
}
