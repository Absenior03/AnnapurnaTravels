import React from "react";
import { StaticSignupPage } from "../static-auth";

// This file is only used during the build process
export default function SignupStaticPage() {
  return <StaticSignupPage />;
}

// Force Next.js to generate a static HTML file
export const generateStaticParams = async () => {
  return [{ path: ["signup"] }];
};
