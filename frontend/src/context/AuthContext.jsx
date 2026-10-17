import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('placementiq_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('placementiq_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('placementiq_theme') === 'dark';
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('placementiq_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('placementiq_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, 4000);
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('placementiq_user', JSON.stringify(res.data));
        } catch (err) {
          console.warn('Session expired, logging out');
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      const { access_token, user: userData } = res.data;
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('placementiq_token', access_token);
      localStorage.setItem('placementiq_user', JSON.stringify(userData));
      showToast(`Welcome back, ${userData.full_name}!`, 'success');
      return true;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please check credentials.';
      showToast(msg, 'error');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('placementiq_token');
    localStorage.removeItem('placementiq_user');
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: user?.role || 'viewer',
        isAuthenticated: !!token && !!user,
        loading,
        darkMode,
        toggleDarkMode,
        toast,
        showToast,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
