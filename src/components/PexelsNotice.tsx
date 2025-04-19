"use client";

import React from "react";
import Link from "next/link";

interface PexelsNoticeProps {
  className?: string;
}

export default function PexelsNotice({ className = "" }: PexelsNoticeProps) {
  return (
    <div
      className={`text-xs text-gray-500 flex items-center justify-center ${className}`}
    >
      <span>
        Images provided by{" "}
        <Link
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Pexels
        </Link>
      </span>
    </div>
  );
}
