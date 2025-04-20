import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "blue",
  className = "",
}) => {
  const sizeClass = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  const colorClass =
    {
      blue: "border-blue-500",
      white: "border-white",
      green: "border-green-500",
      red: "border-red-500",
      yellow: "border-yellow-500",
      purple: "border-purple-500",
      emerald: "border-emerald-500",
    }[color] || "border-blue-500";

  return (
    <div
      className={`inline-block ${className}`}
      role="status"
      aria-label="loading"
    >
      <div
        className={`${sizeClass[size]} animate-spin rounded-full border-t-transparent ${colorClass}`}
      ></div>
    </div>
  );
};

export default Spinner;
