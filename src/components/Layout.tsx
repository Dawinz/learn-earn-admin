import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'Users', href: '/users', icon: '👥' },
    { name: 'Payouts', href: '/payouts', icon: '💰' },
    { name: 'Lessons', href: '/lessons', icon: '📚' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
    { name: 'Version', href: '/version', icon: '📱' },
  ];

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Learn & Earn Admin</h2>
        </div>
        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-item ${location.pathname === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1>Learn & Earn Administration</h1>
          </div>
          <div className="header-right">
            <span className="user-info">Welcome, {user?.username}</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};
