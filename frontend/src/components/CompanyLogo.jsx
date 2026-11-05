import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

/**
 * Curated High-Definition Brand Vectors for Top Campus Recruiters
 * Ensures 100% reliable, zero-latency rendering even offline.
 */
export const CURATED_BRAND_LOGOS = {
  google: {
    name: 'Google',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
      </svg>
    )
  },
  microsoft: {
    name: 'Microsoft',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <path fill="#f25022" d="M4 4h18v18H4z" />
        <path fill="#7fba00" d="M26 4h18v18H26z" />
        <path fill="#00a4ef" d="M4 26h18v18H4z" />
        <path fill="#ffb900" d="M26 26h18v18H26z" />
      </svg>
    )
  },
  amazon: {
    name: 'Amazon',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <rect width="48" height="48" rx="10" fill="#232F3E" />
        <text x="24" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif">a</text>
        <path d="M12 32c6 5 18 5 24 0" fill="none" stroke="#FF9900" strokeWidth="3" strokeLinecap="round" />
        <path d="M36 30l2 2l-3 1z" fill="#FF9900" />
      </svg>
    )
  },
  tcs: {
    name: 'TCS',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <defs>
          <linearGradient id="tcsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00529b" />
            <stop offset="100%" stopColor="#e31837" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="10" fill="url(#tcsGrad)" />
        <text x="24" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">TCS</text>
      </svg>
    )
  },
  infosys: {
    name: 'Infosys',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <rect width="48" height="48" rx="10" fill="#007cc3" />
        <text x="24" y="31" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="0.5">Infosys</text>
      </svg>
    )
  },
  ti: {
    name: 'Texas Instruments',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <rect width="48" height="48" rx="10" fill="#CC0000" />
        <text x="24" y="31" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">TI</text>
      </svg>
    )
  },
  deloitte: {
    name: 'Deloitte',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <rect width="48" height="48" rx="10" fill="#000000" />
        <text x="21" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800" fontFamily="system-ui, sans-serif">D</text>
        <circle cx="34" cy="28" r="3" fill="#86BC25" />
      </svg>
    )
  },
  lnt: {
    name: 'Larsen & Toubro',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <rect width="48" height="48" rx="10" fill="#004b87" />
        <text x="24" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="system-ui, sans-serif">L&T</text>
      </svg>
    )
  },
  mahindra: {
    name: 'Mahindra',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <rect width="48" height="48" rx="10" fill="#D91624" />
        <text x="24" y="31" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="900" fontFamily="system-ui, sans-serif">M</text>
      </svg>
    )
  },
  accenture: {
    name: 'Accenture',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <rect width="48" height="48" rx="10" fill="#000000" />
        <text x="20" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif">&gt;</text>
        <circle cx="33" cy="20" r="3" fill="#A100FF" />
      </svg>
    )
  },
  cisco: {
    name: 'Cisco',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <rect width="48" height="48" rx="10" fill="#005073" />
        <g fill="#00bceb">
          <rect x="12" y="24" width="3" height="8" rx="1" />
          <rect x="18" y="18" width="3" height="14" rx="1" />
          <rect x="24" y="14" width="3" height="18" rx="1" />
          <rect x="30" y="18" width="3" height="14" rx="1" />
          <rect x="36" y="24" width="3" height="8" rx="1" />
        </g>
      </svg>
    )
  },
  ibm: {
    name: 'IBM',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <rect width="48" height="48" rx="10" fill="#1F70C1" />
        <text x="24" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="900" fontFamily="monospace" letterSpacing="1">IBM</text>
      </svg>
    )
  },
  intel: {
    name: 'Intel',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <rect width="48" height="48" rx="10" fill="#0068B5" />
        <text x="24" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800" fontFamily="system-ui, sans-serif">intel</text>
      </svg>
    )
  },
  wipro: {
    name: 'Wipro',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <rect width="48" height="48" rx="10" fill="#FFFFFF" />
        <circle cx="18" cy="24" r="5" fill="#f8971d" />
        <circle cx="24" cy="24" r="5" fill="#178844" />
        <circle cx="30" cy="24" r="5" fill="#0072bc" />
      </svg>
    )
  },
  oracle: {
    name: 'Oracle',
    render: (size = 32) => (
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <rect width="48" height="48" rx="10" fill="#F80000" />
        <ellipse cx="24" cy="24" rx="12" ry="7" fill="none" stroke="#FFFFFF" strokeWidth="4" />
      </svg>
    )
  }
};

/**
 * Curated Quick Presets for Adding/Registering Popular Campus Recruiters
 */
export const POPULAR_COMPANY_PRESETS = [
  {
    name: 'Google India',
    industry: 'Internet & Cloud',
    website: 'https://careers.google.com',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
  },
  {
    name: 'Microsoft India',
    industry: 'Software & AI',
    website: 'https://careers.microsoft.com',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'
  },
  {
    name: 'Amazon',
    industry: 'E-Commerce & Cloud',
    website: 'https://amazon.jobs',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
  },
  {
    name: 'Tata Consultancy Services (TCS)',
    industry: 'IT Services & Consulting',
    website: 'https://www.tcs.com',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg'
  },
  {
    name: 'Infosys',
    industry: 'IT Services',
    website: 'https://www.infosys.com',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg'
  },
  {
    name: 'Deloitte USI',
    industry: 'Consulting & Technology',
    website: 'https://www2.deloitte.com',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg'
  },
  {
    name: 'Texas Instruments',
    industry: 'Semiconductors & Electronics',
    website: 'https://www.ti.com',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Texas_Instruments_logo.svg'
  },
  {
    name: 'L&T Technology Services',
    industry: 'Engineering R&D',
    website: 'https://www.ltts.com',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/L%26T.png'
  },
  {
    name: 'Accenture',
    industry: 'IT & Consulting',
    website: 'https://www.accenture.com',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg'
  },
  {
    name: 'Wipro',
    industry: 'IT Services',
    website: 'https://www.wipro.com',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg'
  },
  {
    name: 'Cisco Systems',
    industry: 'Networking & Cybersecurity',
    website: 'https://www.cisco.com',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg'
  },
  {
    name: 'IBM',
    industry: 'Cloud & Cognitive Software',
    website: 'https://www.ibm.com',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg'
  }
];

/**
 * Palette gradients for beautiful initial badges
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
 * e.g. "Tata Consultancy Services (TCS)" -> "TCS"
 * "Google India" -> "G"
 * "Texas Instruments" -> "TI"
 * "L&T Construction" -> "L&T"
 */
export function getCompanyInitials(name = '') {
  if (!name) return 'CO';
  
  // Check for acronyms in parentheses e.g. (TCS), (L&T)
  const parenMatch = name.match(/\(([^)]+)\)/);
  if (parenMatch && parenMatch[1] && parenMatch[1].length <= 4) {
    return parenMatch[1].trim();
  }

  // Common acronym checks
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
 * Renders official brand logo with multi-stage graceful fallback:
 * 1. Custom/Stored Logo URL (`company.logo_url` or `logoUrl`)
 * 2. Curated crisp Vector SVG if recruiter is recognized
 * 3. Domain favicon if website is present
 * 4. High-contrast typography Monogram tile
 */
export default function CompanyLogo({
  company,
  name,
  logoUrl,
  website,
  size = 48,
  className = '',
  rounded = 'rounded-2xl',
  showInitialFallback = true
}) {
  // Normalize inputs
  const compName = (typeof company === 'object' ? company?.name : company) || name || '';
  const initialUrl = (typeof company === 'object' ? (company?.logo_url || company?.logoUrl) : null) || logoUrl || null;
  const compWebsite = (typeof company === 'object' ? company?.website : null) || website || '';

  const [currentSrc, setCurrentSrc] = useState(initialUrl);
  const [loadFailed, setLoadFailed] = useState(false);
  const [attemptedFavicon, setAttemptedFavicon] = useState(false);

  // Sync state if initialUrl changes
  useEffect(() => {
    setCurrentSrc(initialUrl);
    setLoadFailed(false);
    setAttemptedFavicon(false);
  }, [initialUrl, compName]);

  const curatedKey = findCuratedBrand(compName, compWebsite);
  const curatedBrand = curatedKey ? CURATED_BRAND_LOGOS[curatedKey] : null;

  // Compute monogram and gradient index
  const initials = getCompanyInitials(compName);
  const charSum = compName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradient = INITIAL_GRADIENTS[charSum % INITIAL_GRADIENTS.length];

  const handleImageError = () => {
    // If the primary image failed and we haven't tried the domain favicon yet
    const favicon = getFaviconUrl(compWebsite);
    if (favicon && currentSrc !== favicon && !attemptedFavicon) {
      setAttemptedFavicon(true);
      setCurrentSrc(favicon);
    } else {
      setLoadFailed(true);
    }
  };

  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`
  };

  // 1. Try rendering primary/favicon image if URL is present and has not failed
  if (currentSrc && !loadFailed) {
    return (
      <div
        style={containerStyle}
        className={`${rounded} bg-white dark:bg-slate-800/90 border border-black/[0.08] dark:border-white/[0.12] p-1.5 flex items-center justify-center overflow-hidden shadow-xs shrink-0 select-none transition-transform hover:scale-105 ${className}`}
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

  // 2. If no image URL or image failed, but company matches a curated brand
  if (curatedBrand) {
    return (
      <div
        style={containerStyle}
        className={`${rounded} bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.12] p-1.5 flex items-center justify-center overflow-hidden shadow-xs shrink-0 select-none transition-transform hover:scale-105 ${className}`}
        title={curatedBrand.name}
      >
        {curatedBrand.render(Math.round(size * 0.72))}
      </div>
    );
  }

  // 3. Try domain favicon directly if website exists
  const favicon = getFaviconUrl(compWebsite);
  if (favicon && !attemptedFavicon && !loadFailed) {
    return (
      <div
        style={containerStyle}
        className={`${rounded} bg-white dark:bg-slate-800/90 border border-black/[0.08] dark:border-white/[0.12] p-1.5 flex items-center justify-center overflow-hidden shadow-xs shrink-0 select-none transition-transform hover:scale-105 ${className}`}
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

  // 4. Fallback Monogram Badge with Vibrant Gradient
  if (showInitialFallback) {
    const fontSize = size >= 56 ? 'text-lg font-black' : size >= 44 ? 'text-sm font-bold' : 'text-xs font-bold';
    return (
      <div
        style={{ ...containerStyle, background: gradient }}
        className={`${rounded} flex items-center justify-center text-white ${fontSize} shadow-xs border border-white/20 shrink-0 select-none transition-transform hover:scale-105 ${className}`}
        title={compName}
      >
        <span className="tracking-tight drop-shadow-xs">{initials}</span>
      </div>
    );
  }

  // 5. Minimal generic icon fallback
  return (
    <div
      style={containerStyle}
      className={`${rounded} bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 shrink-0 select-none ${className}`}
    >
      <Building2 className="w-1/2 h-1/2" />
    </div>
  );
}
