import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Building,
  User,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Download,
  X,
  FileCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

export default function OffersPage() {
  const { role, showToast } = useAuth();
  const canEdit = ['admin', 'placement_officer'].includes(role);
  const canDelete = role === 'admin';

  const [offers, setOffers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');

  // Modal State
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form
  const defaultOffer = {
    student_id: '',
    company_id: '',
    job_role: '',
    ctc_lpa: 8.5,
    fixed_salary_lpa: 7.2,
    variable_salary_lpa: 1.3,
    currency: 'INR',
    offer_date: new Date().toISOString().split('T')[0],
    joining_date: '2025-07-01',
    status: 'Offered',
    remarks: ''
  };
  const [offerForm, setOfferForm] = useState(defaultOffer);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'All') params.status = statusFilter;
      if (companyFilter !== 'All') params.company_id = companyFilter;

      const [offersRes, compRes, stRes] = await Promise.all([
        api.get('/offers', { params }),
        api.get('/companies'),
        api.get('/students', { params: { limit: 500 } })
      ]);
      setOffers(offersRes.data);
      setCompanies(compRes.data);
      setStudents(stRes.data.data);
    } catch (err) {
      showToast('Error loading offers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [statusFilter, companyFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOffers();
  };

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setOfferForm(defaultOffer);
    setOfferModalOpen(true);
  };

  const handleOpenEdit = (o) => {
    setEditingOffer(o);
    setOfferForm({
      student_id: o.student_id,
      company_id: o.company_id,
      job_role: o.job_role,
      ctc_lpa: o.ctc_lpa,
      fixed_salary_lpa: o.fixed_salary_lpa,
      variable_salary_lpa: o.variable_salary_lpa,
      currency: o.currency || 'INR',
      offer_date: o.offer_date,
      joining_date: o.joining_date || '',
      status: o.status,
      remarks: o.remarks || ''
    });
    setOfferModalOpen(true);
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        student_id: parseInt(offerForm.student_id, 10),
        company_id: parseInt(offerForm.company_id, 10),
        job_role: offerForm.job_role,
        ctc_lpa: parseFloat(offerForm.ctc_lpa),
        fixed_salary_lpa: parseFloat(offerForm.fixed_salary_lpa),
        variable_salary_lpa: parseFloat(offerForm.variable_salary_lpa),
        currency: offerForm.currency,
        offer_date: offerForm.offer_date,
        joining_date: offerForm.joining_date || null,
        status: offerForm.status,
        remarks: offerForm.remarks || null
      };

      if (editingOffer) {
        await api.put(`/offers/${editingOffer.id}`, payload);
        showToast('Offer updated and student placement record synced', 'success');
      } else {
        await api.post('/offers', payload);
        showToast('Offer created successfully', 'success');
      }
      setOfferModalOpen(false);
      fetchOffers();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to save offer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/offers/${deleteId}`);
      showToast('Offer deleted', 'success');
      setDeleteId(null);
      fetchOffers();
    } catch (err) {
      showToast('Failed to delete offer', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = (fmt = 'csv') => {
    window.open(`/api/import-export/export/offers?format=${fmt}`, '_blank');
  };

  // Distinct placed students calculation
  const acceptedOffers = offers.filter((o) => o.status === 'Accepted');
  const distinctPlacedStudents = new Set(acceptedOffers.map((o) => o.student_id)).size;

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="editorial-kicker">// COMPENSATION LEDGER // SELECTION REGISTRY</div>
          <h2 className="text-2xl font-editorial italic font-normal text-white tracking-tight flex items-center gap-3">
            Compensation Ledger & Offer Acceptance
            <span className="text-[11px] font-mono not-italic px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
              {offers.length} OFFERS
            </span>
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Track job offers, compensation structures (Fixed + Variable), joining timelines, and student acceptances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-mono font-medium rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>RECORD OFFER</span>
            </button>
          )}

          <div className="flex items-center gap-1 border-l border-white/[0.08] pl-2">
            <button
              onClick={() => handleExport('csv')}
              className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg font-mono text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Export as CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" /> CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg font-mono text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Export as Excel"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" /> EXCEL
            </button>
          </div>
        </div>
      </div>

      {/* Offer Summary KPI Dock */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="intel-card p-4 rounded-2xl border border-white/[0.08]">
          <span className="text-[10px] font-mono uppercase text-slate-500">// TOTAL OFFERS EXTENDED</span>
          <div className="text-2xl font-mono-num font-bold text-white mt-1">{offers.length}</div>
        </div>
        <div className="intel-card p-4 rounded-2xl border border-white/[0.08]">
          <span className="text-[10px] font-mono uppercase text-slate-500">// DISTINCT CANDIDATES PLACED</span>
          <div className="text-2xl font-mono-num font-bold text-emerald-400 mt-1">
            {distinctPlacedStudents}
          </div>
        </div>
        <div className="intel-card p-4 rounded-2xl border border-white/[0.08]">
          <span className="text-[10px] font-mono uppercase text-slate-500">// ACCEPTED OFFERS</span>
          <div className="text-2xl font-mono-num font-bold text-cyan-300 mt-1">
            {acceptedOffers.length}
          </div>
        </div>
        <div className="intel-card p-4 rounded-2xl border border-white/[0.08]">
          <span className="text-[10px] font-mono uppercase text-slate-500">// MULTI-OFFER COHORT</span>
          <div className="text-2xl font-mono-num font-bold text-purple-400 mt-1">
            {Math.max(0, offers.length - distinctPlacedStudents)}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="intel-card p-4 rounded-2xl border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by student name, roll number, corporate partner, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-500/50"
          />
        </form>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-300 focus:outline-hidden focus:border-cyan-500/40 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Offered">Offered</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Revoked">Revoked</option>
          </select>

          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="py-1.5 px-3 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-300 focus:outline-hidden focus:border-cyan-500/40 cursor-pointer"
          >
            <option value="All">All Companies</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Offers Table */}
      <div className="intel-card rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-white/[0.08] text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="p-3">CANDIDATE DOSSIER</th>
                <th className="p-3">RECRUITING PARTNER</th>
                <th className="p-3">DESIGNATION / ROLE</th>
                <th className="p-3 text-right">OFFERED CTC</th>
                <th className="p-3 text-right">FIXED / VAR.</th>
                <th className="p-3">OFFER DATE</th>
                <th className="p-3">ACCEPTANCE</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-medium text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-400 font-mono text-xs">
                    <div className="inline-block w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>// RETRIEVING COMPENSATION LEDGER...</p>
                  </td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-500 font-mono text-xs">
                    // ZERO COMPENSATION RECORDS MATCH CRITERIA
                  </td>
                </tr>
              ) : (
                offers.map((off) => (
                  <tr key={off.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3">
                      <div className="font-serif font-medium text-white">
                        {off.student_name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {off.student_roll} ({off.student_department})
                      </div>
                    </td>
                    <td className="p-3 font-serif font-medium text-slate-200">
                      {off.company_name}
                    </td>
                    <td className="p-3 font-mono text-xs text-cyan-300">
                      {off.job_role}
                    </td>
                    <td className="p-3 text-right font-mono-num font-bold text-emerald-400 text-sm">
                      ₹{off.ctc_lpa} LPA
                    </td>
                    <td className="p-3 text-right font-mono text-xs text-slate-400">
                      ₹{off.fixed_salary_lpa} / ₹{off.variable_salary_lpa}
                    </td>
                    <td className="p-3 font-mono text-slate-400 text-xs">
                      {off.offer_date}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                          off.status === 'Accepted'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            : off.status === 'Offered'
                            ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                            : off.status === 'Rejected'
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-900 text-slate-400 border border-white/[0.06]'
                        }`}
                      >
                        {off.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit && (
                          <button
                            onClick={() => handleOpenEdit(off)}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                            title="Edit Offer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setDeleteId(off.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                            title="Delete Offer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT OFFER MODAL */}
      {offerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg intel-card rounded-3xl shadow-2xl border border-white/[0.12] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="editorial-kicker">// OFFER RECORD</div>
                <h3 className="text-xl font-editorial italic font-normal text-white">
                  {editingOffer ? 'Update Compensation Record' : 'Record New Job Offer'}
                </h3>
              </div>
              <button onClick={() => setOfferModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="space-y-3 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Candidate *</label>
                  <select
                    required
                    value={offerForm.student_id}
                    onChange={(e) => setOfferForm({ ...offerForm, student_id: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="">Select Candidate</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.full_name} ({s.roll_number})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Company *</label>
                  <select
                    required
                    value={offerForm.company_id}
                    onChange={(e) => setOfferForm({ ...offerForm, company_id: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="">Select Company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Designation / Role *</label>
                <input
                  type="text"
                  required
                  value={offerForm.job_role}
                  onChange={(e) => setOfferForm({ ...offerForm, job_role: e.target.value })}
                  placeholder="e.g. SDE-1 / Consultant"
                  className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">CTC (LPA) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={offerForm.ctc_lpa}
                    onChange={(e) => setOfferForm({ ...offerForm, ctc_lpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-emerald-400 font-semibold focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Fixed Component</label>
                  <input
                    type="number"
                    step="0.05"
                    value={offerForm.fixed_salary_lpa}
                    onChange={(e) => setOfferForm({ ...offerForm, fixed_salary_lpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Variable Component</label>
                  <input
                    type="number"
                    step="0.05"
                    value={offerForm.variable_salary_lpa}
                    onChange={(e) => setOfferForm({ ...offerForm, variable_salary_lpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Offer Date</label>
                  <input
                    type="date"
                    value={offerForm.offer_date}
                    onChange={(e) => setOfferForm({ ...offerForm, offer_date: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Expected Joining Date</label>
                  <input
                    type="date"
                    value={offerForm.joining_date}
                    onChange={(e) => setOfferForm({ ...offerForm, joining_date: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Offer Acceptance Status</label>
                <select
                  value={offerForm.status}
                  onChange={(e) => setOfferForm({ ...offerForm, status: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Offered">Offered (Pending Decision)</option>
                  <option value="Accepted">Accepted (Candidate Placed)</option>
                  <option value="Rejected">Rejected by Candidate</option>
                  <option value="Revoked">Revoked</option>
                </select>
                <p className="text-[11px] font-mono text-cyan-400/80 mt-1">
                  // Setting to "Accepted" automatically updates student placement status to Placed in the database.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl font-mono text-xs cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl font-mono text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {submitting ? 'SAVING...' : editingOffer ? 'UPDATE OFFER' : 'SAVE OFFER'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Purge Offer Record"
        message="Are you sure you want to remove this job offer? If accepted, student placement status will be re-evaluated."
        confirmText="Purge Offer"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
