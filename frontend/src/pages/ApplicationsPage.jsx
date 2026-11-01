import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Plus,
  MessageSquare,
  Award,
  ChevronRight,
  X,
  User
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function ApplicationsPage() {
  const { role, showToast } = useAuth();
  const canEdit = ['admin', 'placement_officer'].includes(role);

  const [applications, setApplications] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDriveId, setSelectedDriveId] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [activeApp, setActiveApp] = useState(null);
  const [roundModalOpen, setRoundModalOpen] = useState(false);
  const [roundSubmitting, setRoundSubmitting] = useState(false);
  const [roundForm, setRoundForm] = useState({
    round_name: 'Technical Interview 1',
    interviewer_name: 'Tech Panel',
    status: 'Cleared',
    score: 85.0,
    feedback: 'Excellent problem solving and core domain understanding.'
  });

  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [targetStageId, setTargetStageId] = useState('');
  const [appStatusUpdate, setAppStatusUpdate] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedDriveId !== 'All') params.drive_id = selectedDriveId;
      if (statusFilter !== 'All') params.status = statusFilter;

      const [appsRes, drivesRes] = await Promise.all([
        api.get('/applications', { params }),
        api.get('/drives')
      ]);
      setApplications(appsRes.data);
      setDrives(drivesRes.data);
    } catch (err) {
      showToast('Error loading application tracker', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedDriveId, statusFilter]);

  const handleOpenRound = (app) => {
    setActiveApp(app);
    setRoundModalOpen(true);
  };

  const handleRoundSubmit = async (e) => {
    e.preventDefault();
    if (!activeApp) return;
    setRoundSubmitting(true);
    try {
      await api.post(`/applications/${activeApp.id}/rounds`, {
        round_name: roundForm.round_name,
        interviewer_name: roundForm.interviewer_name,
        status: roundForm.status,
        score: parseFloat(roundForm.score),
        feedback: roundForm.feedback
      });
      showToast('Interview round recorded successfully', 'success');
      setRoundModalOpen(false);
      fetchApplications();
    } catch (err) {
      showToast('Failed to log interview round', 'error');
    } finally {
      setRoundSubmitting(false);
    }
  };

  const handleOpenStageUpdate = (app) => {
    setActiveApp(app);
    setTargetStageId(app.current_stage_id || '');
    setAppStatusUpdate(app.status);
    setStageModalOpen(true);
  };

  const handleStageSubmit = async (e) => {
    e.preventDefault();
    if (!activeApp) return;
    try {
      await api.put(`/applications/${activeApp.id}`, {
        current_stage_id: targetStageId ? parseInt(targetStageId, 10) : null,
        status: appStatusUpdate
      });
      showToast('Application status and pipeline stage updated', 'success');
      setStageModalOpen(false);
      fetchApplications();
    } catch (err) {
      showToast('Failed to update stage', 'error');
    }
  };

  const currentDriveObj = drives.find((d) => d.id === parseInt(selectedDriveId, 10));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Applications & Recruitment Pipeline Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track student interview progression stage-by-stage and record assessment feedback.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedDriveId}
            onChange={(e) => setSelectedDriveId(e.target.value)}
            className="py-1.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold shadow-2xs focus:outline-hidden"
          >
            <option value="All">All Drives</option>
            {drives.map((d) => (
              <option key={d.id} value={d.id}>{d.title}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold shadow-2xs focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="In Interview">In Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-3">Student Candidate</th>
                <th className="p-3">Company & Drive</th>
                <th className="p-3">Target Role</th>
                <th className="p-3">Current Stage</th>
                <th className="p-3">Status</th>
                <th className="p-3">Interview Rounds</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400">
                    Loading application pipeline records...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400">
                    No student applications matching the selected criteria.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {app.student_name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {app.student_roll} • {app.student_department} (CGPA: {app.student_cgpa})
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {app.company_name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {app.drive_title}
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                      {app.role_title}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900/40">
                        {app.current_stage_name}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          app.status === 'Selected'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : app.status === 'In Interview'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                            : app.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        {app.rounds?.length === 0 ? (
                          <span className="text-slate-400 italic">No rounds logged</span>
                        ) : (
                          app.rounds?.map((r, ri) => (
                            <div key={ri} className="flex items-center gap-1.5 text-[11px]">
                              <span className={`w-2 h-2 rounded-full ${r.status === 'Cleared' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{r.round_name}:</span>
                              <span className="text-slate-500">{r.status} {r.score ? `(${r.score}/100)` : ''}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      {canEdit && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenStageUpdate(app)}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold text-[11px] transition-colors"
                            title="Update Pipeline Stage"
                          >
                            Advance Stage
                          </button>
                          <button
                            onClick={() => handleOpenRound(app)}
                            className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Record Interview Assessment"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD INTERVIEW ROUND MODAL */}
      {roundModalOpen && activeApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Record Interview Round Assessment
                </h3>
                <p className="text-xs text-slate-400">
                  {activeApp.student_name} ({activeApp.student_roll})
                </p>
              </div>
              <button onClick={() => setRoundModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRoundSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Round Name *</label>
                <input
                  type="text"
                  required
                  value={roundForm.round_name}
                  onChange={(e) => setRoundForm({ ...roundForm, round_name: e.target.value })}
                  placeholder="e.g. Technical Round 1 (DSA & System)"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={roundForm.status}
                    onChange={(e) => setRoundForm({ ...roundForm, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  >
                    <option value="Cleared">Cleared</option>
                    <option value="Failed">Failed</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Absent">Absent</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Score / Rating (0 - 100)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={roundForm.score}
                    onChange={(e) => setRoundForm({ ...roundForm, score: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Interviewer Name / Panel</label>
                <input
                  type="text"
                  value={roundForm.interviewer_name}
                  onChange={(e) => setRoundForm({ ...roundForm, interviewer_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Feedback & Observations</label>
                <textarea
                  rows="3"
                  value={roundForm.feedback}
                  onChange={(e) => setRoundForm({ ...roundForm, feedback: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRoundModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={roundSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  {roundSubmitting ? 'Saving...' : 'Record Round'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADVANCE STAGE MODAL */}
      {stageModalOpen && activeApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Update Candidate Pipeline Stage
                </h3>
                <p className="text-xs text-slate-400">
                  {activeApp.student_name} - {activeApp.company_name}
                </p>
              </div>
              <button onClick={() => setStageModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStageSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Recruitment Stage</label>
                <select
                  value={targetStageId}
                  onChange={(e) => setTargetStageId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                >
                  <option value="">Select Stage</option>
                  {drives.find((d) => d.id === activeApp.drive_id)?.stages?.map((s) => (
                    <option key={s.id} value={s.id}>{s.stage_order}. {s.stage_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Overall Application Status</label>
                <select
                  value={appStatusUpdate}
                  onChange={(e) => setAppStatusUpdate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                >
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Interview">In Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStageModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Progression
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
