import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  Activity,
  X,
  FileCode,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';

export default function AuditLogsPage() {
  const { showToast } = useAuth();
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [entityType, setEntityType] = useState('All');
  const [action, setAction] = useState('All');
  const [username, setUsername] = useState('');

  // Inspect Modal
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
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
      showToast('Error loading audit log records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, entityType, action]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const actionStyles = {
    CREATE: 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30',
    UPDATE: 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30',
    DELETE: 'bg-rose-950/60 text-rose-300 border border-rose-500/30',
    IMPORT: 'bg-purple-950/60 text-purple-300 border border-purple-500/30',
    BULK_UPDATE: 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30',
    RECALCULATE: 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="editorial-kicker">// IMMUTABLE JOURNAL // EVENT AUDITING</div>
          <h2 className="text-2xl font-editorial italic font-normal text-white tracking-tight flex items-center gap-3">
            Immutable Security Journal & Event Audit
            <span className="text-[11px] font-mono not-italic px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
              {total} EVENTS
            </span>
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Immutable system audit trails tracking administrative mutations, before-and-after state diffs & pipeline events.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="intel-card p-4 rounded-2xl border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by operator handle..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-500/50"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={entityType}
            onChange={(e) => {
              setEntityType(e.target.value);
              setPage(1);
            }}
            className="py-1.5 px-3 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-300 focus:outline-hidden focus:border-cyan-500/40 cursor-pointer"
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
            className="py-1.5 px-3 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-300 focus:outline-hidden focus:border-cyan-500/40 cursor-pointer"
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
      <div className="intel-card rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-white/[0.08] text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3">OPERATOR</th>
                <th className="p-3">ACTION</th>
                <th className="p-3">ENTITY TARGET</th>
                <th className="p-3">RECORD ID</th>
                <th className="p-3">MUTATION LOG</th>
                <th className="p-3 text-right">INSPECT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-medium text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400 font-mono text-xs">
                    <div className="inline-block w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>// RETRIEVING SECURITY JOURNAL...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500 font-mono text-xs">
                    // ZERO AUDIT JOURNAL EVENTS MATCH CRITERIA
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-mono text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-mono font-bold text-cyan-300">
                      @{log.username}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${actionStyles[log.action] || 'bg-slate-900 text-slate-400'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-serif font-medium text-white">
                      {log.entity_type}
                    </td>
                    <td className="p-3 font-mono text-slate-400 text-xs">
                      #{log.entity_id || 'N/A'}
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                      {log.details || 'No payload recorded'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
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
        <div className="px-4">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl intel-card rounded-3xl shadow-2xl border border-white/[0.12] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="editorial-kicker">// AUDIT EVENT INSPECTION</div>
                <h3 className="text-xl font-editorial italic font-normal text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  Mutation Diff & State Snapshot
                </h3>
                <p className="text-xs font-mono text-cyan-300/80">
                  {selectedLog.action} on {selectedLog.entity_type} #{selectedLog.entity_id} by @{selectedLog.username}
                </p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/[0.08] font-mono text-xs overflow-x-auto max-h-96 text-cyan-300">
              <pre>
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(selectedLog.details), null, 2);
                  } catch (e) {
                    return selectedLog.details || 'No additional payload details logged.';
                  }
                })()}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-900 border border-white/[0.08] text-slate-300 hover:text-white rounded-xl font-mono text-xs cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
