import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  Award,
  CheckSquare,
  Square,
  X,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import Pagination from '../components/Pagination';

export default function StudentsPage() {
  const { role, showToast } = useAuth();
  const canEdit = ['admin', 'placement_officer'].includes(role);
  const canDelete = role === 'admin';

  // Data states
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [placementEligibility, setPlacementEligibility] = useState('All');
  const [placementStatus, setPlacementStatus] = useState('All');
  const [graduationYear, setGraduationYear] = useState('');

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [profileStudent, setProfileStudent] = useState(null);
  const [profileDetails, setProfileDetails] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileTab, setProfileTab] = useState('overview');

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkUpdates, setBulkUpdates] = useState({ placement_status: '', department: '' });

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Initial Form Data
  const defaultFormData = {
    roll_number: '',
    full_name: '',
    email: '',
    phone: '',
    department: 'CSE',
    degree: 'B.Tech',
    academic_year: '2024-2025',
    graduation_year: 2025,
    cgpa: 7.5,
    percentage: 71.0,
    active_backlogs: 0,
    total_backlogs: 0,
    backlog_history: '',
    skills_text: 'Python, SQL',
    soft_skills_text: 'Communication, Teamwork',
    internship_experience: false,
    internship_details: '',
    resume_link: '',
    placement_status: 'Unplaced',
    remarks: '',
    custom_key: '',
    custom_val: ''
  };
  const [formData, setFormData] = useState(defaultFormData);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 25 };
      if (search.trim()) params.search = search.trim();
      if (department !== 'All') params.department = department;
      if (placementEligibility !== 'All') params.placement_eligibility = placementEligibility;
      if (placementStatus !== 'All') params.placement_status = placementStatus;
      if (graduationYear) params.graduation_year = graduationYear;

      const res = await api.get('/students', { params });
      setStudents(res.data.data);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      showToast('Error loading students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, department, placementEligibility, placementStatus, graduationYear]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData(defaultFormData);
    setFormOpen(true);
  };

  const handleOpenEdit = (st) => {
    setEditingStudent(st);
    setFormData({
      roll_number: st.roll_number,
      full_name: st.full_name,
      email: st.email,
      phone: st.phone || '',
      department: st.department,
      degree: st.degree,
      academic_year: st.academic_year,
      graduation_year: st.graduation_year,
      cgpa: st.cgpa,
      percentage: st.percentage,
      active_backlogs: st.active_backlogs,
      total_backlogs: st.total_backlogs,
      backlog_history: st.backlog_history || '',
      skills_text: (st.skills || []).join(', '),
      soft_skills_text: (st.soft_skills || []).join(', '),
      internship_experience: st.internship_experience,
      internship_details: st.internship_details || '',
      resume_link: st.resume_link || '',
      placement_status: st.placement_status,
      remarks: st.remarks || '',
      custom_key: '',
      custom_val: ''
    });
    setFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const skillsArray = formData.skills_text
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const softSkillsArray = formData.soft_skills_text
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        roll_number: formData.roll_number,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        department: formData.department,
        degree: formData.degree,
        academic_year: formData.academic_year,
        graduation_year: parseInt(formData.graduation_year, 10),
        cgpa: parseFloat(formData.cgpa),
        percentage: parseFloat(formData.percentage),
        active_backlogs: parseInt(formData.active_backlogs, 10),
        total_backlogs: parseInt(formData.total_backlogs, 10),
        backlog_history: formData.backlog_history || null,
        skills: skillsArray,
        soft_skills: softSkillsArray,
        internship_experience: formData.internship_experience,
        internship_details: formData.internship_details || null,
        resume_link: formData.resume_link || null,
        placement_status: formData.placement_status,
        remarks: formData.remarks || null
      };

      if (editingStudent) {
        await api.put(`/students/${editingStudent.id}`, payload);
        showToast(`Student ${formData.full_name} updated & eligibility recalculated!`, 'success');
      } else {
        await api.post('/students', payload);
        showToast(`Student ${formData.full_name} added successfully!`, 'success');
      }

      setFormOpen(false);
      fetchStudents();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to save student record', 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/students/${deleteId}`);
      showToast('Student deleted successfully', 'success');
      setDeleteId(null);
      fetchStudents();
    } catch (err) {
      showToast('Failed to delete student', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenProfile = async (st) => {
    setProfileStudent(st);
    setProfileTab('overview');
    setProfileLoading(true);
    try {
      const res = await api.get(`/students/${st.id}`);
      setProfileDetails(res.data);
    } catch (err) {
      showToast('Failed to load profile details', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleRecalculateAll = async () => {
    try {
      const res = await api.post('/rules/recalculate-all');
      showToast(res.data?.message || 'Eligibility recalculated across all students!', 'success');
      fetchStudents();
    } catch (err) {
      showToast('Recalculation error', 'error');
    }
  };

  const handleBulkSubmit = async () => {
    if (selectedIds.length === 0) return;
    try {
      const payload = {
        student_ids: selectedIds
      };
      if (bulkUpdates.placement_status) payload.placement_status = bulkUpdates.placement_status;
      if (bulkUpdates.department) payload.department = bulkUpdates.department;

      await api.post('/students/bulk-update', payload);
      showToast(`Updated ${selectedIds.length} students!`, 'success');
      setBulkOpen(false);
      setSelectedIds([]);
      fetchStudents();
    } catch (err) {
      showToast('Bulk update failed', 'error');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === students.length) setSelectedIds([]);
    else setSelectedIds(students.map((s) => s.id));
  };

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((item) => item !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleExport = (format = 'csv') => {
    const url = `/api/import-export/export/students?format=${format}&department=${department}&placement_status=${placementStatus}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="editorial-kicker">// DOSSIER DIRECTORY // CANDIDATE REGISTRY</div>
          <h2 className="text-2xl font-editorial italic font-normal text-white tracking-tight flex items-center gap-3">
            Student Cadre & Dossiers
            <span className="text-[11px] font-mono not-italic px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
              {total} COHORT
            </span>
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Academic dossiers, real-time eligibility evaluation indexes & recruitment pipelines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {canEdit && (
            <>
              <button
                onClick={handleRecalculateAll}
                className="px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.1] text-xs font-mono rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                title="Recalculate placement eligibility across all students using current active rules"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>RECALCULATE ALL</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-mono font-medium rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ADD STUDENT</span>
              </button>
            </>
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

      {/* Filter and Search Bar */}
      <div className="intel-card p-4 rounded-2xl border border-white/[0.08] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by roll number, name, email, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-500/50"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Department */}
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setPage(1);
              }}
              className="py-1.5 px-3 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-300 focus:outline-hidden focus:border-cyan-500/40 cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>

            {/* Eligibility */}
            <select
              value={placementEligibility}
              onChange={(e) => {
                setPlacementEligibility(e.target.value);
                setPage(1);
              }}
              className="py-1.5 px-3 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-300 focus:outline-hidden focus:border-cyan-500/40 cursor-pointer"
            >
              <option value="All">All Eligibility</option>
              <option value="Eligible">Eligible</option>
              <option value="Not Eligible">Not Eligible</option>
              <option value="Needs Review">Needs Review</option>
            </select>

            {/* Placement Status */}
            <select
              value={placementStatus}
              onChange={(e) => {
                setPlacementStatus(e.target.value);
                setPage(1);
              }}
              className="py-1.5 px-3 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-300 focus:outline-hidden focus:border-cyan-500/40 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Unplaced">Unplaced</option>
              <option value="In Process">In Process</option>
              <option value="Opted Out">Opted Out</option>
            </select>
          </div>
        </div>

        {/* Selected rows toolbar */}
        {canEdit && selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl animate-fade-in text-xs font-mono">
            <span className="font-semibold text-cyan-300 flex items-center gap-2">
              <span className="phosphor-dot-cyan" />
              {selectedIds.length} CANDIDATES SELECTED
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBulkOpen(true)}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs rounded-lg transition-colors cursor-pointer"
              >
                BULK UPDATE
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1 bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                DESELECT ALL
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Students Data Table */}
      <div className="intel-card rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-white/[0.08] text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                {canEdit && (
                  <th className="p-3 w-10 text-center">
                    <button onClick={handleSelectAll} className="text-slate-500 hover:text-cyan-400 cursor-pointer">
                      {selectedIds.length === students.length && students.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                )}
                <th className="p-3">ROLL NO.</th>
                <th className="p-3">CANDIDATE DOSSIER</th>
                <th className="p-3">DEPT</th>
                <th className="p-3 text-center">CGPA</th>
                <th className="p-3 text-center">BACKLOGS</th>
                <th className="p-3">ELIGIBILITY</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">OFFER / PLACEMENT</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-medium text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={canEdit ? 10 : 9} className="p-12 text-center text-slate-400 font-mono text-xs">
                    <div className="inline-block w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>// RETRIEVING CANDIDATE DOSSIERS...</p>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 10 : 9} className="p-12 text-center text-slate-500 font-mono text-xs">
                    // ZERO CANDIDATE DOSSIERS MATCH CRITERIA
                  </td>
                </tr>
              ) : (
                students.map((st) => {
                  const isSelected = selectedIds.includes(st.id);
                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isSelected ? 'bg-cyan-950/20' : ''
                      }`}
                    >
                      {canEdit && (
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleSelect(st.id)}
                            className="text-slate-500 hover:text-cyan-400 cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-cyan-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      )}
                      <td className="p-3 font-mono font-bold text-cyan-300">
                        {st.roll_number}
                      </td>
                      <td className="p-3">
                        <div className="font-serif text-slate-100 font-medium">
                          {st.full_name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{st.email}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/[0.08] text-slate-300 text-[11px] font-mono">
                          {st.department}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono-num font-bold text-emerald-400">
                        {st.cgpa.toFixed(2)}
                      </td>
                      <td className="p-3 text-center font-mono">
                        {st.active_backlogs > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-950/60 text-rose-400 border border-rose-500/30">
                            {st.active_backlogs} ACTIVE
                          </span>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </td>
                      <td className="p-3">
                        {st.placement_eligibility === 'Eligible' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-950/50 text-emerald-300 border border-emerald-500/30">
                            <span className="phosphor-dot-green" /> Eligible
                          </span>
                        )}
                        {st.placement_eligibility === 'Not Eligible' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-rose-950/50 text-rose-300 border border-rose-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Ineligible
                          </span>
                        )}
                        {st.placement_eligibility === 'Needs Review' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-950/50 text-amber-300 border border-amber-500/30">
                            <span className="phosphor-dot-amber" /> Review
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
                            st.placement_status === 'Placed'
                              ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40'
                              : st.placement_status === 'In Process'
                              ? 'bg-purple-950/60 text-purple-300 border border-purple-500/40'
                              : 'bg-slate-900 text-slate-400 border border-white/[0.06]'
                          }`}
                        >
                          {st.placement_status}
                        </span>
                      </td>
                      <td className="p-3">
                        {st.selected_company_name ? (
                          <div>
                            <div className="font-serif font-medium text-slate-200">
                              {st.selected_company_name}
                            </div>
                            <div className="text-[11px] text-emerald-400 font-mono font-semibold">
                              ₹{st.offered_package_lpa} LPA • {st.job_role || 'Engineer'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-600 font-mono text-xs">—</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenProfile(st)}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                            title="Inspect Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => handleOpenEdit(st)}
                              className="p-1.5 text-slate-400 hover:text-emerald-300 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                              title="Edit Dossier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => setDeleteId(st.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                              title="Purge Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4">
          <Pagination
            page={page}
            pages={pages}
            total={total}
            limit={25}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* STUDENT PROFILE VIEW MODAL */}
      {profileStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl intel-card rounded-3xl shadow-2xl border border-white/[0.12] overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-xl font-editorial italic text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  {profileStudent.full_name[0]}
                </div>
                <div>
                  <div className="editorial-kicker">// CANDIDATE INTELLIGENCE DOSSIER</div>
                  <h3 className="text-xl font-editorial italic text-white font-normal leading-tight">
                    {profileStudent.full_name}
                  </h3>
                  <div className="text-xs text-cyan-300/80 font-mono mt-0.5">
                    {profileStudent.roll_number} • {profileStudent.department} ({profileStudent.degree})
                  </div>
                </div>
              </div>
              <button
                onClick={() => setProfileStudent(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Tabs */}
            <div className="flex items-center px-6 border-b border-white/[0.06] text-xs font-mono bg-slate-950/40">
              {['overview', 'academics', 'skills_projects', 'applications', 'offers'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setProfileTab(tab)}
                  className={`py-3 px-4 border-b-2 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                    profileTab === tab
                      ? 'border-cyan-400 text-cyan-300 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.replace('_', ' & ')}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs font-sans">
              {profileTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-white/[0.06]">
                      <span className="text-[10px] font-mono uppercase text-slate-500">// CGPA</span>
                      <div className="text-xl font-mono-num font-bold text-cyan-300 mt-1">
                        {profileStudent.cgpa}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-white/[0.06]">
                      <span className="text-[10px] font-mono uppercase text-slate-500">// PERCENTAGE</span>
                      <div className="text-xl font-mono-num font-bold text-slate-200 mt-1">
                        {profileStudent.percentage}%
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-white/[0.06]">
                      <span className="text-[10px] font-mono uppercase text-slate-500">// ACTIVE BACKLOGS</span>
                      <div className="text-xl font-mono-num font-bold text-rose-400 mt-1">
                        {profileStudent.active_backlogs}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-white/[0.06]">
                      <span className="text-[10px] font-mono uppercase text-slate-500">// ELIGIBILITY</span>
                      <div className="text-sm font-mono font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                        <span className="phosphor-dot-green" />
                        {profileStudent.placement_eligibility}
                      </div>
                    </div>
                  </div>

                  {/* Eligibility Explanation */}
                  <div className="p-4 bg-cyan-950/20 rounded-2xl border border-cyan-500/20">
                    <h4 className="font-mono text-xs uppercase text-cyan-300 mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      RULES ENGINE EVALUATION AUDIT
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                      {(profileStudent.eligibility_reasons || []).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950/60 rounded-2xl border border-white/[0.06] text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500">// EMAIL</span>
                      <p className="font-mono text-slate-200 mt-0.5">{profileStudent.email}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500">// PHONE</span>
                      <p className="font-mono text-slate-200 mt-0.5">{profileStudent.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500">// ACADEMIC YEAR</span>
                      <p className="font-mono text-slate-200 mt-0.5">{profileStudent.academic_year}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500">// GRADUATION YEAR</span>
                      <p className="font-mono text-slate-200 mt-0.5">{profileStudent.graduation_year}</p>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'academics' && (
                <div className="space-y-4">
                  <h4 className="font-mono text-xs uppercase text-slate-400">// SEMESTER BREAKDOWN</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {profileStudent.semester_marks &&
                      Object.entries(profileStudent.semester_marks).map(([sem, score]) => (
                        <div key={sem} className="p-3 bg-slate-950/60 rounded-xl border border-white/[0.06] text-center">
                          <span className="text-[10px] font-mono uppercase text-slate-500">{sem}</span>
                          <div className="text-base font-mono-num font-bold text-cyan-300 mt-1">{score}</div>
                        </div>
                      ))}
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-white/[0.06]">
                    <span className="font-mono text-xs uppercase text-slate-400">// BACKLOG JOURNAL:</span>
                    <p className="text-slate-300 mt-1 font-mono text-xs">{profileStudent.backlog_history || 'No recorded historical arrears.'}</p>
                  </div>
                </div>
              )}

              {profileTab === 'skills_projects' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono text-xs uppercase text-slate-400 mb-2">// TECHNICAL COMPETENCIES</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(profileStudent.skills || []).map((sk, i) => (
                        <span key={i} className="px-2.5 py-1 bg-cyan-950/40 text-cyan-300 rounded-lg border border-cyan-500/30 font-mono text-xs">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs uppercase text-slate-400 mb-2">// INDUSTRY EXPERIENCE</h4>
                    <p className="text-slate-300 text-xs">
                      {profileStudent.internship_experience ? profileStudent.internship_details || 'Internship completed & verified.' : 'No recorded industrial attachment.'}
                    </p>
                  </div>

                  {profileStudent.resume_link && (
                    <div>
                      <h4 className="font-mono text-xs uppercase text-slate-400 mb-1">// CANDIDATE CV</h4>
                      <a href={profileStudent.resume_link} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline font-mono text-xs flex items-center gap-1">
                        {profileStudent.resume_link} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {profileStudent.custom_fields && Object.keys(profileStudent.custom_fields).length > 0 && (
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-white/[0.06]">
                      <h4 className="font-mono text-xs uppercase text-slate-400 mb-2">// EXTENDED ATTRIBUTES</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(profileStudent.custom_fields).map(([k, v]) => (
                          <div key={k}>
                            <span className="font-mono text-slate-500 text-xs">{k}:</span> <span className="font-mono text-slate-200 text-xs">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {profileTab === 'applications' && (
                <div className="space-y-3">
                  <h4 className="font-mono text-xs uppercase text-slate-400">// RECRUITMENT STAGE TELEMETRY</h4>
                  {profileDetails?.applications?.length === 0 ? (
                    <p className="text-slate-500 font-mono text-xs italic">// No drive enrollments active.</p>
                  ) : (
                    profileDetails?.applications?.map((app) => (
                      <div key={app.id} className="p-3 bg-slate-950/60 rounded-xl border border-white/[0.06] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-medium text-slate-200">{app.company_name} — {app.role_title}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                            {app.status}
                          </span>
                        </div>
                        <p className="text-slate-400 font-mono text-xs">PIPELINE STAGE: <strong className="text-slate-200">{app.current_stage}</strong></p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {profileTab === 'offers' && (
                <div className="space-y-3">
                  <h4 className="font-mono text-xs uppercase text-slate-400">// COMPENSATION & OFFERS</h4>
                  {profileDetails?.offers?.length === 0 ? (
                    <p className="text-slate-500 font-mono text-xs italic">// No formal letters issued yet.</p>
                  ) : (
                    profileDetails?.offers?.map((off) => (
                      <div key={off.id} className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                        <div>
                          <div className="font-serif font-medium text-white">{off.company_name}</div>
                          <div className="text-xs font-mono text-emerald-400">{off.job_role} • ₹{off.ctc_lpa} LPA</div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs uppercase ${off.status === 'Accepted' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-400'}`}>
                          {off.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/80 border-t border-white/[0.06] flex justify-end gap-2">
              {canEdit && (
                <button
                  onClick={() => {
                    setProfileStudent(null);
                    handleOpenEdit(profileStudent);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl font-mono text-xs shadow-xs cursor-pointer"
                >
                  EDIT DOSSIER
                </button>
              )}
              <button
                onClick={() => setProfileStudent(null)}
                className="px-4 py-2 bg-slate-900 text-slate-300 hover:text-white rounded-xl font-mono text-xs cursor-pointer border border-white/[0.08]"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT STUDENT MODAL */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl intel-card rounded-3xl shadow-2xl border border-white/[0.12] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-slate-950/60">
              <div>
                <div className="editorial-kicker">// DOSSIER INGESTION // RECORD MGMT</div>
                <h3 className="text-xl font-editorial italic font-normal text-white">
                  {editingStudent ? `Update Dossier: ${editingStudent.full_name}` : 'Ingest New Student Dossier'}
                </h3>
              </div>
              <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.roll_number}
                    onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Degree</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">CGPA (0 - 10) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-cyan-300 font-semibold focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.active_backlogs}
                    onChange={(e) => setFormData({ ...formData, active_backlogs: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-rose-400 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Total Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.total_backlogs}
                    onChange={(e) => setFormData({ ...formData, total_backlogs: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Technical Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills_text}
                  onChange={(e) => setFormData({ ...formData, skills_text: e.target.value })}
                  placeholder="e.g. Python, Java, React, SQL"
                  className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="internship"
                  checked={formData.internship_experience}
                  onChange={(e) => setFormData({ ...formData, internship_experience: e.target.checked })}
                  className="w-4 h-4 rounded-md accent-cyan-500 cursor-pointer"
                />
                <label htmlFor="internship" className="font-mono text-xs text-slate-300 cursor-pointer">
                  Has Completed Internship Experience
                </label>
              </div>

              {formData.internship_experience && (
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Internship Details</label>
                  <input
                    type="text"
                    value={formData.internship_details}
                    onChange={(e) => setFormData({ ...formData, internship_details: e.target.value })}
                    placeholder="Company name, role, duration"
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Placement Status</label>
                <select
                  value={formData.placement_status}
                  onChange={(e) => setFormData({ ...formData, placement_status: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Unplaced">Unplaced</option>
                  <option value="Placed">Placed</option>
                  <option value="In Process">In Process</option>
                  <option value="Opted Out">Opted Out</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Resume File Link</label>
                <input
                  type="url"
                  value={formData.resume_link}
                  onChange={(e) => setFormData({ ...formData, resume_link: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Remarks</label>
                <textarea
                  rows="2"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="p-4 bg-slate-950/80 border-t border-white/[0.08] -mx-6 -mb-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl font-mono text-xs cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono text-xs font-semibold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.25)] disabled:opacity-50 cursor-pointer"
                >
                  {formSubmitting ? 'SAVING & RECALCULATING...' : editingStudent ? 'UPDATE DOSSIER' : 'INGEST CANDIDATE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK UPDATE MODAL */}
      {bulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md intel-card rounded-3xl shadow-2xl border border-white/[0.12] p-6 space-y-4">
            <div className="editorial-kicker">// BATCH PROCESSING DIRECTIVE</div>
            <h3 className="text-xl font-editorial italic font-normal text-white">
              Bulk Update {selectedIds.length} Dossiers
            </h3>

            <div>
              <label className="block font-mono text-xs text-slate-400 mb-1">
                Update Placement Status
              </label>
              <select
                value={bulkUpdates.placement_status}
                onChange={(e) => setBulkUpdates({ ...bulkUpdates, placement_status: e.target.value })}
                className="w-full p-2.5 bg-slate-950/80 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200"
              >
                <option value="">(No change)</option>
                <option value="Unplaced">Unplaced</option>
                <option value="Placed">Placed</option>
                <option value="In Process">In Process</option>
                <option value="Opted Out">Opted Out</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBulkOpen(false)}
                className="px-4 py-2 bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl font-mono text-xs cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleBulkSubmit}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-mono text-xs font-semibold shadow-xs cursor-pointer"
              >
                APPLY DIRECTIVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Purge Candidate Dossier"
        message="Are you sure you want to remove this student? This operation will soft-delete the student record from active institutional reporting."
        confirmText="Purge Dossier"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
