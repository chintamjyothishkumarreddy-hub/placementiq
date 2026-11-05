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
  X
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import UserAvatar from '../components/UserAvatar';

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
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    placement_officer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    viewer: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
  };

  return (
    <div className="space-y-6">
      {/* Studio Hero Command Bar */}
      <div className="apple-gloss-tile p-6 sm:p-7 rounded-[28px] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#0071e3]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 liquid-pill text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] shadow-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>Role-Based Access Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              User Directory & <span className="apple-siri-gradient-text">Governance</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] max-w-2xl leading-relaxed">
              Provision administrative personnel, manage officer permissions, enforce institutional credentials, and oversee operator access.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleOpenAdd}
              className="apple-btn-primary px-4 py-2 text-xs font-medium cursor-pointer flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add System User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Glass Table */}
      <div className="apple-glass-table-container rounded-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">User</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400">Loading user accounts...</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar user={u} size={28} showRoleBadge={false} />
                        <div>
                          <span>@{u.username}</span>
                          {u.id === currentUser?.id && (
                            <span className="ml-2 text-[10px] text-blue-600 dark:text-blue-400 font-sans font-semibold">
                              (You)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                      {u.full_name}
                    </td>
                    <td className="p-3 text-slate-500 font-mono">
                      {u.email}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${roleStyles[u.role] || 'bg-slate-100'}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 font-semibold ${u.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {u.is_active ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => setDeleteId(u.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Delete User"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-md my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingUser ? `Edit User: @${editingUser.username}` : 'Add New System User'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {!editingUser && (
                <div>
                  <label className="block font-semibold mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">System Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                >
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="placement_officer">Placement Officer (Manage Data)</option>
                  <option value="viewer">Viewer (Read-Only Dashboards)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  {editingUser ? 'Reset Password (leave blank to keep current)' : 'Password *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? '••••••••' : 'Enter secure password'}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                />
                <label htmlFor="isActive" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Account is Active
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  {submitting ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete User Account"
        message="Are you sure you want to delete this user? They will lose access to the system immediately."
        confirmText="Delete User"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
