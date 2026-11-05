import React from 'react';
import { Shield, Award, UserCheck } from 'lucide-react';

/**
 * Apple-Inspired Avatars & VisionOS Palettes
 */
export const APPLE_MEMOJIS = [
  { id: 'technologist', label: 'Tech Specialist', emoji: '👨‍💻', bg: 'linear-gradient(135deg, #0071e3 0%, #4f46e5 100%)', shadow: 'rgba(0, 113, 227, 0.4)' },
  { id: 'scholar', label: 'Campus Scholar', emoji: '🎓', bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', shadow: 'rgba(16, 185, 129, 0.4)' },
  { id: 'executive', label: 'Corporate Leader', emoji: '💼', bg: 'linear-gradient(135deg, #7c3aed 0%, #af52de 100%)', shadow: 'rgba(124, 58, 237, 0.4)' },
  { id: 'scientist', label: 'AI Visionary', emoji: '🧠', bg: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)', shadow: 'rgba(244, 63, 94, 0.4)' },
  { id: 'cyborg', label: 'Next-Gen Cyborg', emoji: '🤖', bg: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)', shadow: 'rgba(2, 132, 199, 0.4)' },
  { id: 'astronaut', label: 'Cosmic Pioneer', emoji: '🚀', bg: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)', shadow: 'rgba(59, 130, 246, 0.4)' },
  { id: 'creator', label: 'Design Creator', emoji: '🎨', bg: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', shadow: 'rgba(236, 72, 153, 0.4)' },
  { id: 'champion', label: 'Placement Ace', emoji: '🏆', bg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)', shadow: 'rgba(217, 119, 6, 0.4)' },
  { id: 'superstar', label: 'Campus Luminary', emoji: '⭐', bg: 'linear-gradient(135deg, #eab308 0%, #f97316 100%)', shadow: 'rgba(234, 179, 8, 0.4)' },
  { id: 'detective', label: 'Data Auditor', emoji: '🕵️', bg: 'linear-gradient(135deg, #334155 0%, #475569 100%)', shadow: 'rgba(71, 85, 105, 0.4)' },
  { id: 'analyst', label: 'Finance Analyst', emoji: '📊', bg: 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)', shadow: 'rgba(16, 185, 129, 0.4)' },
  { id: 'engineer', label: 'Systems Builder', emoji: '⚡', bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', shadow: 'rgba(99, 102, 241, 0.4)' }
];

export const APPLE_SYMBOLS = [
  { id: 'apple-gem', label: 'Sapphire Diamond', emoji: '💎', bg: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', shadow: 'rgba(14, 165, 233, 0.4)' },
  { id: 'apple-lion', label: 'Royal Lion', emoji: '🦁', bg: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', shadow: 'rgba(245, 158, 11, 0.4)' },
  { id: 'apple-eagle', label: 'Golden Eagle', emoji: '🦅', bg: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)', shadow: 'rgba(217, 119, 6, 0.4)' },
  { id: 'apple-fox', label: 'Swift Fox', emoji: '🦊', bg: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', shadow: 'rgba(234, 88, 12, 0.4)' },
  { id: 'apple-shield', label: 'Cyber Shield', emoji: '🛡️', bg: 'linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%)', shadow: 'rgba(139, 92, 246, 0.4)' },
  { id: 'apple-fire', label: 'Placement Flame', emoji: '🔥', bg: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', shadow: 'rgba(239, 68, 68, 0.4)' },
  { id: 'apple-lotus', label: 'Zen Lotus', emoji: '🪷', bg: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)', shadow: 'rgba(236, 72, 153, 0.4)' },
  { id: 'apple-globe', label: 'Global Explorer', emoji: '🌍', bg: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)', shadow: 'rgba(5, 150, 105, 0.4)' }
];

export const AVATAR_PALETTES = [
  { id: 'indigo', name: 'Electric Indigo', bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #af52de 100%)', shadow: 'rgba(124, 58, 237, 0.35)' },
  { id: 'sapphire', name: 'Apple Sapphire', bg: 'linear-gradient(135deg, #0071e3 0%, #0284c7 50%, #38bdf8 100%)', shadow: 'rgba(0, 113, 227, 0.35)' },
  { id: 'mint', name: 'Emerald Mint', bg: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)', shadow: 'rgba(16, 185, 129, 0.35)' },
  { id: 'coral', name: 'Sunset Coral', bg: 'linear-gradient(135deg, #f97316 0%, #fb7185 50%, #ec4899 100%)', shadow: 'rgba(249, 115, 22, 0.35)' },
  { id: 'fuchsia', name: 'Fuchsia Glow', bg: 'linear-gradient(135deg, #d946ef 0%, #a855f7 50%, #6366f1 100%)', shadow: 'rgba(217, 70, 239, 0.35)' },
  { id: 'titanium', name: 'Titanium Graphite', bg: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #64748b 100%)', shadow: 'rgba(51, 65, 85, 0.35)' },
  { id: 'ruby', name: 'Crimson Ruby', bg: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb923c 100%)', shadow: 'rgba(225, 29, 72, 0.35)' },
  { id: 'topaz', name: 'Golden Topaz', bg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)', shadow: 'rgba(217, 119, 6, 0.35)' },
  { id: 'pacific', name: 'Midnight Pacific', bg: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0284c7 100%)', shadow: 'rgba(2, 132, 199, 0.35)' },
  { id: 'rosegold', name: 'Rose Gold', bg: 'linear-gradient(135deg, #be185d 0%, #f43f5e 50%, #fda4af 100%)', shadow: 'rgba(244, 63, 94, 0.35)' },
  { id: 'aurora', name: 'Neon Aurora', bg: 'linear-gradient(135deg, #06b6d4 0%, #10b981 50%, #84cc16 100%)', shadow: 'rgba(16, 185, 129, 0.35)' },
  { id: 'deepviolet', name: 'Royal Violet', bg: 'linear-gradient(135deg, #6b21a8 0%, #9333ea 50%, #c084fc 100%)', shadow: 'rgba(147, 51, 234, 0.35)' }
];

/**
 * Extracts initials strictly following: First letter of first name + First letter of second name
 * e.g. "Elon Musk" -> "EM", "Elon Musk (Admin)" -> "EM"
 */
export function getUserInitials(user) {
  if (!user) return 'U';
  const fullName = (typeof user === 'object' ? user.full_name : '') || '';
  const username = (typeof user === 'object' ? user.username : user) || '';

  // Clean full name: strip bracketed tags like (Admin), [Officer], (Viewer)
  const cleanedName = String(fullName)
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .trim();

  if (cleanedName) {
    // Extract purely alphabetic words
    const words = cleanedName
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z]/g, ''))
      .filter(Boolean);

    if (words.length >= 2) {
      // First letter of first name + First letter of second name
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length >= 2) {
      return words[0].slice(0, 2).toUpperCase();
    } else if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
  }

  // Fallback to username
  const cleanUsername = String(username).replace(/[^a-zA-Z0-9._-]/g, '').trim();
  const uParts = cleanUsername.split(/[_.-]/).filter(Boolean);
  if (uParts.length >= 2) {
    return (uParts[0][0] + uParts[1][0]).toUpperCase();
  }
  if (cleanUsername.length >= 2) {
    return cleanUsername.slice(0, 2).toUpperCase();
  }
  return (cleanUsername[0] || 'U').toUpperCase();
}

/**
 * Resolves avatar palette either by explicit ID or deterministic username hash
 */
export function getAvatarTheme(username = '', paletteId = null) {
  if (paletteId) {
    const found = AVATAR_PALETTES.find((p) => p.id === paletteId);
    if (found) return found;
  }
  const safeUser = (username || 'user').toLowerCase().trim();
  let hash = 0;
  for (let i = 0; i < safeUser.length; i++) {
    hash = safeUser.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

export default function UserAvatar({
  user,
  size = 34,
  className = '',
  interactive = false,
  showRoleBadge = false,
  onClick
}) {
  const username = typeof user === 'object' ? user?.username : user;
  const role = typeof user === 'object' ? user?.role : 'viewer';
  const avatarType = typeof user === 'object' ? user?.avatar_type : 'monogram';
  const avatarValue = typeof user === 'object' ? user?.avatar_value : null;

  const initials = getUserInitials(user);

  // Check if Memoji or Symbol
  const memojiItem = (avatarType === 'memoji' && avatarValue)
    ? APPLE_MEMOJIS.find((m) => m.id === avatarValue)
    : null;

  const symbolItem = (avatarType === 'symbol' && avatarValue)
    ? APPLE_SYMBOLS.find((s) => s.id === avatarValue)
    : null;

  const activeTheme = getAvatarTheme(
    username,
    avatarType === 'gradient' || avatarType === 'monogram' ? avatarValue : null
  );

  const backgroundStyle = memojiItem?.bg || symbolItem?.bg || activeTheme.bg;
  const shadowStyle = memojiItem?.shadow || symbolItem?.shadow || activeTheme.shadow;

  const fontSize = Math.max(10, Math.round(size * 0.38));
  const emojiSize = Math.max(12, Math.round(size * 0.52));

  return (
    <div
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      title={interactive ? `Profile: @${username || 'user'}` : undefined}
      className={`relative shrink-0 select-none ${
        interactive
          ? 'cursor-pointer group focus:outline-hidden transform active:scale-95 hover:scale-105 transition-all duration-300'
          : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Squircle / Circle with Dynamic Gradient */}
      <div
        className="w-full h-full rounded-full flex items-center justify-center font-bold text-white tracking-wider relative overflow-hidden transition-all duration-300"
        style={{
          background: backgroundStyle,
          boxShadow: `0 4px 14px 0 ${shadowStyle}, inset 0 1px 1px 0 rgba(255, 255, 255, 0.45)`,
          fontSize: `${fontSize}px`
        }}
      >
        {/* Subtle Specular Sheen Arc */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 65%)'
          }}
        />

        {/* Content: Apple Memoji / Symbol OR Monogram Initials */}
        {memojiItem ? (
          <span
            className="relative z-10 leading-none filter drop-shadow-xs transform group-hover:scale-110 transition-transform select-none"
            style={{ fontSize: `${emojiSize}px` }}
          >
            {memojiItem.emoji}
          </span>
        ) : symbolItem ? (
          <span
            className="relative z-10 leading-none filter drop-shadow-xs transform group-hover:scale-110 transition-transform select-none"
            style={{ fontSize: `${emojiSize}px` }}
          >
            {symbolItem.emoji}
          </span>
        ) : (
          <span className="relative z-10 font-bold drop-shadow-xs tracking-wide">
            {initials}
          </span>
        )}
      </div>

      {/* Optional Mini Role Badge Pip */}
      {showRoleBadge && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#161618] flex items-center justify-center text-[7px] font-black ${
            role === 'admin'
              ? 'bg-[#af52de] text-white'
              : role === 'placement_officer'
              ? 'bg-[#0071e3] text-white'
              : 'bg-[#30d158] text-white'
          }`}
          title={`Role: ${role}`}
        >
          {role === 'admin' ? '★' : role === 'placement_officer' ? '✦' : '✓'}
        </span>
      )}
    </div>
  );
}
