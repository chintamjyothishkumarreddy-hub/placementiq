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
  FileText
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
      const res = await api.post('/students/recalculate-all');
      showToast(`Recalculated! ${JSON.stringify(res.data.results)}`, 'success');
      fetchStudents();
    } catch (err) {
      showToast('Recalculation failed', 'error');
    }
  };

  const handleBulkSubmit = async () => {
    if (!selectedIds.length) return;
    const updates = {};
    if (bulkUpdates.placement_status) updates.placement_status = bulkUpdates.placement_status;
    if (bulkUpdates.department) updates.department = bulkUpdates.department;

    if (!Object.keys(updates).length) {
      showToast('No fields chosen to update', 'warning');
      return;
    }

    try {
      await api.post('/students/bulk-update', { student_ids: selectedIds, updates });
      showToast(`Bulk updated ${selectedIds.length} students`, 'success');
      setSelectedIds([]);
      setBulkOpen(false);
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
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Student Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            View, add, edit, filter, and track all student academic & placement profiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {canEdit && (
            <>
              <button
                onClick={handleRecalculateAll}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                title="Recalculate placement eligibility across all students using current active rules"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recalculate All</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            </>
          )}

          <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
            <button
              onClick={() => handleExport('csv')}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1"
              title="Export as CSV"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1"
              title="Export as Excel"
            >
              <Download className="w-3.5 h-3.5" /> Excel
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by roll number, name, email, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-blue-500"
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
              className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-hidden"
            >
              <option value="All">All Depts</option>
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
              className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-hidden"
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
              className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-hidden"
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
          <div className="flex items-center justify-between p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 rounded-xl animate-fade-in text-xs">
            <span className="font-semibold text-blue-700 dark:text-blue-300">
              {selectedIds.length} students selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBulkOpen(true)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-2xs"
              >
                Bulk Update Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Students Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                {canEdit && (
                  <th className="p-3 w-10 text-center">
                    <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-600">
                      {selectedIds.length === students.length && students.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                )}
                <th className="p-3">Roll No.</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Dept</th>
                <th className="p-3 text-center">CGPA</th>
                <th className="p-3 text-center">Backlogs</th>
                <th className="p-3">Eligibility</th>
                <th className="p-3">Status</th>
                <th className="p-3">Company / Role</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={canEdit ? 10 : 9} className="p-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading student records...</p>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 10 : 9} className="p-12 text-center text-slate-400">
                    No student records found matching filter criteria.
                  </td>
                </tr>
              ) : (
                students.map((st) => {
                  const isSelected = selectedIds.includes(st.id);
                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      {canEdit && (
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleSelect(st.id)}
                            className="text-slate-400 hover:text-blue-600"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      )}
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                        {st.roll_number}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {st.full_name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal">{st.email}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                          {st.department}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-900 dark:text-white">
                        {st.cgpa.toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        {st.active_backlogs > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                            {st.active_backlogs} Active
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="p-3">
                        {st.placement_eligibility === 'Eligible' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                            <CheckCircle className="w-3 h-3" /> Eligible
                          </span>
                        )}
                        {st.placement_eligibility === 'Not Eligible' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40">
                            <XCircle className="w-3 h-3" /> Not Eligible
                          </span>
                        )}
                        {st.placement_eligibility === 'Needs Review' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                            <AlertCircle className="w-3 h-3" /> Review
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            st.placement_status === 'Placed'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                              : st.placement_status === 'In Process'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {st.placement_status}
                        </span>
                      </td>
                      <td className="p-3">
                        {st.selected_company_name ? (
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {st.selected_company_name}
                            </div>
                            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                              ₹{st.offered_package_lpa} LPA • {st.job_role || 'Engineer'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenProfile(st)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => handleOpenEdit(st)}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                              title="Edit Student Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => setDeleteId(st.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                              title="Delete Student"
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
        <div className="px-4 border-t border-slate-200 dark:border-slate-800">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl font-black">
                  {profileStudent.full_name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold leading-tight">{profileStudent.full_name}</h3>
                  <div className="text-xs text-blue-100 font-mono mt-0.5">
                    {profileStudent.roll_number} • {profileStudent.department} ({profileStudent.degree})
                  </div>
                </div>
              </div>
              <button
                onClick={() => setProfileStudent(null)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Tabs */}
            <div className="flex items-center px-6 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
              {['overview', 'academics', 'skills_projects', 'applications', 'offers'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setProfileTab(tab)}
                  className={`py-3 px-4 border-b-2 font-bold capitalize transition-colors ${
                    profileTab === tab
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.replace('_', ' & ')}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {profileTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[11px] text-slate-400">CGPA</span>
                      <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {profileStudent.cgpa}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[11px] text-slate-400">Percentage</span>
                      <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {profileStudent.percentage}%
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[11px] text-slate-400">Active Backlogs</span>
                      <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {profileStudent.active_backlogs}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[11px] text-slate-400">Eligibility</span>
                      <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        {profileStudent.placement_eligibility}
                      </div>
                    </div>
                  </div>

                  {/* Eligibility Explanation */}
                  <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200/60 dark:border-blue-900/40">
                    <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      Current Rules Engine Evaluation
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                      {(profileStudent.eligibility_reasons || []).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                    <div>
                      <span className="text-[11px] text-slate-400">Email Address</span>
                      <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{profileStudent.email}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400">Phone Number</span>
                      <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{profileStudent.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400">Academic Year</span>
                      <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{profileStudent.academic_year}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400">Graduation Year</span>
                      <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{profileStudent.graduation_year}</p>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'academics' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Semester-wise Breakdown</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {profileStudent.semester_marks &&
                      Object.entries(profileStudent.semester_marks).map(([sem, score]) => (
                        <div key={sem} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                          <span className="text-[11px] uppercase font-bold text-slate-400">{sem}</span>
                          <div className="text-base font-black text-slate-900 dark:text-white mt-1">{score}</div>
                        </div>
                      ))}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Backlog History:</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">{profileStudent.backlog_history || 'No recorded backlog history.'}</p>
                  </div>
                </div>
              )}

              {profileTab === 'skills_projects' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Technical Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(profileStudent.skills || []).map((sk, i) => (
                        <span key={i} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-900/40 font-semibold">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Internship Experience</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      {profileStudent.internship_experience ? profileStudent.internship_details || 'Internship confirmed.' : 'No internship completed.'}
                    </p>
                  </div>

                  {profileStudent.resume_link && (
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Resume Link</h4>
                      <a href={profileStudent.resume_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        {profileStudent.resume_link}
                      </a>
                    </div>
                  )}

                  {profileStudent.custom_fields && Object.keys(profileStudent.custom_fields).length > 0 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Custom Fields</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(profileStudent.custom_fields).map(([k, v]) => (
                          <div key={k}>
                            <span className="text-[11px] text-slate-400">{k}:</span> <span className="font-semibold text-slate-800 dark:text-slate-200">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {profileTab === 'applications' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Drive Applications & Interviews</h4>
                  {profileDetails?.applications?.length === 0 ? (
                    <p className="text-slate-400 italic">No applications recorded for this student yet.</p>
                  ) : (
                    profileDetails?.applications?.map((app) => (
                      <div key={app.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-slate-100">{app.company_name} - {app.role_title}</span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            {app.status}
                          </span>
                        </div>
                        <p className="text-slate-500">Stage: <strong className="text-slate-700 dark:text-slate-300">{app.current_stage}</strong></p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {profileTab === 'offers' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Job Offers Received</h4>
                  {profileDetails?.offers?.length === 0 ? (
                    <p className="text-slate-400 italic">No offers received yet.</p>
                  ) : (
                    profileDetails?.offers?.map((off) => (
                      <div key={off.id} className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{off.company_name}</div>
                          <div className="text-xs text-slate-500">{off.job_role} • ₹{off.ctc_lpa} LPA</div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold ${off.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                          {off.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              {canEdit && (
                <button
                  onClick={() => {
                    setProfileStudent(null);
                    handleOpenEdit(profileStudent);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={() => setProfileStudent(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT STUDENT MODAL */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingStudent ? `Edit Student: ${editingStudent.full_name}` : 'Add New Student Record'}
              </h3>
              <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.roll_number}
                    onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
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
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">CGPA (0 - 10) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.active_backlogs}
                    onChange={(e) => setFormData({ ...formData, active_backlogs: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.total_backlogs}
                    onChange={(e) => setFormData({ ...formData, total_backlogs: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Technical Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills_text}
                  onChange={(e) => setFormData({ ...formData, skills_text: e.target.value })}
                  placeholder="e.g. Python, Java, React, SQL"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="internship"
                  checked={formData.internship_experience}
                  onChange={(e) => setFormData({ ...formData, internship_experience: e.target.checked })}
                  className="w-4 h-4 rounded-md text-blue-600 focus:ring-0"
                />
                <label htmlFor="internship" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Has Completed Internship Experience
                </label>
              </div>

              {formData.internship_experience && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Internship Details</label>
                  <input
                    type="text"
                    value={formData.internship_details}
                    onChange={(e) => setFormData({ ...formData, internship_details: e.target.value })}
                    placeholder="Company name, role, duration"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Placement Status</label>
                <select
                  value={formData.placement_status}
                  onChange={(e) => setFormData({ ...formData, placement_status: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                >
                  <option value="Unplaced">Unplaced</option>
                  <option value="Placed">Placed</option>
                  <option value="In Process">In Process</option>
                  <option value="Opted Out">Opted Out</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Resume File Link</label>
                <input
                  type="url"
                  value={formData.resume_link}
                  onChange={(e) => setFormData({ ...formData, resume_link: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Remarks</label>
                <textarea
                  rows="2"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 -mx-6 -mb-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving & Recalculating...' : editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK UPDATE MODAL */}
      {bulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Bulk Update {selectedIds.length} Students
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                Update Placement Status
              </label>
              <select
                value={bulkUpdates.placement_status}
                onChange={(e) => setBulkUpdates({ ...bulkUpdates, placement_status: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
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
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Apply Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Student Record"
        message="Are you sure you want to remove this student? This operation will soft-delete the student record from active reporting."
        confirmText="Delete Student"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
