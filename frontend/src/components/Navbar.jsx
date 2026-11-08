import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, LogOut, User } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <Tag size={20} />
          </div>
          <span>Coupon Exchange</span>
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/" className="nav-link">Marketplace</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/settings" className="nav-link">Settings</Link>
              
              <div className="user-chip">
                <User size={14} />
                <span>{user.username}</span>
              </div>

              <button onClick={onLogout} className="logout-btn">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/auth" className="signin-btn">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}