import React, { useState, useEffect, useCallback } from 'react';
import {
  History,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  Activity,
  X,
  FileCode
} from 'lucide-react';
import api, { getErrorMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import { TableSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function AuditLogsPage() {
  const { showToast } = useAuth();
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Filters
  const [entityType, setEntityType] = useState('All');
  const [action, setAction] = useState('All');
  const [username, setUsername] = useState('');

  // Inspect Modal
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const params = { page, limit: 30 };
      if (entityType !== 'All') params.entity_type = entityType;
      if (action !== 'All') params.action = action;
      if (username.trim()) params.username = username.trim();

      const res = await api.get('/audit-logs', { params });
      setLogs(res.data.data);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      const msg = getErrorMessage(err, 'Error loading audit log records');
      setFetchError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [page, entityType, action, username, showToast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const actionStyles = {
    CREATE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
    UPDATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    DELETE: 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300',
    IMPORT: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    BULK_UPDATE: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
    RECALCULATE: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
  };

  return (
    <div className="space-y-6">
      {/* Studio Hero Command Bar */}
      <div className="apple-gloss-tile p-6 sm:p-7 rounded-[28px] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#0071e3]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 liquid-pill text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] shadow-xs">
              <History className="w-3.5 h-3.5" />
              <span>Immutable Cryptographic Audit Trail</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              Security Logs & <span className="apple-siri-gradient-text">Audit Activity</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] max-w-2xl leading-relaxed">
              Verify cryptographic mutation history, inspect before-and-after JSON state diffs, and track operator security accountability.
            </p>
          </div>
        </div>
      </div>

      {/* Control Center Floating Filter & Search Capsule */}
      <div className="liquid-glass rounded-[24px] p-4 sm:p-5 shadow-lg border border-black/[0.06] dark:border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
          <input
            type="text"
            placeholder="Search by username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl focus:outline-hidden focus:border-[#0071e3] text-[#1d1d1f] dark:text-[#f5f5f7]"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={entityType}
            onChange={(e) => {
              setEntityType(e.target.value);
              setPage(1);
            }}
            className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold focus:outline-hidden"
          >
            <option value="All">All Entities</option>
            <option value="Student">Student</option>
            <option value="Company">Company</option>
            <option value="PlacementDrive">Placement Drive</option>
            <option value="EligibilityRule">Eligibility Rule</option>
            <option value="Offer">Offer</option>
            <option value="SystemSetting">System Setting</option>
            <option value="User">User</option>
          </select>

          <select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
            }}
            className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold focus:outline-hidden"
          >
            <option value="All">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="IMPORT">IMPORT</option>
            <option value="BULK_UPDATE">BULK_UPDATE</option>
            <option value="RECALCULATE">RECALCULATE</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor (User)</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target Entity</th>
                <th className="p-3">Record ID</th>
                <th className="p-3">Mutation Summary</th>
                <th className="p-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {loading ? (
                <TableSkeleton rows={8} columns={7} />
              ) : fetchError ? (
                <ErrorState
                  asTableRow
                  colSpan={7}
                  onRetry={fetchLogs}
                  message={fetchError}
                />
              ) : logs.length === 0 ? (
                <EmptyState
                  asTableRow
                  colSpan={7}
                  icon={History}
                  title="No Audit Records Found"
                  description="No cryptographic audit events match the selected filters."
                  onReset={() => {
                    setEntityType('All');
                    setAction('All');
                    setUsername('');
                    setPage(1);
                  }}
                  resetLabel="Reset Audit Filters"
                />
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      @{log.username}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${actionStyles[log.action] || 'bg-slate-100'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                      {log.entity_type}
                    </td>
                    <td className="p-3 font-mono text-slate-400">
                      #{log.entity_id || 'N/A'}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {log.details || 'No payload recorded'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Inspect full JSON diff"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
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
            limit={30}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* INSPECT LOG MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  Audit Log Details & Diff
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedLog.action} on {selectedLog.entity_type} #{selectedLog.entity_id} by @{selectedLog.username}
                </p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] overflow-x-auto max-h-96 text-slate-800 dark:text-slate-200">
              <pre>
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(selectedLog.details), null, 2);
                  } catch (e) {
                    return selectedLog.details || 'No additional details logged.';
                  }
                })()}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
