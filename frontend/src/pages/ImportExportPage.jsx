import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  History,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function ImportExportPage() {
  const { showToast } = useAuth();

  const [activeEntity, setActiveEntity] = useState('students');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);

  // History
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await api.get('/import-export/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDownloadTemplate = (entity, format = 'csv') => {
    window.open(`/api/import-export/template/${entity}?format=${format}`, '_blank');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreviewData(null);
    }
  };

  const handleUploadPreview = async () => {
    if (!selectedFile) {
      showToast('Please select a CSV or Excel file first', 'warning');
      return;
    }

    setPreviewLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('entity_type', activeEntity);

    try {
      const res = await api.post('/import-export/preview', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPreviewData(res.data);
      showToast('File validated! Please review the preview before confirming.', 'info');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to parse import file', 'error');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleCommitImport = async () => {
    if (!previewData || !previewData.preview_rows) return;

    // Filter valid rows only
    const validRows = previewData.preview_rows
      .filter((r) => r.status === 'VALID')
      .map((r) => r.data);

    if (validRows.length === 0) {
      showToast('No valid records to import. Please resolve the errors.', 'error');
      return;
    }

    setCommitLoading(true);
    try {
      const res = await api.post('/import-export/commit', {
        entity_type: activeEntity,
        rows: validRows,
        filename: previewData.filename
      });

      showToast(res.data.message, 'success');
      setPreviewData(null);
      setSelectedFile(null);
      fetchHistory();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Import commit failed', 'error');
    } finally {
      setCommitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Bulk Data Import, Validation & Export
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Import batches from Excel/CSV with automatic column validation, duplicate detection, and pre-commit review.
          </p>
        </div>
      </div>

      {/* Entity Selection Tabs */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap gap-2">
        {[
          { id: 'students', label: 'Students Data' },
          { id: 'companies', label: 'Company Partners' },
          { id: 'rules', label: 'Eligibility Cutoffs' },
          { id: 'offers', label: 'Offer Records' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveEntity(tab.id);
              setSelectedFile(null);
              setPreviewData(null);
            }}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeEntity === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Step 1: Download Templates & Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Download Template Box */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Step 1: Download Sample Template
              </h3>
              <p className="text-xs text-slate-400">Pre-formatted schema with sample demonstration records</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Download our standard formatted spreadsheet template for{' '}
            <strong className="text-slate-900 dark:text-slate-200 uppercase">{activeEntity}</strong>.
            Ensure roll numbers and emails are unique.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => handleDownloadTemplate(activeEntity, 'csv')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Download CSV Template
            </button>
            <button
              onClick={() => handleDownloadTemplate(activeEntity, 'excel')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Download Excel (.xlsx)
            </button>
          </div>
        </div>

        {/* Upload File Box */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Step 2: Upload & Validate File
              </h3>
              <p className="text-xs text-slate-400">Supports .csv, .xlsx, .xls</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              id="fileInput"
              className="hidden"
            />
            <label htmlFor="fileInput" className="cursor-pointer block">
              <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {selectedFile ? selectedFile.name : 'Click to select CSV or Excel file'}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Maximum 5MB file size</p>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleUploadPreview}
              disabled={!selectedFile || previewLoading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {previewLoading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span>Verify & Preview Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 3: PREVIEW TABLE & PRE-COMMIT VALIDATION */}
      {previewData && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Step 3: Verification & Pre-Commit Preview
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                File: {previewData.filename} ({previewData.total_rows} total rows detected)
              </p>
            </div>

            {/* Validation Pills */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                {previewData.valid_count} Valid
              </span>
              {previewData.duplicate_count > 0 && (
                <span className="px-3 py-1 rounded-full font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                  {previewData.duplicate_count} Duplicates
                </span>
              )}
              {previewData.error_count > 0 && (
                <span className="px-3 py-1 rounded-full font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
                  {previewData.error_count} Issues
                </span>
              )}
            </div>
          </div>

          {/* Preview rows table */}
          <div className="overflow-x-auto max-h-80 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3 w-12 text-center">Row</th>
                  <th className="p-3 w-28">Validation</th>
                  <th className="p-3">Data Summary</th>
                  <th className="p-3">Detected Errors / Warnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {previewData.preview_rows.map((row) => (
                  <tr
                    key={row.row_index}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                      row.status === 'ERROR'
                        ? 'bg-rose-50/40 dark:bg-rose-950/20'
                        : row.status === 'DUPLICATE'
                        ? 'bg-amber-50/40 dark:bg-amber-950/20'
                        : ''
                    }`}
                  >
                    <td className="p-3 text-center font-mono font-bold text-slate-400">
                      {row.row_index}
                    </td>
                    <td className="p-3">
                      {row.status === 'VALID' && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                          Ready
                        </span>
                      )}
                      {row.status === 'DUPLICATE' && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                          Duplicate
                        </span>
                      )}
                      {row.status === 'ERROR' && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                          Invalid
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {row.data.full_name || row.data.name || row.data.company_name || 'Record'}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-md">
                        {JSON.stringify(row.data)}
                      </div>
                    </td>
                    <td className="p-3">
                      {row.errors?.length > 0 ? (
                        <ul className="text-rose-600 dark:text-rose-400 text-[11px] list-disc list-inside space-y-0.5">
                          {row.errors.map((e, ei) => (
                            <li key={ei}>{e}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-emerald-600 text-[11px] font-semibold">Checks passed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Confirm Commit Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">
              Only verified valid records will be committed to the SQLite database.
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewData(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Discard Preview
              </button>
              <button
                onClick={handleCommitImport}
                disabled={commitLoading || previewData.valid_count === 0}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
              >
                {commitLoading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>Commit {previewData.valid_count} Valid Records</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT HISTORY LOGS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              Past Import Audits
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Historical batch import jobs and results</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Entity</th>
                <th className="p-3">File Name</th>
                <th className="p-3 text-center">Total Rows</th>
                <th className="p-3 text-center">Successful</th>
                <th className="p-3 text-center">Errors</th>
                <th className="p-3">Status</th>
                <th className="p-3">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {historyLoading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">Loading audit history...</td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 italic">No previous import jobs found.</td>
                </tr>
              ) : (
                history.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-slate-500">{new Date(h.created_at).toLocaleString()}</td>
                    <td className="p-3 font-bold uppercase text-slate-900 dark:text-white">{h.entity_type}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{h.filename}</td>
                    <td className="p-3 text-center">{h.total_rows}</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">{h.success_rows}</td>
                    <td className="p-3 text-center text-rose-600 font-bold">{h.error_rows}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {h.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono">@{h.username}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
