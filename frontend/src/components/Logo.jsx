import React from 'react';

/**
 * PlacementIQ Apple-Design System Emblem & Brandmark
 * Features an authentic iOS 18 superellipse squircle with specular rim lighting,
 * dynamic multi-stop gradient (Apple Sapphire -> Siri Indigo),
 * a faceted academic graduation crest, analytical growth trajectory pillars,
 * and a success sparkle star.
 */
export const PlacementIQEmblem = ({ size = 36, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
      aria-label="PlacementIQ Emblem"
    >
      <defs>
        <linearGradient id="piqEmblemBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0071e3" />
          <stop offset="50%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>

        <linearGradient id="piqEmblemRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>

        <linearGradient id="piqEmblemCap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>

        <linearGradient id="piqEmblemCrest" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64d2ff" />
          <stop offset="100%" stopColor="#0071e3" />
        </linearGradient>

        <linearGradient id="piqEmblemGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe600" />
          <stop offset="100%" stopColor="#ff9500" />
        </linearGradient>

        <filter id="piqEmblemDrop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#070b14" floodOpacity="0.38" />
        </filter>

        <filter id="piqEmblemGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* iOS 18 Rounded Squircle Background */}
      <rect x="8" y="8" width="112" height="112" rx="28" fill="url(#piqEmblemBg)" />

      {/* Inner Specular Glass Rim */}
      <rect
        x="8"
        y="8"
        width="112"
        height="112"
        rx="28"
        fill="url(#piqEmblemRim)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />

      {/* Dynamic Specular Arc Reflection */}
      <path
        d="M8 36 C8 20.5 20.5 8 36 8 L92 8 C107.5 8 120 20.5 120 36 C85 52 43 52 8 36 Z"
        fill="rgba(255,255,255,0.15)"
      />

      {/* Central Identity Motif */}
      <g filter="url(#piqEmblemDrop)">
        {/* IQ Crest / Shield Foundation */}
        <path
          d="M38 52 L38 68 C38 82 64 92 64 92 C64 92 90 82 90 68 L90 52 L64 64 Z"
          fill="url(#piqEmblemCrest)"
        />

        {/* Analytical Progress Trajectory Columns */}
        <rect x="51" y="70" width="5" height="11" rx="2.5" fill="#ffffff" opacity="0.85" />
        <rect x="61.5" y="65" width="5" height="16" rx="2.5" fill="#ffffff" opacity="0.95" />
        <rect x="72" y="60" width="5" height="21" rx="2.5" fill="#ffffff" opacity="1" />

        {/* Mortarboard Diamond (Cap Top) */}
        <path d="M64 26 L102 44 L64 62 L26 44 Z" fill="url(#piqEmblemCap)" />

        {/* Cap Dimensional Shading */}
        <path d="M26 44 L64 62 L64 65 L26 47 Z" fill="rgba(0,0,0,0.12)" />
        <path d="M64 62 L102 44 L102 47 L64 65 Z" fill="rgba(0,0,0,0.18)" />

        {/* Career Trajectory Silk Tassel */}
        <path
          d="M86 46 C94 52 97 62 96 74"
          fill="none"
          stroke="url(#piqEmblemGold)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="96" cy="77" r="4" fill="url(#piqEmblemGold)" />

        {/* Intelligence Sparkle Star */}
        <path
          d="M96 22 Q96 27 101 27 Q96 27 96 32 Q96 27 91 27 Q96 27 96 22 Z"
          fill="url(#piqEmblemGold)"
          filter="url(#piqEmblemGlow)"
        />
      </g>
    </svg>
  );
};

export default PlacementIQEmblem;
