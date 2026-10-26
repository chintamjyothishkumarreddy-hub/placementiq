import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Calendar,
  Building,
  Users,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  ArrowRight,
  Sliders,
  X,
  ListOrdered,
  MoveUp,
  MoveDown,
  Sparkles
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

export default function DrivesPage() {
  const { role, showToast } = useAuth();
  const canEdit = ['admin', 'placement_officer'].includes(role);
  const canDelete = role === 'admin';

  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drive Modal
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [driveSubmitting, setDriveSubmitting] = useState(false);

  // Stages Modal
  const [stagesModalOpen, setStagesModalOpen] = useState(false);
  const [selectedDriveForStages, setSelectedDriveForStages] = useState(null);
  const [newStageName, setNewStageName] = useState('');

  // Delete
  const [deleteDriveId, setDeleteDriveId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Drive Form
  const defaultDrive = {
    title: '',
    academic_year: '2024-2025',
    company_id: '',
    drive_date: new Date().toISOString().split('T')[0],
    application_deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'Registration Open',
    vacancies: 10,
    eligible_departments: ['CSE', 'IT', 'ECE'],
    graduation_years: [2025],
    min_cgpa: 6.5,
    max_backlogs: 0,
    notes: ''
  };
  const [driveForm, setDriveForm] = useState(defaultDrive);

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const [drivesRes, compRes] = await Promise.all([
        api.get('/drives'),
        api.get('/companies')
      ]);
      setDrives(drivesRes.data);
      setCompanies(compRes.data);
    } catch (err) {
      showToast('Error loading placement drives', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleOpenAddDrive = () => {
    setEditingDrive(null);
    setDriveForm(defaultDrive);
    setDriveModalOpen(true);
  };

  const handleOpenEditDrive = (d) => {
    setEditingDrive(d);
    setDriveForm({
      title: d.title,
      academic_year: d.academic_year,
      company_id: d.company_id,
      drive_date: d.drive_date,
      application_deadline: d.application_deadline || '',
      status: d.status,
      vacancies: d.vacancies,
      eligible_departments: d.eligible_departments || [],
      graduation_years: d.graduation_years || [2025],
      min_cgpa: d.min_cgpa,
      max_backlogs: d.max_backlogs,
      notes: d.notes || ''
    });
    setDriveModalOpen(true);
  };

  const handleDriveSubmit = async (e) => {
    e.preventDefault();
    setDriveSubmitting(true);
    try {
      const payload = {
        title: driveForm.title,
        academic_year: driveForm.academic_year,
        company_id: parseInt(driveForm.company_id, 10),
        drive_date: driveForm.drive_date,
        application_deadline: driveForm.application_deadline || null,
        status: driveForm.status,
        vacancies: parseInt(driveForm.vacancies, 10),
        eligible_departments: driveForm.eligible_departments,
        graduation_years: driveForm.graduation_years,
        min_cgpa: parseFloat(driveForm.min_cgpa),
        max_backlogs: parseInt(driveForm.max_backlogs, 10),
        notes: driveForm.notes || null
      };

      if (editingDrive) {
        await api.put(`/drives/${editingDrive.id}`, payload);
        showToast('Placement drive updated', 'success');
      } else {
        await api.post('/drives', payload);
        showToast('Placement drive created with recruitment pipeline stages', 'success');
      }
      setDriveModalOpen(false);
      fetchDrives();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to save drive', 'error');
    } finally {
      setDriveSubmitting(false);
    }
  };

  const handleDeleteDrive = async () => {
    if (!deleteDriveId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/drives/${deleteDriveId}`);
      showToast('Placement drive deleted', 'success');
      setDeleteDriveId(null);
      fetchDrives();
    } catch (err) {
      showToast('Failed to delete drive', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenStages = (drive) => {
    setSelectedDriveForStages(drive);
    setStagesModalOpen(true);
  };

  const handleAddStage = async (e) => {
    e.preventDefault();
    if (!newStageName.trim() || !selectedDriveForStages) return;
    try {
      await api.post(`/drives/${selectedDriveForStages.id}/stages`, {
        stage_name: newStageName.trim(),
        stage_order: (selectedDriveForStages.stages?.length || 0) + 1,
        is_mandatory: true,
        is_active: true
      });
      showToast('Recruitment stage added', 'success');
      setNewStageName('');
      // refresh
      const res = await api.get(`/drives/${selectedDriveForStages.id}`);
      setSelectedDriveForStages(res.data);
      fetchDrives();
    } catch (err) {
      showToast('Failed to add stage', 'error');
    }
  };

  const handleDeleteStage = async (stageId) => {
    try {
      await api.delete(`/drives/stages/${stageId}`);
      showToast('Stage removed', 'success');
      const res = await api.get(`/drives/${selectedDriveForStages.id}`);
      setSelectedDriveForStages(res.data);
      fetchDrives();
    } catch (err) {
      showToast('Failed to remove stage', 'error');
    }
  };

  const handleDeptToggle = (dept) => {
    const cur = driveForm.eligible_departments;
    if (cur.includes(dept)) setDriveForm({ ...driveForm, eligible_departments: cur.filter((d) => d !== dept) });
    else setDriveForm({ ...driveForm, eligible_departments: [...cur, dept] });
  };

  const statusStyles = {
    'Registration Open': 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30',
    'In Progress': 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30',
    'Upcoming': 'bg-amber-950/60 text-amber-300 border border-amber-500/30',
    'Completed': 'bg-slate-900 text-slate-400 border border-white/[0.06]',
    'Cancelled': 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="editorial-kicker">// RECRUITMENT CAMPAIGNS // PIPELINE GOVERNANCE</div>
          <h2 className="text-2xl font-editorial italic font-normal text-white tracking-tight flex items-center gap-3">
            Recruitment Drives & Evaluation Pipelines
            <span className="text-[11px] font-mono not-italic px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
              {drives.length} CAMPAIGNS
            </span>
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Organize recruitment schedules, vacancies, and configure custom multi-stage interview pipelines.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAddDrive}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-mono font-medium rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>SCHEDULE DRIVE</span>
          </button>
        )}
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-500 font-mono text-xs">
            // RETRIEVING RECRUITMENT CAMPAIGNS...
          </div>
        ) : drives.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 intel-card rounded-3xl border border-white/[0.08] font-mono text-xs">
            // NO ACTIVE CAMPAIGNS CURRENTLY SCHEDULED
          </div>
        ) : (
          drives.map((drive) => (
            <div
              key={drive.id}
              className="intel-card rounded-3xl p-6 border border-white/[0.08] flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="editorial-kicker">
                      // {drive.company_name}
                    </span>
                    <h3 className="text-lg font-serif font-medium text-white mt-0.5">
                      {drive.title}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${statusStyles[drive.status] || 'bg-slate-900 text-slate-400'}`}>
                    {drive.status}
                  </span>
                </div>

                {/* Key metadata dock */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 p-3.5 bg-slate-950/60 rounded-2xl border border-white/[0.06] text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500">// DATE</span>
                    <p className="font-mono text-xs text-slate-200 mt-0.5">{drive.drive_date}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500">// DEADLINE</span>
                    <p className="font-mono text-xs text-slate-200 mt-0.5">{drive.application_deadline || 'Open'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500">// VACANCIES</span>
                    <p className="font-mono-num font-bold text-cyan-300 mt-0.5">{drive.vacancies}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500">// MIN CGPA</span>
                    <p className="font-mono-num font-bold text-emerald-400 mt-0.5">{drive.min_cgpa.toFixed(1)}</p>
                  </div>
                </div>

                {/* Pipeline Stages Display */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>// EVALUATION PIPELINE:</span>
                    <button
                      onClick={() => handleOpenStages(drive)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-xs transition-colors cursor-pointer"
                    >
                      <ListOrdered className="w-3.5 h-3.5" /> CONFIGURE STAGES
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {(drive.stages || []).map((stg, i) => (
                      <React.Fragment key={stg.id}>
                        <span className="px-2.5 py-1 bg-slate-900 border border-white/[0.08] rounded-lg text-slate-300 font-mono text-[11px]">
                          {stg.stage_name}
                        </span>
                        {i < (drive.stages?.length || 0) - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">ACADEMIC YEAR: {drive.academic_year}</span>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <button
                      onClick={() => handleOpenEditDrive(drive)}
                      className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                      title="Edit Campaign"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => setDeleteDriveId(drive.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                      title="Purge Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* STAGES CONFIGURATION MODAL */}
      {stagesModalOpen && selectedDriveForStages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg intel-card rounded-3xl shadow-2xl border border-white/[0.12] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="editorial-kicker">// PIPELINE ARCHITECTURE</div>
                <h3 className="text-xl font-editorial italic font-normal text-white">
                  Configure Recruitment Pipeline
                </h3>
                <p className="text-xs font-mono text-cyan-300/80">{selectedDriveForStages.title}</p>
              </div>
              <button onClick={() => setStagesModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stages List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(selectedDriveForStages.stages || []).map((stage, idx) => (
                <div
                  key={stage.id}
                  className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-white/[0.06] text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200">{stage.stage_name}</span>
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => handleDeleteStage(stage.id)}
                      className="text-rose-400 hover:text-rose-300 text-[11px] font-mono transition-colors cursor-pointer"
                    >
                      REMOVE
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Stage Form */}
            {canEdit && (
              <form onSubmit={handleAddStage} className="flex gap-2 pt-2 border-t border-white/[0.06]">
                <input
                  type="text"
                  placeholder="New Stage (e.g. Technical Coding Round)"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  className="flex-1 p-2 bg-slate-950/60 border border-white/[0.08] rounded-xl text-xs font-mono text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-mono font-medium shadow-xs cursor-pointer"
                >
                  ADD STAGE
                </button>
              </form>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStagesModalOpen(false)}
                className="px-4 py-2 bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl text-xs font-mono cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT DRIVE MODAL */}
      {driveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl intel-card rounded-3xl shadow-2xl border border-white/[0.12] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <div className="editorial-kicker">// CAMPAIGN SCHEDULER</div>
                <h3 className="text-xl font-editorial italic font-normal text-white">
                  {editingDrive ? 'Update Recruitment Campaign' : 'Schedule Recruitment Drive'}
                </h3>
              </div>
              <button onClick={() => setDriveModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDriveSubmit} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Drive Title *</label>
                <input
                  type="text"
                  required
                  value={driveForm.title}
                  onChange={(e) => setDriveForm({ ...driveForm, title: e.target.value })}
                  placeholder="e.g. Microsoft Campus Drive 2025"
                  className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Partner *</label>
                  <select
                    required
                    value={driveForm.company_id}
                    onChange={(e) => setDriveForm({ ...driveForm, company_id: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="">Select Company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={driveForm.academic_year}
                    onChange={(e) => setDriveForm({ ...driveForm, academic_year: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Drive Date *</label>
                  <input
                    type="date"
                    required
                    value={driveForm.drive_date}
                    onChange={(e) => setDriveForm({ ...driveForm, drive_date: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={driveForm.application_deadline}
                    onChange={(e) => setDriveForm({ ...driveForm, application_deadline: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Status</label>
                  <select
                    value={driveForm.status}
                    onChange={(e) => setDriveForm({ ...driveForm, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Registration Open">Registration Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Vacancies</label>
                  <input
                    type="number"
                    value={driveForm.vacancies}
                    onChange={(e) => setDriveForm({ ...driveForm, vacancies: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-cyan-300 font-semibold focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={driveForm.min_cgpa}
                    onChange={(e) => setDriveForm({ ...driveForm, min_cgpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-emerald-400 font-semibold focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1.5">Eligible Branches</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'].map((dept) => {
                    const sel = driveForm.eligible_departments.includes(dept);
                    return (
                      <button
                        type="button"
                        key={dept}
                        onClick={() => handleDeptToggle(dept)}
                        className={`p-2 rounded-xl text-center font-mono text-xs border transition-all cursor-pointer ${
                          sel ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'bg-slate-900 border-white/[0.06] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {dept}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setDriveModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl font-mono text-xs cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={driveSubmitting}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl font-mono text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {driveSubmitting ? 'SCHEDULING...' : editingDrive ? 'UPDATE DRIVE' : 'SCHEDULE DRIVE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteDriveId}
        title="Purge Placement Drive"
        message="Are you sure you want to remove this placement drive? Associated applications will be deleted from active pipeline."
        confirmText="Purge Drive"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteDrive}
        onClose={() => setDeleteDriveId(null)}
      />
    </div>
  );
}
