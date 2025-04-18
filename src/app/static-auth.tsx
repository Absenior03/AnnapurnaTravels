import React from "react";

export function StaticLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <p className="mb-8">Please wait while we load the login page...</p>
        <div className="animate-pulse">
          <div className="h-10 w-72 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div className="h-10 w-72 bg-gray-200 rounded mb-6 mx-auto"></div>
          <div className="h-10 w-72 bg-emerald-100 rounded mb-4 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export function StaticSignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <p className="mb-8">Please wait while we load the signup page...</p>
        <div className="animate-pulse">
          <div className="h-10 w-72 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div className="h-10 w-72 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div className="h-10 w-72 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div className="h-10 w-72 bg-emerald-100 rounded mb-4 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
