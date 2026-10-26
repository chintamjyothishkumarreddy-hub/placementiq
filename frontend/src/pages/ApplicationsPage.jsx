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
  User,
  Sparkles
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

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="editorial-kicker">// PIPELINE TELEMETRY // STAGE EVALUATION</div>
          <h2 className="text-2xl font-editorial italic font-normal text-white tracking-tight flex items-center gap-3">
            Candidate Pipeline & Stage Telemetry
            <span className="text-[11px] font-mono not-italic px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
              {applications.length} ENROLLED
            </span>
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Track student interview progression stage-by-stage and record granular assessment feedback.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedDriveId}
            onChange={(e) => setSelectedDriveId(e.target.value)}
            className="py-1.5 px-3 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-300 focus:outline-hidden focus:border-cyan-500/40 cursor-pointer"
          >
            <option value="All">All Drives</option>
            {drives.map((d) => (
              <option key={d.id} value={d.id}>{d.title}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-300 focus:outline-hidden focus:border-cyan-500/40 cursor-pointer"
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
      <div className="intel-card rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-white/[0.08] text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="p-3">CANDIDATE DOSSIER</th>
                <th className="p-3">ENTERPRISE DRIVE</th>
                <th className="p-3">TARGET ROLE</th>
                <th className="p-3">CURRENT STAGE</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">EVALUATION ROUNDS</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-medium text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400 font-mono text-xs">
                    <div className="inline-block w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>// RETRIEVING PIPELINE RECORDS...</p>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500 font-mono text-xs">
                    // ZERO CANDIDATES ENROLLED IN SELECTED STAGE
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3">
                      <div className="font-serif font-medium text-white">
                        {app.student_name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {app.student_roll} • {app.student_department} (CGPA: <span className="text-emerald-400">{app.student_cgpa}</span>)
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-serif font-medium text-slate-200">
                        {app.company_name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate max-w-[160px]">
                        {app.drive_title}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs text-cyan-300">
                      {app.role_title}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 font-mono text-xs border border-cyan-500/30">
                        {app.current_stage_name}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                          app.status === 'Selected'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            : app.status === 'In Interview'
                            ? 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                            : app.status === 'Rejected'
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-900 text-slate-400 border border-white/[0.06]'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        {app.rounds?.length === 0 ? (
                          <span className="text-slate-600 font-mono text-xs italic">// No rounds logged</span>
                        ) : (
                          app.rounds?.map((r, ri) => (
                            <div key={ri} className="flex items-center gap-1.5 text-[11px] font-mono">
                              <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'Cleared' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                              <span className="text-slate-200">{r.round_name}:</span>
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
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.08] rounded-lg font-mono text-[11px] transition-colors cursor-pointer"
                            title="Update Pipeline Stage"
                          >
                            ADVANCE
                          </button>
                          <button
                            onClick={() => handleOpenRound(app)}
                            className="p-1.5 bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer"
                            title="Record Assessment"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md intel-card rounded-3xl shadow-2xl border border-white/[0.12] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="editorial-kicker">// EVALUATION LOG</div>
                <h3 className="text-xl font-editorial italic font-normal text-white">
                  Record Interview Assessment
                </h3>
                <p className="text-xs font-mono text-cyan-300/80">
                  {activeApp.student_name} ({activeApp.student_roll})
                </p>
              </div>
              <button onClick={() => setRoundModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRoundSubmit} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Round Name *</label>
                <input
                  type="text"
                  required
                  value={roundForm.round_name}
                  onChange={(e) => setRoundForm({ ...roundForm, round_name: e.target.value })}
                  placeholder="e.g. Technical Round 1 (DSA & System)"
                  className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Status</label>
                  <select
                    value={roundForm.status}
                    onChange={(e) => setRoundForm({ ...roundForm, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Cleared">Cleared</option>
                    <option value="Failed">Failed</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Absent">Absent</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Score / Rating (0 - 100)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={roundForm.score}
                    onChange={(e) => setRoundForm({ ...roundForm, score: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-cyan-300 font-semibold focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Interviewer Name / Panel</label>
                <input
                  type="text"
                  value={roundForm.interviewer_name}
                  onChange={(e) => setRoundForm({ ...roundForm, interviewer_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Feedback & Observations</label>
                <textarea
                  rows="3"
                  value={roundForm.feedback}
                  onChange={(e) => setRoundForm({ ...roundForm, feedback: e.target.value })}
                  className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRoundModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl font-mono text-xs cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={roundSubmitting}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl font-mono text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {roundSubmitting ? 'SAVING...' : 'RECORD ROUND'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADVANCE STAGE MODAL */}
      {stageModalOpen && activeApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md intel-card rounded-3xl shadow-2xl border border-white/[0.12] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="editorial-kicker">// PIPELINE PROGRESSION</div>
                <h3 className="text-xl font-editorial italic font-normal text-white">
                  Advance Candidate Stage
                </h3>
                <p className="text-xs font-mono text-cyan-300/80">
                  {activeApp.student_name} — {activeApp.company_name}
                </p>
              </div>
              <button onClick={() => setStageModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStageSubmit} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Recruitment Stage</label>
                <select
                  value={targetStageId}
                  onChange={(e) => setTargetStageId(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                >
                  <option value="">Select Stage</option>
                  {drives.find((d) => d.id === activeApp.drive_id)?.stages?.map((s) => (
                    <option key={s.id} value={s.id}>{s.stage_order}. {s.stage_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Application Pipeline Status</label>
                <select
                  value={appStatusUpdate}
                  onChange={(e) => setAppStatusUpdate(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
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
                  className="px-4 py-2 bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl font-mono text-xs cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl font-mono text-xs font-semibold shadow-xs cursor-pointer"
                >
                  SAVE PROGRESSION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
