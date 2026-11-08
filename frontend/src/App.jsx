import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/SettingsPage';

const API_BASE = 'https://coupon-backend-xwky.onrender.com/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Loading session...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#030712' }}>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/auth" element={!user ? <AuthPage onAuthSuccess={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/settings" element={user ? <SettingsPage user={user} setUser={setUser} /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}