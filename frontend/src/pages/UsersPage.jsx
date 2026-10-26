import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Shield,
  Edit,
  Trash2,
  Lock,
  User,
  Mail,
  CheckCircle,
  XCircle,
  X,
  Sparkles
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

export default function UsersPage() {
  const { user: currentUser, showToast } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form State
  const defaultUserForm = {
    username: '',
    email: '',
    full_name: '',
    role: 'placement_officer',
    password: '',
    is_active: true
  };
  const [formData, setFormData] = useState(defaultUserForm);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      showToast('Error loading users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData(defaultUserForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({
      username: u.username,
      email: u.email,
      full_name: u.full_name,
      role: u.role,
      password: '',
      is_active: u.is_active
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingUser) {
        const payload = {
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          is_active: formData.is_active
        };
        if (formData.password.trim()) payload.password = formData.password.trim();

        await api.put(`/users/${editingUser.id}`, payload);
        showToast(`User @${editingUser.username} updated`, 'success');
      } else {
        await api.post('/users', formData);
        showToast(`User @${formData.username} created`, 'success');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to save user', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/users/${deleteId}`);
      showToast('User deleted successfully', 'success');
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to delete user', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const roleStyles = {
    admin: 'bg-purple-950/60 text-purple-300 border border-purple-500/30',
    placement_officer: 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30',
    viewer: 'bg-slate-900 text-slate-400 border border-white/[0.06]'
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="editorial-kicker">// IDENTITY GOVERNANCE // RBAC ACCESS</div>
          <h2 className="text-2xl font-editorial italic font-normal text-white tracking-tight flex items-center gap-3">
            Identity Governance & Access Control
            <span className="text-[11px] font-mono not-italic px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
              {users.length} IDENTITIES
            </span>
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Cryptographic authentication, role assignments, and server-side authorization enforcement.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-mono font-medium rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>PROVISION IDENTITY</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="intel-card rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-white/[0.08] text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="p-3">IDENTIFIER</th>
                <th className="p-3">OPERATOR DOSSIER</th>
                <th className="p-3">REGISTERED EMAIL</th>
                <th className="p-3">ASSIGNED ROLE</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-medium text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400 font-mono text-xs">
                    <div className="inline-block w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>// RETRIEVING SYSTEM IDENTITIES...</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-mono font-bold text-cyan-300">
                      @{u.username}
                      {u.id === currentUser?.id && (
                        <span className="ml-2 text-[10px] font-mono font-normal text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                          CURRENT
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-serif font-medium text-white">
                      {u.full_name}
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-xs">
                      {u.email}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${roleStyles[u.role] || 'bg-slate-900 text-slate-400'}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] ${u.is_active ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {u.is_active ? <span className="phosphor-dot-green" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />}
                        {u.is_active ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                          title="Edit Identity"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => setDeleteId(u.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                            title="Revoke Identity"
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

      {/* ADD / EDIT USER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md intel-card rounded-3xl shadow-2xl border border-white/[0.12] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="editorial-kicker">// IDENTITY PROVISIONING</div>
                <h3 className="text-xl font-editorial italic font-normal text-white">
                  {editingUser ? `Update Identity: @${editingUser.username}` : 'Provision System Identity'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs font-sans">
              {!editingUser && (
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              )}

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
                <label className="block font-mono text-xs text-slate-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Assigned Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                >
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="placement_officer">Placement Officer (Manage Data)</option>
                  <option value="viewer">Viewer (Read-Only Dashboards)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">
                  {editingUser ? 'Reset Password (leave blank to keep current)' : 'Password *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? '••••••••' : 'Enter secure password'}
                  className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1 font-mono text-xs text-slate-300">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded-md accent-cyan-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="cursor-pointer">
                  Account is Active
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl font-mono text-xs cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl font-mono text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {submitting ? 'SAVING...' : editingUser ? 'UPDATE IDENTITY' : 'PROVISION USER'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Revoke System Identity"
        message="Are you sure you want to delete this user? They will lose access to the system immediately."
        confirmText="Revoke User"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
