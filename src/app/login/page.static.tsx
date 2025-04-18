import React from "react";
import { StaticLoginPage } from "../static-auth";

// This file is only used during the build process
export default function LoginStaticPage() {
  return <StaticLoginPage />;
}

// Force Next.js to generate a static HTML file
export const generateStaticParams = async () => {
  return [{ path: ["login"] }];
};
