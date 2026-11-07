import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

/**
 * Local verified high-definition vector assets for top campus recruiters.
 * Completely immune to external 403 Forbidden / CORS / hotlinking blocks.
 */
export const LOCAL_BRAND_ASSETS = {
  google: '/logos/google.svg',
  microsoft: '/logos/microsoft.svg',
  amazon: '/logos/amazon.svg',
  tcs: '/logos/tcs.svg',
  infosys: '/logos/infosys.svg',
  ti: '/logos/ti.svg',
  deloitte: '/logos/deloitte.svg',
  lnt: '/logos/lnt.svg',
  mahindra: '/logos/mahindra.svg',
  accenture: '/logos/accenture.svg',
  cisco: '/logos/cisco.svg',
  ibm: '/logos/ibm.svg',
  intel: '/logos/intel.svg',
  wipro: '/logos/wipro.svg',
  oracle: '/logos/oracle.svg'
};

/**
 * Curated Brand Vectors for Campus Recruiters
 * Google uses the full official 6-letter colored wordmark (never a single "G").
 */
export const CURATED_BRAND_LOGOS = {
  google: {
    name: 'Google',
    render: () => (
      <svg viewBox="0 0 272 92" className="w-full h-full object-contain pointer-events-none select-none">
        <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
        <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
        <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" />
        <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" />
        <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" />
        <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" />
      </svg>
    )
  },
  microsoft: {
    name: 'Microsoft',
    render: () => (
      <svg viewBox="0 0 170 48" className="w-full h-full object-contain pointer-events-none p-0.5 select-none">
        <rect x="6" y="9" width="13.5" height="13.5" fill="#F25022"/>
        <rect x="22.5" y="9" width="13.5" height="13.5" fill="#7FBA00"/>
        <rect x="6" y="25.5" width="13.5" height="13.5" fill="#00A4EF"/>
        <rect x="22.5" y="25.5" width="13.5" height="13.5" fill="#FFB900"/>
        <text x="44" y="32" fill="#5E5E5E" fontSize="21" fontWeight="600" fontFamily="Segoe UI, -apple-system, system-ui, sans-serif" letterSpacing="-0.3">Microsoft</text>
      </svg>
    )
  },
  amazon: {
    name: 'Amazon',
    render: () => (
      <svg viewBox="0 0 160 52" className="w-full h-full object-contain pointer-events-none p-0.5 select-none">
        <text x="80" y="30" fill="#111111" fontSize="24" fontWeight="bold" fontFamily="Arial, Helvetica, sans-serif" textAnchor="middle" letterSpacing="-0.5">amazon</text>
        <path d="M 45 36 C 65 47, 95 47, 115 36" fill="none" stroke="#FF9900" strokeWidth="2.8" strokeLinecap="round"/>
        <path d="M 113 33 L 119 37 L 115 41 Z" fill="#FF9900"/>
      </svg>
    )
  },
  tcs: {
    name: 'TCS',
    render: () => (
      <svg viewBox="0 0 190 56" className="w-full h-full object-contain pointer-events-none select-none">
        <rect width="190" height="56" rx="10" fill="#0b1b3d"/>
        <text x="95" y="33" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" letterSpacing="3">TCS</text>
        <text x="95" y="48" fill="#38bdf8" fontSize="8" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" letterSpacing="1.2">TATA CONSULTANCY SERVICES</text>
      </svg>
    )
  },
  infosys: {
    name: 'Infosys',
    render: () => (
      <svg viewBox="0 0 150 48" className="w-full h-full object-contain pointer-events-none select-none">
        <text x="75" y="33" fill="#007CC3" fontSize="28" fontWeight="900" fontFamily="Arial, Helvetica, sans-serif" textAnchor="middle" letterSpacing="-0.5">Infosys</text>
      </svg>
    )
  },
  ti: {
    name: 'Texas Instruments',
    render: () => (
      <svg viewBox="0 0 180 52" className="w-full h-full object-contain pointer-events-none select-none">
        <rect width="180" height="52" rx="10" fill="#CC0000"/>
        <path d="M18 15h19v5.5h-6.5v16h-6v-16H18z" fill="#FFFFFF"/>
        <path d="M42 15h6v21.5h-6z" fill="#FFFFFF"/>
        <text x="58" y="28" fill="#FFFFFF" fontSize="10.5" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">TEXAS</text>
        <text x="58" y="41" fill="#FFFFFF" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="0.5">INSTRUMENTS</text>
      </svg>
    )
  },
  deloitte: {
    name: 'Deloitte',
    render: () => (
      <svg viewBox="0 0 170 48" className="w-full h-full object-contain pointer-events-none p-0.5 select-none">
        <text x="4" y="35" fill="#000000" fontSize="36" fontWeight="900" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="-1">Deloitte</text>
        <circle cx="152" cy="33" r="5.5" fill="#86BC25"/>
      </svg>
    )
  },
  lnt: {
    name: 'Larsen & Toubro',
    render: () => (
      <svg viewBox="0 0 170 52" className="w-full h-full object-contain pointer-events-none select-none">
        <rect width="170" height="52" rx="10" fill="#004b87"/>
        <circle cx="32" cy="26" r="17" fill="none" stroke="#FFFFFF" strokeWidth="2.5"/>
        <text x="32" y="32" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="1">L&amp;T</text>
        <text x="60" y="25" fill="#FFFFFF" fontSize="10" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.8">LARSEN &amp; TOUBRO</text>
        <text x="60" y="39" fill="#93c5fd" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="0.5">TECH SERVICES</text>
      </svg>
    )
  },
  mahindra: {
    name: 'Mahindra',
    render: () => (
      <svg viewBox="0 0 170 50" className="w-full h-full object-contain pointer-events-none select-none">
        <path d="M18 35L29 14L40 35L33 35L29 24L25 35Z" fill="#D91624"/>
        <path d="M33 35L44 14L55 35L48 35L44 24L40 35Z" fill="#D91624"/>
        <text x="64" y="32" fill="#D91624" fontSize="20" fontWeight="900" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="1">Mahindra</text>
      </svg>
    )
  },
  accenture: {
    name: 'Accenture',
    render: () => (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-xl p-1 select-none">
        <span className="text-[#A100FF] font-black text-base tracking-tight">&gt;</span>
        <span className="text-black font-extrabold text-xs ml-0.5 tracking-tight">accenture</span>
      </div>
    )
  },
  cisco: {
    name: 'Cisco',
    render: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#005073] rounded-xl p-1 text-white font-black text-xs select-none">
        CISCO
      </div>
    )
  },
  ibm: {
    name: 'IBM',
    render: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#1F70C1] rounded-xl p-1 text-white font-black font-mono text-sm tracking-wider select-none">
        IBM
      </div>
    )
  },
  intel: {
    name: 'Intel',
    render: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#0068B5] rounded-xl p-1 text-white font-extrabold text-xs select-none">
        intel
      </div>
    )
  },
  wipro: {
    name: 'Wipro',
    render: () => (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-xl p-1 select-none">
        <span className="text-[#0072bc] font-bold text-xs">wipro</span>
      </div>
    )
  },
  oracle: {
    name: 'Oracle',
    render: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#F80000] rounded-xl p-1 select-none">
        <span className="text-white font-black text-xs tracking-wider">ORACLE</span>
      </div>
    )
  }
};

/**
 * Curated Quick Presets for Adding/Registering Popular Campus Recruiters
 * Uses local fast-loading vector assets.
 */
export const POPULAR_COMPANY_PRESETS = [
  {
    name: 'Google India',
    industry: 'Internet & Cloud',
    website: 'https://careers.google.com',
    logo_url: '/logos/google.svg'
  },
  {
    name: 'Microsoft India',
    industry: 'Software & AI',
    website: 'https://careers.microsoft.com',
    logo_url: '/logos/microsoft.svg'
  },
  {
    name: 'Amazon',
    industry: 'E-Commerce & Cloud',
    website: 'https://amazon.jobs',
    logo_url: '/logos/amazon.svg'
  },
  {
    name: 'Tata Consultancy Services (TCS)',
    industry: 'IT Services & Consulting',
    website: 'https://www.tcs.com',
    logo_url: '/logos/tcs.svg'
  },
  {
    name: 'Infosys',
    industry: 'IT Services',
    website: 'https://www.infosys.com',
    logo_url: '/logos/infosys.svg'
  },
  {
    name: 'Deloitte USI',
    industry: 'Consulting & Technology',
    website: 'https://www2.deloitte.com',
    logo_url: '/logos/deloitte.svg'
  },
  {
    name: 'Texas Instruments',
    industry: 'Semiconductors & Electronics',
    website: 'https://www.ti.com',
    logo_url: '/logos/ti.svg'
  },
  {
    name: 'L&T Technology Services',
    industry: 'Engineering R&D',
    website: 'https://www.ltts.com',
    logo_url: '/logos/lnt.svg'
  },
  {
    name: 'Mahindra & Mahindra',
    industry: 'Automotive & Manufacturing',
    website: 'https://www.mahindra.com',
    logo_url: '/logos/mahindra.svg'
  }
];

/**
 * Palette gradients for initial badges
 */
const INITIAL_GRADIENTS = [
  'linear-gradient(135deg, #0071e3 0%, #4f46e5 100%)',
  'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #af52de 100%)',
  'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
  'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
  'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
  'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)'
];

/**
 * Extracts compact, professional monogram initials for a company
 */
export function getCompanyInitials(name = '') {
  if (!name) return 'CO';
  
  const parenMatch = name.match(/\(([^)]+)\)/);
  if (parenMatch && parenMatch[1] && parenMatch[1].length <= 4) {
    return parenMatch[1].trim();
  }

  const clean = name.replace(/India|Private|Limited|Ltd|Corporation|Corp|Pvt/gi, '').trim();
  const words = clean.split(/[\s\-&]+/).filter(Boolean);
  
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Identifies if the company matches a curated brand key
 */
function findCuratedBrand(name = '', website = '') {
  const norm = (name + ' ' + website).toLowerCase();
  if (norm.includes('google')) return 'google';
  if (norm.includes('microsoft')) return 'microsoft';
  if (norm.includes('amazon')) return 'amazon';
  if (norm.includes('tcs') || norm.includes('tata consultancy')) return 'tcs';
  if (norm.includes('infosys')) return 'infosys';
  if (norm.includes('texas instrument') || norm.includes('ti.com')) return 'ti';
  if (norm.includes('deloitte')) return 'deloitte';
  if (norm.includes('l&t') || norm.includes('larsen & toubro') || norm.includes('ltts')) return 'lnt';
  if (norm.includes('mahindra')) return 'mahindra';
  if (norm.includes('accenture')) return 'accenture';
  if (norm.includes('cisco')) return 'cisco';
  if (norm.includes('ibm')) return 'ibm';
  if (norm.includes('intel')) return 'intel';
  if (norm.includes('wipro')) return 'wipro';
  if (norm.includes('oracle')) return 'oracle';
  return null;
}

/**
 * Helper to derive favicon domain URL as a secondary fallback
 */
function getFaviconUrl(website = '') {
  if (!website) return null;
  try {
    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
    const host = url.hostname.replace(/^www\./, '');
    if (host && host.includes('.')) {
      return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * CompanyLogo Component
 * Renders official brand logo with priority on full official logos (never a single "G" for Google)
 */
function CompanyLogo({
  company,
  name,
  logoUrl,
  website,
  size = 48,
  width,
  height,
  variant = 'square',
  className = '',
  rounded,
  showInitialFallback = true
}) {
  const compName = (typeof company === 'object' ? company?.name : company) || name || '';
  let initialUrl = (typeof company === 'object' ? (company?.logo_url || company?.logoUrl) : null) || logoUrl || null;
  const compWebsite = (typeof company === 'object' ? company?.website : null) || website || '';

  const curatedKey = findCuratedBrand(compName, compWebsite);
  const curatedBrand = curatedKey ? CURATED_BRAND_LOGOS[curatedKey] : null;

  // For known campus recruiters, ALWAYS prioritize the official local vector asset
  if (curatedKey && LOCAL_BRAND_ASSETS[curatedKey]) {
    initialUrl = LOCAL_BRAND_ASSETS[curatedKey];
  }

  const [currentSrc, setCurrentSrc] = useState(initialUrl);
  const [loadFailed, setLoadFailed] = useState(false);
  const [attemptedFavicon, setAttemptedFavicon] = useState(false);

  useEffect(() => {
    let resolved = initialUrl;
    if (curatedKey && LOCAL_BRAND_ASSETS[curatedKey]) {
      resolved = LOCAL_BRAND_ASSETS[curatedKey];
    }
    setCurrentSrc(resolved);
    setLoadFailed(false);
    setAttemptedFavicon(false);
  }, [initialUrl, compName, curatedKey]);

  const initials = getCompanyInitials(compName);
  const charSum = compName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradient = INITIAL_GRADIENTS[charSum % INITIAL_GRADIENTS.length];

  const handleImageError = () => {
    // If the image failed and we have a curated brand, use the curated brand vector directly
    if (curatedBrand) {
      setLoadFailed(true);
      return;
    }
    const favicon = getFaviconUrl(compWebsite);
    if (favicon && currentSrc !== favicon && !attemptedFavicon) {
      setAttemptedFavicon(true);
      setCurrentSrc(favicon);
    } else {
      setLoadFailed(true);
    }
  };

  const isWide = variant === 'wide';
  const effectiveWidth = width || (isWide ? Math.max(size * 2.2, 110) : size);
  const effectiveHeight = height || (isWide ? Math.max(size * 0.9, 44) : size);
  const resolvedRounded = rounded || (isWide ? 'rounded-xl' : 'rounded-2xl');

  const containerStyle = {
    width: typeof effectiveWidth === 'number' ? `${effectiveWidth}px` : effectiveWidth,
    height: typeof effectiveHeight === 'number' ? `${effectiveHeight}px` : effectiveHeight,
    minWidth: typeof effectiveWidth === 'number' ? `${effectiveWidth}px` : effectiveWidth,
    minHeight: typeof effectiveHeight === 'number' ? `${effectiveHeight}px` : effectiveHeight
  };

  // Base brand badge styling: ALWAYS pure crisp white background with subtle border and shadow
  // to ensure brand colors & dark text (Amazon, Deloitte, Microsoft) pop with 100% contrast in both light & dark modes
  const badgePadding = isWide ? 'px-2 py-1' : 'p-1.5';
  const badgeClasses = `${resolvedRounded} bg-white text-slate-900 border border-slate-200/90 dark:border-white/20 ${badgePadding} flex items-center justify-center overflow-hidden shadow-xs shrink-0 select-none transition-transform hover:scale-105 ${className}`;

  // 1. Render image URL (e.g. /logos/google.svg, /logos/microsoft.svg, or custom URL)
  if (currentSrc && !loadFailed) {
    return (
      <div
        style={containerStyle}
        className={badgeClasses}
        title={compName}
      >
        <img
          src={currentSrc}
          alt={`${compName} logo`}
          onError={handleImageError}
          className="w-full h-full object-contain pointer-events-none"
          loading="lazy"
        />
      </div>
    );
  }

  // 2. If no image URL or image failed, render curated brand vector (e.g. full Google wordmark)
  if (curatedBrand) {
    return (
      <div
        style={containerStyle}
        className={badgeClasses}
        title={curatedBrand.name}
      >
        {curatedBrand.render()}
      </div>
    );
  }

  // 3. Try domain favicon directly if website exists
  const favicon = getFaviconUrl(compWebsite);
  if (favicon && !attemptedFavicon && !loadFailed) {
    return (
      <div
        style={containerStyle}
        className={badgeClasses}
        title={compName}
      >
        <img
          src={favicon}
          alt={`${compName} logo`}
          onError={() => setLoadFailed(true)}
          className="w-full h-full object-contain pointer-events-none"
          loading="lazy"
        />
      </div>
    );
  }

  // 4. Fallback Monogram Badge with Vibrant Gradient for unknown brands
  if (showInitialFallback) {
    const fontSize = size >= 56 ? 'text-lg font-black' : size >= 44 ? 'text-sm font-bold' : 'text-xs font-bold';
    return (
      <div
        style={{ ...containerStyle, background: gradient }}
        className={`${resolvedRounded} flex items-center justify-center text-white ${fontSize} shadow-xs border border-white/20 shrink-0 select-none transition-transform hover:scale-105 ${className}`}
        title={compName}
      >
        <span className="tracking-tight drop-shadow-xs">{initials}</span>
      </div>
    );
  }

  return (
    <div
      style={containerStyle}
      className={`${resolvedRounded} bg-white text-slate-500 border border-slate-200/90 dark:border-white/20 flex items-center justify-center shrink-0 select-none ${className}`}
    >
      <Building2 className="w-1/2 h-1/2" />
    </div>
  );
}

export default React.memo(CompanyLogo);
