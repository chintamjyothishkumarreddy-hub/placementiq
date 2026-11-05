import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Trash2,
  Mail,
  Phone,
  User,
  RefreshCw,
  Sparkles,
  Shield,
  Tag,
  ChevronRight,
  X,
  Send,
  Calendar,
  CheckCircle,
  FileText
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

export default function EnquiriesPage() {
  const { user: currentUser, role, showToast } = useAuth();

  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Inspection / Solving Modal State
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [activeEnquiry, setActiveEnquiry] = useState(null);
  const [editStatus, setEditStatus] = useState('Pending');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editNotes, setEditNotes] = useState('');
  const [savingResolution, setSavingResolution] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await api.get('/enquiries', { params });
      setEnquiries(res.data.enquiries || []);
      setStats(res.data.stats || { total: 0, pending: 0, in_progress: 0, resolved: 0 });
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEnquiries();
  };

  const handleOpenInspect = (enq) => {
    setActiveEnquiry(enq);
    setEditStatus(enq.status || 'Pending');
    setEditPriority(enq.priority || 'Medium');
    setEditNotes(enq.resolution_notes || '');
    setInspectModalOpen(true);
  };

  const handleSaveResolution = async (overrideStatus = null) => {
    if (!activeEnquiry) return;
    const finalStatus = overrideStatus || editStatus;
    setSavingResolution(true);
    try {
      const res = await api.put(`/enquiries/${activeEnquiry.id}`, {
        status: finalStatus,
        priority: editPriority,
        resolution_notes: editNotes.trim()
      });
      showToast(
        finalStatus === 'Resolved'
          ? `Inquiry #ENQ-${String(activeEnquiry.id).padStart(4, '0')} marked as Resolved!`
          : `Inquiry #ENQ-${String(activeEnquiry.id).padStart(4, '0')} updated`,
        'success'
      );
      setInspectModalOpen(false);
      fetchEnquiries();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to update inquiry', 'error');
    } finally {
      setSavingResolution(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/enquiries/${deleteId}`);
      showToast('Inquiry record deleted', 'success');
      setDeleteId(null);
      fetchEnquiries();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to delete inquiry', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const priorityStyles = {
    Urgent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    High: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    Medium: 'bg-blue-500/10 text-[#0071e3] dark:text-[#2997ff] border-blue-500/20',
    Low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
  };

  const statusStyles = {
    Pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    'In Progress': 'bg-blue-500/10 text-[#0071e3] dark:text-[#2997ff] border-blue-500/20',
    Resolved: 'bg-emerald-500/10 text-[#34c759] border-emerald-500/20'
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 animate-apple-enter font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff] mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Administrative Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
            Institutional Inquiries & Helpdesk
          </h1>
          <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1">
            Review, track, and solve inquiries submitted by recruiters, academic departments, and campus visitors.
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          disabled={loading}
          className="apple-btn-secondary px-4 py-2 text-xs font-medium cursor-pointer self-start sm:self-auto flex items-center gap-2"
          title="Refresh Inquiries"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 4 Apple Liquid KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="apple-gloss-tile p-5 group hover:scale-[1.01] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#86868b] dark:text-[#a1a1a6]">Total Inquiries</span>
            <div className="w-8 h-8 rounded-xl liquid-pill text-[#0071e3] dark:text-[#2997ff] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mt-2">
            {stats.total}
          </div>
          <div className="text-[11px] text-[#86868b] dark:text-[#a1a1a6] mt-0.5">Recorded in DB</div>
        </div>

        <div className="apple-gloss-tile p-5 group hover:scale-[1.01] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#86868b] dark:text-[#a1a1a6]">Pending Action</span>
            <div className="w-8 h-8 rounded-xl liquid-pill text-amber-600 dark:text-amber-400 bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-2">
            <span>{stats.pending}</span>
            {stats.pending > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
            )}
          </div>
          <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">Requires resolution</div>
        </div>

        <div className="apple-gloss-tile p-5 group hover:scale-[1.01] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#86868b] dark:text-[#a1a1a6]">In Progress</span>
            <div className="w-8 h-8 rounded-xl liquid-pill text-[#0071e3] dark:text-[#2997ff] bg-blue-500/10 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0071e3] dark:text-[#2997ff] mt-2">
            {stats.in_progress}
          </div>
          <div className="text-[11px] text-[#86868b] dark:text-[#a1a1a6] mt-0.5">Under active review</div>
        </div>

        <div className="apple-gloss-tile p-5 group hover:scale-[1.01] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#86868b] dark:text-[#a1a1a6]">Solved & Resolved</span>
            <div className="w-8 h-8 rounded-xl liquid-pill text-[#34c759] bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#34c759] mt-2">
            {stats.resolved}
          </div>
          <div className="text-[11px] text-[#34c759] mt-0.5">Officially resolved</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="apple-gloss-tile p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="inline-flex p-1 rounded-2xl bg-black/5 dark:bg-white/10 text-xs font-medium overflow-x-auto max-w-full">
          {['all', 'Pending', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === st
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs font-semibold'
                  : 'text-[#86868b] dark:text-[#a1a1a6]'
              }`}
            >
              <span>{st === 'all' ? 'All Inquiries' : st}</span>
              {st === 'Pending' && stats.pending > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Category & Search Form */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl text-xs focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
          >
            <option value="all">All Categories</option>
            <option value="General">General</option>
            <option value="Drive Collaboration">Drive Collaboration</option>
            <option value="Student Verification">Student Verification</option>
            <option value="Data Integration">Data Integration</option>
          </select>

          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sender, subject..."
              className="pl-8 pr-3 py-2 bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl text-xs focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7] w-48 sm:w-60"
            />
          </form>
        </div>
      </div>

      {/* Inquiries List / Glass Table */}
      <div className="apple-glass-table-container rounded-[28px] overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-[#86868b]">
            <div className="w-6 h-6 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs">Fetching institutional inquiries...</span>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-16 text-center text-[#86868b] space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#34c759] mx-auto opacity-75" />
            <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">No Inquiries Found</h3>
            <p className="text-xs max-w-sm mx-auto">
              {statusFilter !== 'all'
                ? `There are no inquiries with status "${statusFilter}".`
                : 'All incoming public and institutional inquiries have been addressed.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-4 sm:p-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Inquiry Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0071e3] dark:text-[#2997ff]">
                      #ENQ-{String(enq.id).padStart(4, '0')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[enq.status] || 'bg-slate-100'}`}>
                      {enq.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${priorityStyles[enq.priority] || 'bg-slate-100'}`}>
                      {enq.priority} Priority
                    </span>
                    <span className="liquid-pill px-2 py-0.5 text-[10px] font-semibold text-[#86868b]">
                      {enq.category}
                    </span>
                    <span className="text-[11px] text-[#86868b] dark:text-[#a1a1a6] flex items-center gap-1 ml-auto md:ml-0">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(enq.created_at)}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                    {enq.subject || 'Institutional Inquiry'}
                  </h3>

                  <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] line-clamp-2 leading-relaxed">
                    {enq.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#86868b] pt-1">
                    <span className="flex items-center gap-1.5 font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                      <User className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>{enq.name}</span>
                    </span>

                    <a
                      href={`mailto:${enq.email}`}
                      className="flex items-center gap-1 hover:text-[#0071e3] transition-colors font-mono text-[11px]"
                      title="Send email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{enq.email}</span>
                    </a>

                    {enq.phone && (
                      <a
                        href={`tel:${enq.phone}`}
                        className="flex items-center gap-1 hover:text-[#0071e3] transition-colors font-mono text-[11px]"
                        title="Call contact"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{enq.phone}</span>
                      </a>
                    )}

                    {enq.status === 'Resolved' && enq.resolved_by && (
                      <span className="flex items-center gap-1 text-[11px] text-[#34c759] font-medium">
                        <CheckCircle className="w-3 h-3" />
                        <span>Solved by @{enq.resolved_by}</span>
                      </span>
                    )}
                  </div>

                  {enq.resolution_notes && (
                    <div className="mt-2 p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] text-xs">
                      <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mr-1">
                        Resolution Note:
                      </span>
                      <span className="text-[#86868b] dark:text-[#a1a1a6]">{enq.resolution_notes}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleOpenInspect(enq)}
                    className="apple-btn-primary px-3.5 py-1.5 text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{enq.status === 'Resolved' ? 'View / Edit' : 'Solve Inquiry'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {role === 'admin' && (
                    <button
                      onClick={() => setDeleteId(enq.id)}
                      className="p-2 text-[#86868b] hover:text-[#ff3b30] hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          SOLVE / INSPECT INQUIRY MODAL (Apple VisionOS Liquid Sheet)
      ========================================================================== */}
      {inspectModalOpen && activeEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in font-sans overflow-y-auto">
          <div className="w-full max-w-2xl my-auto liquid-glass rounded-[32px] shadow-2xl overflow-hidden border border-white/60 dark:border-white/15 animate-modal-pop relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-black/[0.06] dark:border-white/[0.08] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0071e3] dark:text-[#2997ff]">
                    #ENQ-{String(activeEnquiry.id).padStart(4, '0')}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[activeEnquiry.status] || 'bg-slate-100'}`}>
                    {activeEnquiry.status}
                  </span>
                  <span className="liquid-pill px-2 py-0.5 text-[10px] font-semibold text-[#86868b]">
                    {activeEnquiry.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mt-1">
                  {activeEnquiry.subject || 'Institutional Inquiry'}
                </h2>
                <div className="text-xs text-[#86868b] mt-0.5">
                  Received on {formatDate(activeEnquiry.created_at)}
                </div>
              </div>

              <button
                onClick={() => setInspectModalOpen(false)}
                className="p-2 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
              
              {/* Sender Details Tile */}
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">Sender Name</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">
                    {activeEnquiry.name}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">Email Address</div>
                  <a
                    href={`mailto:${activeEnquiry.email}`}
                    className="text-xs sm:text-sm font-medium text-[#0071e3] dark:text-[#2997ff] hover:underline mt-0.5 block truncate"
                  >
                    {activeEnquiry.email}
                  </a>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">Contact Phone</div>
                  <div className="text-xs sm:text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">
                    {activeEnquiry.phone || 'Not provided'}
                  </div>
                </div>
              </div>

              {/* Message Details */}
              <div>
                <label className="block text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] mb-1.5 uppercase tracking-wider">
                  Original Inquiry Message
                </label>
                <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs sm:text-sm text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed whitespace-pre-wrap shadow-inner">
                  {activeEnquiry.message}
                </div>
              </div>

              {/* Status & Priority Control */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                    Inquiry Workflow Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/70 dark:bg-[#1c1c1e] border border-black/10 dark:border-white/10 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  >
                    <option value="Pending">Pending (Unresolved)</option>
                    <option value="In Progress">In Progress (Under Review)</option>
                    <option value="Resolved">Resolved (Solved & Closed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                    Priority Tier
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/70 dark:bg-[#1c1c1e] border border-black/10 dark:border-white/10 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Resolution Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                  Institutional Resolution Notes / Solution Summary
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record your resolution steps (e.g. 'Contacted HR via phone, confirmed recruitment slot for Nov 20th; sent registration link')"
                  className="w-full px-4 py-2.5 bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
                />
              </div>

              {activeEnquiry.status === 'Resolved' && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-[#34c759] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Solved by @{activeEnquiry.resolved_by || currentUser?.username}</span>
                  </div>
                  <span>{formatDate(activeEnquiry.resolved_at)}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-5 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setInspectModalOpen(false)}
                className="apple-btn-secondary px-4 py-2 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                {editStatus !== 'Resolved' && (
                  <button
                    type="button"
                    onClick={() => handleSaveResolution('Resolved')}
                    disabled={savingResolution}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#34c759] hover:bg-[#2db84d] text-white shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Mark as Resolved</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSaveResolution()}
                  disabled={savingResolution}
                  className="apple-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer flex items-center gap-2 shadow-md"
                >
                  {savingResolution ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Institutional Inquiry"
        message="Are you sure you want to permanently remove this inquiry record from the administrative database? This action is logged in audit trails."
        confirmText="Delete Record"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />

    </div>
  );
}
