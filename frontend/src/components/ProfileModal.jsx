import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  Mail,
  Lock,
  Shield,
  CheckCircle2,
  Calendar,
  Key,
  LogOut,
  Save,
  Sparkles,
  Info,
  Clock,
  Phone,
  Briefcase,
  Building2,
  FileText,
  BadgeCheck,
  Palette,
  Camera,
  Check
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import UserAvatar, {
  APPLE_MEMOJIS,
  APPLE_SYMBOLS,
  AVATAR_PALETTES,
  getAvatarTheme,
  getUserInitials
} from './UserAvatar';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, role, logout, showToast, updateUserProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'avatar' | 'security' | 'permissions'
  const [avatarCategory, setAvatarCategory] = useState('memoji'); // 'memoji' | 'symbols' | 'palettes'

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [designation, setDesignation] = useState(user?.designation || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarType, setAvatarType] = useState(user?.avatar_type || 'monogram');
  const [avatarValue, setAvatarValue] = useState(user?.avatar_value || 'indigo');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync state whenever user changes or modal opens
  useEffect(() => {
    if (user && isOpen) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setDepartment(user.department || '');
      setDesignation(user.designation || '');
      setBio(user.bio || '');
      setAvatarType(user.avatar_type || 'monogram');
      setAvatarValue(user.avatar_value || 'indigo');
    }
  }, [user, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Live avatar preview object
  const previewUser = {
    username: user?.username,
    full_name: fullName,
    role: user?.role,
    avatar_type: avatarType,
    avatar_value: avatarValue
  };

  const handleSaveDetails = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!fullName.trim()) {
      showToast('Full name cannot be empty', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        full_name: fullName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || '',
        department: department.trim() || '',
        designation: designation.trim() || '',
        bio: bio.trim() || '',
        avatar_type: avatarType,
        avatar_value: avatarValue
      };

      const res = await api.put('/auth/profile', payload);
      if (updateUserProfile) {
        updateUserProfile({
          full_name: res.data.full_name,
          email: res.data.email,
          phone: res.data.phone,
          department: res.data.department,
          designation: res.data.designation,
          bio: res.data.bio,
          avatar_type: res.data.avatar_type,
          avatar_value: res.data.avatar_value
        });
      }
      showToast('Profile information saved successfully', 'success');
      onClose();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password', 'warning');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setSaving(true);
    try {
      await api.put('/auth/profile', {
        current_password: currentPassword,
        new_password: newPassword
      });
      showToast('Password updated successfully! Keep it secure.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Password update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const roleDescriptions = {
    admin: {
      title: 'System Administrator',
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
      badge: 'Tier 1 Executive',
      capabilities: [
        'Full administrative authority across all campus modules',
        'Configure institutional CGPA eligibility cutoffs & rules',
        'Provision user credentials and manage RBAC roles',
        'Inspect recruitment inquiries & cryptographic audit logs'
      ]
    },
    placement_officer: {
      title: 'Placement Officer',
      color: 'text-[#0071e3] dark:text-[#2997ff] bg-blue-500/10 border-blue-500/20',
      badge: 'Operational Authority',
      capabilities: [
        'Schedule campus placement drives & vacancies',
        'Manage candidate application pipelines stage-by-stage',
        'Record student job offers, joining dates, and compensation',
        'Generate institutional NIRF/NAAC accredited reports'
      ]
    },
    viewer: {
      title: 'Institutional Viewer',
      color: 'text-[#34c759] bg-emerald-500/10 border-emerald-500/20',
      badge: 'Read-Only Member',
      capabilities: [
        'Real-time access to placement telemetry & dashboards',
        'Inspect department performance and branch compensation metrics',
        'Search and review student placement records',
        'Protected read-only access (no mutation privileges)'
      ]
    }
  };

  const currentRoleInfo = roleDescriptions[role] || roleDescriptions.viewer;

  // Render via React Portal to guarantee dead-center positioning in document.body
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md animate-fade-in font-sans"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl my-auto liquid-glass rounded-[32px] sm:rounded-[36px] shadow-[0_25px_70px_rgba(0,0,0,0.5)] border border-white/70 dark:border-white/15 overflow-hidden animate-modal-pop relative"
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-black/[0.06] dark:border-white/[0.08] relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            
            {/* Clickable Avatar with Camera / Edit Overlay */}
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('avatar')} title="Click to Change Avatar">
              <UserAvatar
                user={previewUser}
                size={66}
                showRoleBadge={true}
                className="shadow-xl"
              />
              <div className="absolute inset-0 rounded-full bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200">
                <Camera className="w-5 h-5 drop-shadow-sm" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {fullName || user?.username}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${currentRoleInfo.color}`}>
                  {currentRoleInfo.badge}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5 font-mono">
                <span>@{user?.username}</span>
                <span>•</span>
                <span>{email || user?.email}</span>
                {designation && <span>• {designation}</span>}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('avatar')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0071e3]/10 text-[#0071e3] dark:text-[#2997ff] hover:bg-[#0071e3]/20 transition-colors cursor-pointer"
                >
                  <Palette className="w-3 h-3" />
                  <span>Change Avatar</span>
                </button>
                <span className="flex items-center gap-1 text-[11px] text-[#34c759] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
                  <span>Active Session</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Apple Segmented Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-black/[0.04] dark:border-white/[0.06] bg-black/[0.01] dark:bg-white/[0.01]">
          <div className="inline-flex p-1 rounded-2xl bg-black/5 dark:bg-white/10 text-xs font-medium w-full">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'details'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs font-semibold'
                  : 'text-[#86868b] dark:text-[#a1a1a6]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile Details</span>
            </button>
            <button
              onClick={() => setActiveTab('avatar')}
              className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'avatar'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs font-semibold'
                  : 'text-[#86868b] dark:text-[#a1a1a6]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#af52de]" />
              <span>Avatar Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'security'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs font-semibold'
                  : 'text-[#86868b] dark:text-[#a1a1a6]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Password & Security</span>
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'permissions'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs font-semibold'
                  : 'text-[#86868b] dark:text-[#a1a1a6]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Permissions</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto">
          
          {/* =========================================================================
              TAB 1: EDITABLE PROFILE DETAILS
          ========================================================================== */}
          {activeTab === 'details' && (
            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                    Display Full Name <span className="text-[#ff3b30]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Elon Musk"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
                    />
                  </div>
                  <span className="text-[10px] text-[#86868b] mt-1 block">
                    Monogram avatar will display: <strong className="text-[#0071e3] font-mono">{getUserInitials({ full_name: fullName, username: user?.username })}</strong>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                    Official Email Address <span className="text-[#ff3b30]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="e.g. elon@placementiq.edu"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 (080) 1234-5678"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                    Department / Academic Unit
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Training & Placement Directorate"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                  Designation / Role Title
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Chief Placement Officer / Administrator"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                  Bio / Profile Summary
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief description about your campus recruitment responsibilities..."
                    className="w-full px-4 py-2.5 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  />
                </div>
              </div>

              {/* Avatar Studio Quick Jump Row */}
              <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserAvatar user={previewUser} size={40} />
                  <div>
                    <span className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                      Avatar Style
                    </span>
                    <div className="text-[11px] text-[#86868b] dark:text-[#a1a1a6]">
                      {avatarType === 'memoji'
                        ? 'Apple Memoji Character'
                        : avatarType === 'symbol'
                        ? 'Apple Classic Symbol'
                        : 'VisionOS Monogram Gradient'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('avatar')}
                  className="apple-btn-secondary px-3.5 py-1.5 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#af52de]" />
                  <span>Customize Avatar</span>
                </button>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="apple-btn-secondary px-4 py-2 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="apple-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer flex items-center gap-2 shadow-md"
                >
                  {saving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              TAB 2: AVATAR STUDIO (Apple Memoji, Symbols & VisionOS Gradients)
          ========================================================================== */}
          {activeTab === 'avatar' && (
            <div className="space-y-5">
              
              {/* Category Selector Sub-tabs */}
              <div className="flex items-center gap-2 pb-1 border-b border-black/[0.04] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setAvatarCategory('memoji')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    avatarCategory === 'memoji'
                      ? 'bg-[#0071e3] text-white shadow-xs'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  Apple Memoji
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarCategory('symbols')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    avatarCategory === 'symbols'
                      ? 'bg-[#0071e3] text-white shadow-xs'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  Apple Symbols
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarCategory('palettes')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    avatarCategory === 'palettes'
                      ? 'bg-[#0071e3] text-white shadow-xs'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  Monogram Gradients
                </button>
              </div>

              {/* Category 1: Apple Memoji */}
              {avatarCategory === 'memoji' && (
                <div className="space-y-3">
                  <div className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                    Select an official Apple Memoji character for your PlacementIQ profile:
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {APPLE_MEMOJIS.map((m) => {
                      const isSelected = avatarType === 'memoji' && avatarValue === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setAvatarType('memoji');
                            setAvatarValue(m.id);
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 group relative ${
                            isSelected
                              ? 'bg-blue-500/10 border-[#0071e3] ring-2 ring-[#0071e3]/30 shadow-md'
                              : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20'
                          }`}
                        >
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm relative overflow-hidden transition-transform group-hover:scale-105"
                            style={{ background: m.bg }}
                          >
                            <span className="relative z-10 leading-none select-none">{m.emoji}</span>
                            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-full" />
                          </div>

                          <div className="text-center">
                            <div className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight">
                              {m.label}
                            </div>
                            <div className="text-[10px] text-[#86868b] truncate max-w-[85px]">
                              {m.desc}
                            </div>
                          </div>

                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-[10px]">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category 2: Apple Classic Symbols */}
              {avatarCategory === 'symbols' && (
                <div className="space-y-3">
                  <div className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                    Select a classic Apple icon badge for your institutional presence:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {APPLE_SYMBOLS.map((s) => {
                      const isSelected = avatarType === 'symbol' && avatarValue === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setAvatarType('symbol');
                            setAvatarValue(s.id);
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 group relative ${
                            isSelected
                              ? 'bg-blue-500/10 border-[#0071e3] ring-2 ring-[#0071e3]/30 shadow-md'
                              : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20'
                          }`}
                        >
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm relative overflow-hidden transition-transform group-hover:scale-105"
                            style={{ background: s.bg }}
                          >
                            <span className="relative z-10 leading-none select-none">{s.emoji}</span>
                            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-full" />
                          </div>

                          <div className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7] text-center">
                            {s.label}
                          </div>

                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-[10px]">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category 3: Monogram Gradients */}
              {avatarCategory === 'palettes' && (
                <div className="space-y-3">
                  <div className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                    Choose a VisionOS liquid gradient for your initial monogram:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {AVATAR_PALETTES.map((p) => {
                      const isSelected = (avatarType === 'monogram' || avatarType === 'gradient') && avatarValue === p.id;
                      const currentInitials = getUserInitials({ full_name: fullName, username: user?.username });
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setAvatarType('monogram');
                            setAvatarValue(p.id);
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 group relative ${
                            isSelected
                              ? 'bg-blue-500/10 border-[#0071e3] ring-2 ring-[#0071e3]/30 shadow-md'
                              : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20'
                          }`}
                        >
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm relative overflow-hidden transition-transform group-hover:scale-105"
                            style={{ background: p.bg }}
                          >
                            <span className="relative z-10 select-none font-bold drop-shadow-xs">{currentInitials}</span>
                            <div className="absolute inset-0 bg-gradient-to-b from-white/35 to-transparent pointer-events-none rounded-full" />
                          </div>

                          <div className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7] text-center">
                            {p.name}
                          </div>

                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-[10px]">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="apple-btn-secondary px-4 py-2 text-xs font-medium cursor-pointer"
                >
                  Back to Profile
                </button>

                <button
                  type="button"
                  onClick={handleSaveDetails}
                  disabled={saving}
                  className="apple-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer flex items-center gap-2 shadow-md"
                >
                  {saving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Apply & Save Avatar</span>
                </button>
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 3: PASSWORD & SECURITY
          ========================================================================== */}
          {activeTab === 'security' && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-[#0071e3] dark:text-[#2997ff] flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Passwords are encrypted on the server using industry-standard bcrypt hashing. Please choose a strong password.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="apple-btn-secondary px-4 py-2 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="apple-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer flex items-center gap-2 shadow-md"
                >
                  {saving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              TAB 4: ROLE PERMISSIONS
          ========================================================================== */}
          {activeTab === 'permissions' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {currentRoleInfo.title}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${currentRoleInfo.color}`}>
                    Active Level
                  </span>
                </div>
                <p className="text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
                  Your account is assigned to the institutional <strong className="text-[#1d1d1f] dark:text-[#f5f5f7]">{role}</strong> security scope.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
                  Authorized Capabilities
                </span>
                <div className="space-y-2">
                  {currentRoleInfo.capabilities.map((cap, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#34c759] shrink-0" />
                      <span className="text-[#1d1d1f] dark:text-[#f5f5f7] font-medium leading-snug">
                        {cap}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[#86868b]">
                <span>Session Expiration: 24h Sliding Window</span>
                <span className="font-mono text-[11px] text-[#0071e3] dark:text-[#2997ff]">JWT HS256 Encrypted</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Dock */}
        <div className="p-4 sm:p-5 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="px-3.5 py-2 text-xs font-semibold text-[#ff3b30] hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Account</span>
          </button>

          <button
            onClick={onClose}
            className="apple-btn-secondary px-4 py-2 text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
