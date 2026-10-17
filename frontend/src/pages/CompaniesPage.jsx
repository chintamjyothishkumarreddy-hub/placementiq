import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Plus,
  Briefcase,
  Edit,
  Trash2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Download,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  DollarSign
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

export default function CompaniesPage() {
  const { role, showToast } = useAuth();
  const canEdit = ['admin', 'placement_officer'].includes(role);
  const canDelete = role === 'admin';

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');

  // Expanded cards for roles
  const [expandedId, setExpandedId] = useState(null);

  // Modals
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [companySubmitting, setCompanySubmitting] = useState(false);

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [targetCompanyId, setTargetCompanyId] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [roleSubmitting, setRoleSubmitting] = useState(false);

  const [deleteCompanyId, setDeleteCompanyId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Default Company Form
  const defaultCompany = {
    name: '',
    industry: 'Software & Technology',
    website: '',
    hr_name: '',
    hr_email: '',
    hr_phone: '',
    job_locations: 'PAN India',
    work_arrangement: 'Hybrid',
    status: 'Active',
    notes: ''
  };
  const [companyForm, setCompanyForm] = useState(defaultCompany);

  // Default Role Form
  const defaultRole = {
    role_title: '',
    job_description: '',
    min_package_lpa: 6.0,
    max_package_lpa: 10.0,
    currency: 'INR',
    job_location: 'PAN India',
    work_arrangement: 'Onsite',
    vacancies: 5,
    eligible_departments: ['CSE', 'IT', 'ECE'],
    min_cgpa: 7.0,
    max_backlogs: 0,
    required_skills_text: 'Python, SQL',
    internship_required: false
  };
  const [roleForm, setRoleForm] = useState(defaultRole);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'All') params.status = statusFilter;
      if (industryFilter !== 'All') params.industry = industryFilter;

      const res = await api.get('/companies', { params });
      setCompanies(res.data);
    } catch (err) {
      showToast('Error loading companies', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [statusFilter, industryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  const handleOpenAddCompany = () => {
    setEditingCompany(null);
    setCompanyForm(defaultCompany);
    setCompanyModalOpen(true);
  };

  const handleOpenEditCompany = (c) => {
    setEditingCompany(c);
    setCompanyForm({
      name: c.name,
      industry: c.industry || '',
      website: c.website || '',
      hr_name: c.hr_name || '',
      hr_email: c.hr_email || '',
      hr_phone: c.hr_phone || '',
      job_locations: c.job_locations || 'PAN India',
      work_arrangement: c.work_arrangement || 'Onsite',
      status: c.status,
      notes: c.notes || ''
    });
    setCompanyModalOpen(true);
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setCompanySubmitting(true);
    try {
      if (editingCompany) {
        await api.put(`/companies/${editingCompany.id}`, companyForm);
        showToast(`Company ${companyForm.name} updated successfully`, 'success');
      } else {
        await api.post('/companies', companyForm);
        showToast(`Company ${companyForm.name} added successfully`, 'success');
      }
      setCompanyModalOpen(false);
      fetchCompanies();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to save company record', 'error');
    } finally {
      setCompanySubmitting(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!deleteCompanyId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/companies/${deleteCompanyId}`);
      showToast('Company deleted successfully', 'success');
      setDeleteCompanyId(null);
      fetchCompanies();
    } catch (err) {
      showToast('Failed to delete company', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenAddRole = (compId) => {
    setTargetCompanyId(compId);
    setEditingRole(null);
    setRoleForm(defaultRole);
    setRoleModalOpen(true);
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setRoleSubmitting(true);
    try {
      const skillsArray = roleForm.required_skills_text
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        role_title: roleForm.role_title,
        job_description: roleForm.job_description,
        min_package_lpa: parseFloat(roleForm.min_package_lpa),
        max_package_lpa: parseFloat(roleForm.max_package_lpa),
        currency: roleForm.currency,
        job_location: roleForm.job_location,
        work_arrangement: roleForm.work_arrangement,
        vacancies: parseInt(roleForm.vacancies, 10),
        eligible_departments: roleForm.eligible_departments,
        min_cgpa: parseFloat(roleForm.min_cgpa),
        max_backlogs: parseInt(roleForm.max_backlogs, 10),
        required_skills: skillsArray,
        internship_required: roleForm.internship_required
      };

      if (editingRole) {
        await api.put(`/companies/roles/${editingRole.id}`, payload);
        showToast('Job role updated', 'success');
      } else {
        await api.post(`/companies/${targetCompanyId}/roles`, payload);
        showToast('Job role added to company', 'success');
      }
      setRoleModalOpen(false);
      fetchCompanies();
    } catch (err) {
      showToast('Failed to save job role', 'error');
    } finally {
      setRoleSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await api.delete(`/companies/roles/${roleId}`);
      showToast('Job role removed', 'success');
      fetchCompanies();
    } catch (err) {
      showToast('Failed to delete role', 'error');
    }
  };

  const handleExport = (fmt = 'csv') => {
    window.open(`/api/import-export/export/companies?format=${fmt}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Company & Job Role Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Maintain recruiting partners, compensation packages, and position requirements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canEdit && (
            <button
              onClick={handleOpenAddCompany}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Company</span>
            </button>
          )}

          <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
            <button
              onClick={() => handleExport('csv')}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Excel
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company by name, industry, location..."
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
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Companies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400">Loading companies...</div>
        ) : companies.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            No company records found.
          </div>
        ) : (
          companies.map((comp) => {
            const isExpanded = expandedId === comp.id;
            return (
              <div
                key={comp.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                        {comp.name[0]}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                          {comp.name}
                        </h3>
                        <span className="text-xs text-slate-400">{comp.industry || 'Industry'}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        comp.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </div>

                  {/* Contact info grid */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 my-4">
                    {comp.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <a
                          href={comp.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {comp.website}
                        </a>
                      </div>
                    )}
                    {comp.hr_name && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {comp.hr_name} ({comp.hr_email || 'No email'})
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{comp.job_locations} • {comp.work_arrangement}</span>
                    </div>
                  </div>

                  {/* Job Roles Section Toggle */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : comp.id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>
                        {comp.job_roles?.length || 0} Open Job Roles & Packages
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-2.5 animate-fade-in">
                        {comp.job_roles?.map((r) => (
                          <div
                            key={r.id}
                            className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {r.role_title}
                              </span>
                              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                ₹{r.min_package_lpa} - ₹{r.max_package_lpa} LPA
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1">
                              Cutoff: Min CGPA {r.min_cgpa} • Max Backlogs: {r.max_backlogs} • Vacancies: {r.vacancies}
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-700/40 text-[11px]">
                              <span className="text-slate-400">Branches: {r.eligible_departments?.join(', ') || 'All'}</span>
                              {canEdit && (
                                <button
                                  onClick={() => handleDeleteRole(r.id)}
                                  className="text-rose-500 hover:underline"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {canEdit && (
                          <button
                            onClick={() => handleOpenAddRole(comp.id)}
                            className="w-full py-2 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-dashed border-blue-300 dark:border-blue-800"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Job Role
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">ID: #{comp.id}</span>
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <button
                        onClick={() => handleOpenEditCompany(comp)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Company"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => setDeleteCompanyId(comp.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Company"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT COMPANY MODAL */}
      {companyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingCompany ? 'Edit Company Record' : 'Register New Company'}
              </h3>
              <button onClick={() => setCompanyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCompanySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Industry</label>
                  <input
                    type="text"
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={companyForm.status}
                    onChange={(e) => setCompanyForm({ ...companyForm, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  >
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Website URL</label>
                <input
                  type="url"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">HR / Recruiter Name</label>
                  <input
                    type="text"
                    value={companyForm.hr_name}
                    onChange={(e) => setCompanyForm({ ...companyForm, hr_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">HR Email</label>
                  <input
                    type="email"
                    value={companyForm.hr_email}
                    onChange={(e) => setCompanyForm({ ...companyForm, hr_email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Locations</label>
                  <input
                    type="text"
                    value={companyForm.job_locations}
                    onChange={(e) => setCompanyForm({ ...companyForm, job_locations: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Work Arrangement</label>
                  <select
                    value={companyForm.work_arrangement}
                    onChange={(e) => setCompanyForm({ ...companyForm, work_arrangement: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  >
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCompanyModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={companySubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  {companySubmitting ? 'Saving...' : editingCompany ? 'Update Company' : 'Add Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD JOB ROLE MODAL */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Add Job Role & Package
              </h3>
              <button onClick={() => setRoleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRoleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={roleForm.role_title}
                  onChange={(e) => setRoleForm({ ...roleForm, role_title: e.target.value })}
                  placeholder="e.g. Associate Software Engineer"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Min Package (LPA) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={roleForm.min_package_lpa}
                    onChange={(e) => setRoleForm({ ...roleForm, min_package_lpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Max Package (LPA) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={roleForm.max_package_lpa}
                    onChange={(e) => setRoleForm({ ...roleForm, max_package_lpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Min CGPA Cutoff</label>
                  <input
                    type="number"
                    step="0.05"
                    value={roleForm.min_cgpa}
                    onChange={(e) => setRoleForm({ ...roleForm, min_cgpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Max Allowed Backlogs</label>
                  <input
                    type="number"
                    value={roleForm.max_backlogs}
                    onChange={(e) => setRoleForm({ ...roleForm, max_backlogs: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Required Skills</label>
                <input
                  type="text"
                  value={roleForm.required_skills_text}
                  onChange={(e) => setRoleForm({ ...roleForm, required_skills_text: e.target.value })}
                  placeholder="e.g. Java, Spring, React"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setRoleModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={roleSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  {roleSubmitting ? 'Saving...' : 'Add Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteCompanyId}
        title="Delete Company Record"
        message="Are you sure you want to delete this company? Historical placement offers will remain preserved."
        confirmText="Delete Company"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteCompany}
        onClose={() => setDeleteCompanyId(null)}
      />
    </div>
  );
}
