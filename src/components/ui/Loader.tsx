import React from "react";

interface SpinnerCircularProps {
  size?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  className?: string;
}

export const SpinnerCircular: React.FC<SpinnerCircularProps> = ({
  size = 40,
  thickness = 3.6,
  color = "rgba(80, 80, 255, 0.8)",
  trackColor = "rgba(80, 80, 255, 0.2)",
  className = "",
}) => {
  return (
    <div
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size,
      }}
      role="status"
      aria-label="loading"
    >
      <svg
        viewBox="22 22 44 44"
        style={{
          animation: "spinner-circular 1.4s linear infinite",
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <circle
          cx="44"
          cy="44"
          r="20.2"
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
        />
        <circle
          cx="44"
          cy="44"
          r="20.2"
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray="80px, 200px"
          strokeDashoffset="0px"
          style={{
            animation: "spinner-circular-dash 1.4s ease-in-out infinite",
            strokeLinecap: "round",
          }}
        />
      </svg>
      <style jsx>{`
        @keyframes spinner-circular {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes spinner-circular-dash {
          0% {
            stroke-dasharray: 1px, 200px;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 100px, 200px;
            stroke-dashoffset: -15px;
          }
          100% {
            stroke-dasharray: 100px, 200px;
            stroke-dashoffset: -125px;
          }
        }
      `}</style>
    </div>
  );
};

export default SpinnerCircular;
