import React, { useState, useEffect, useCallback } from 'react';
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
  X,
  FileCheck
} from 'lucide-react';
import api, { getErrorMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import CompanyLogo from '../components/CompanyLogo';
import { TableSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function OffersPage() {
  const { role, showToast } = useAuth();
  const canEdit = ['admin', 'placement_officer'].includes(role);
  const canDelete = role === 'admin';

  const [offers, setOffers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

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

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
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
      const msg = getErrorMessage(err, 'Failed to load offers');
      setFetchError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, companyFilter, showToast]);

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

  // Distinct placed students calculation
  const acceptedOffers = offers.filter((o) => o.status === 'Accepted');
  const distinctPlacedStudents = new Set(acceptedOffers.map((o) => o.student_id)).size;

  return (
    <div className="space-y-6">
      {/* Studio Hero Command Bar */}
      <div className="apple-gloss-tile p-6 sm:p-7 rounded-[28px] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#0071e3]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 liquid-pill text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] shadow-xs">
              <Award className="w-3.5 h-3.5" />
              <span>Campus Compensation Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              Job Offers & <span className="apple-siri-gradient-text">Salary Compensation</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] max-w-2xl leading-relaxed">
              Track issued employment offers, record fixed vs. variable CTC structures, manage acceptance milestones, and monitor student career trajectories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {canEdit && (
              <button
                onClick={handleOpenAdd}
                className="apple-btn-primary px-4 py-2 text-xs font-medium cursor-pointer flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Record Job Offer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Offer Summary KPI Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="apple-gloss-tile p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-[#86868b] dark:text-[#a1a1a6] font-medium">Total Offers Extended</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mt-1">{offers.length}</div>
          <span className="text-[11px] text-[#0071e3] dark:text-[#2997ff] mt-0.5">Verified candidate letters</span>
        </div>
        <div className="apple-gloss-tile p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-[#86868b] dark:text-[#a1a1a6] font-medium">Distinct Placed Students</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#34c759] mt-1">
            {distinctPlacedStudents}
          </div>
          <span className="text-[11px] text-[#34c759] mt-0.5">Unique placed candidates</span>
        </div>
        <div className="apple-gloss-tile p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-[#86868b] dark:text-[#a1a1a6] font-medium">Accepted Offers</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#0071e3] dark:text-[#2997ff] mt-1">
            {acceptedOffers.length}
          </div>
          <span className="text-[11px] text-[#86868b] mt-0.5">Formal onboarding locked</span>
        </div>
        <div className="apple-gloss-tile p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-[#86868b] dark:text-[#a1a1a6] font-medium">Multiple Offers Cohort</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#af52de] mt-1">
            {Math.max(0, offers.length - distinctPlacedStudents)}
          </div>
          <span className="text-[11px] text-[#af52de] mt-0.5">Multi-offer achievers</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="liquid-glass rounded-[24px] p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll, company, job role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-hidden"
          />
        </form>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-hidden"
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
            className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-hidden"
          >
            <option value="All">All Companies</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Offers Table */}
      <div className="apple-glass-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-3">Student Name</th>
                <th className="p-3">Recruiting Company</th>
                <th className="p-3">Designation / Role</th>
                <th className="p-3 text-right">Offered CTC</th>
                <th className="p-3 text-right">Fixed / Var.</th>
                <th className="p-3">Offer Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {loading ? (
                <TableSkeleton rows={6} columns={8} />
              ) : fetchError ? (
                <ErrorState
                  asTableRow
                  colSpan={8}
                  title="Unable to Load Job Offers"
                  message={fetchError}
                  onRetry={fetchOffers}
                />
              ) : offers.length === 0 ? (
                <EmptyState
                  asTableRow
                  colSpan={8}
                  icon={Award}
                  title="No Offers Found"
                  description="We couldn't find any job offer records matching your search or filters."
                  onReset={() => {
                    setSearch('');
                    setStatusFilter('All');
                    setCompanyFilter('All');
                  }}
                  resetLabel="Clear Filters"
                  onAction={canEdit ? handleOpenAdd : undefined}
                  actionLabel="Add New Offer"
                />
              ) : (
                offers.map((off) => (
                  <tr key={off.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {off.student_name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {off.student_roll} ({off.student_department})
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-2.5">
                        <CompanyLogo
                          company={companies.find((c) => c.id === off.company_id || c.name === off.company_name) || { name: off.company_name }}
                          size={28}
                          rounded="rounded-lg"
                        />
                        <span className="truncate">{off.company_name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">
                      {off.job_role}
                    </td>
                    <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      ₹{off.ctc_lpa} LPA
                    </td>
                    <td className="p-3 text-right text-slate-500">
                      ₹{off.fixed_salary_lpa} / ₹{off.variable_salary_lpa}
                    </td>
                    <td className="p-3 text-slate-500 font-mono">
                      {off.offer_date}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          off.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : off.status === 'Offered'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                            : off.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {off.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {canEdit && (
                          <button
                            onClick={() => handleOpenEdit(off)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit Offer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setDeleteId(off.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingOffer ? 'Edit Offer & Salary Details' : 'Record New Job Offer'}
              </h3>
              <button onClick={() => setOfferModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Student Candidate *</label>
                  <select
                    required
                    value={offerForm.student_id}
                    onChange={(e) => setOfferForm({ ...offerForm, student_id: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.full_name} ({s.roll_number})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Company *</label>
                  <select
                    required
                    value={offerForm.company_id}
                    onChange={(e) => setOfferForm({ ...offerForm, company_id: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  >
                    <option value="">Select Company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Designation / Role *</label>
                <input
                  type="text"
                  required
                  value={offerForm.job_role}
                  onChange={(e) => setOfferForm({ ...offerForm, job_role: e.target.value })}
                  placeholder="e.g. SDE-1 / Consultant"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Offered CTC (LPA) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={offerForm.ctc_lpa}
                    onChange={(e) => setOfferForm({ ...offerForm, ctc_lpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Fixed Component</label>
                  <input
                    type="number"
                    step="0.05"
                    value={offerForm.fixed_salary_lpa}
                    onChange={(e) => setOfferForm({ ...offerForm, fixed_salary_lpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Variable Component</label>
                  <input
                    type="number"
                    step="0.05"
                    value={offerForm.variable_salary_lpa}
                    onChange={(e) => setOfferForm({ ...offerForm, variable_salary_lpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Offer Date</label>
                  <input
                    type="date"
                    value={offerForm.offer_date}
                    onChange={(e) => setOfferForm({ ...offerForm, offer_date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Expected Joining Date</label>
                  <input
                    type="date"
                    value={offerForm.joining_date}
                    onChange={(e) => setOfferForm({ ...offerForm, joining_date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Offer Acceptance Status</label>
                <select
                  value={offerForm.status}
                  onChange={(e) => setOfferForm({ ...offerForm, status: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                >
                  <option value="Offered">Offered (Pending Decision)</option>
                  <option value="Accepted">Accepted (Student Placed)</option>
                  <option value="Rejected">Rejected by Candidate</option>
                  <option value="Revoked">Revoked</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Setting to "Accepted" automatically updates student placement status to Placed in the database.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  {submitting ? 'Saving...' : editingOffer ? 'Update Offer' : 'Save Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Offer Record"
        message="Are you sure you want to remove this job offer? If accepted, student placement status will be re-evaluated."
        confirmText="Delete Offer"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
