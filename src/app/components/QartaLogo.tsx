"use client";
import React from "react";

type Variant = "badge" | "mono-white" | "mono-dark";

interface QartaLogoProps {
  size?: number;
  variant?: Variant;
  className?: string;
  showTiles?: boolean;
}

export const QartaLogo = ({
  size = 64,
  variant = "badge",
  className = "",
  showTiles = true,
}: QartaLogoProps) => {
  const palette = {
    badge: { bg: "#0f2044", q: "#4a9eff", tileLight: "#cfe3ff", tileMid: "#74d3ff" },
    "mono-white": { bg: "transparent", q: "#ffffff", tileLight: "rgba(255,255,255,.85)", tileMid: "rgba(255,255,255,.55)" },
    "mono-dark": { bg: "transparent", q: "#0f2044", tileLight: "#2c7be5", tileMid: "#4a9eff" },
  }[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="QARTA"
      data-testid="qarta-logo"
    >
      {variant === "badge" && (
        <rect x="0" y="0" width="120" height="120" rx="26" fill={palette.bg} />
      )}
      <g>
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Manrope, sans-serif"
          fontSize="78"
          fontWeight="800"
          fill={palette.q}
          letterSpacing="-2"
        >
          Q
        </text>
        <rect x="72" y="78" width="14" height="5" rx="2.5" fill={palette.q} transform="rotate(30 79 80)" />
      </g>
      {showTiles && (
        <g opacity="0.95">
          <rect x="82" y="14" width="11" height="11" rx="2.4" fill={palette.tileLight} />
          <rect x="97" y="14" width="11" height="11" rx="2.4" fill={palette.tileMid} opacity="0.75" />
          <rect x="82" y="29" width="11" height="11" rx="2.4" fill={palette.tileMid} opacity="0.55" />
          <rect x="97" y="29" width="11" height="11" rx="2.4" fill={palette.tileLight} opacity="0.9" />
        </g>
      )}
    </svg>
  );
};

interface QartaWordmarkProps {
  color?: string;
  className?: string;
}

export const QartaWordmark = ({ color = "#0f2044", className = "" }: QartaWordmarkProps) => (
  <span
    className={className}
    style={{
      fontFamily: "Manrope, sans-serif",
      fontWeight: 800,
      fontSize: "1.15rem",
      letterSpacing: "0.22em",
      color,
    }}
    data-testid="qarta-wordmark"
  >
    QARTA
  </span>
);

export default QartaLogo;
