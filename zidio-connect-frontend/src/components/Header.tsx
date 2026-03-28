import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Home, Users, Briefcase, Bell, User,
  LogOut, ChevronDown, Moon, Sun, FileText, Settings, Shield
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('theme') || 'light');
  const [role, setRole] = useState<string>(() => localStorage.getItem('role') || '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setShowDropdown(false);
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/network', icon: Users, label: 'Network' },
    { to: '/jobs', icon: Briefcase, label: 'Jobs' },
    ...(role === 'STUDENT' ? [{ to: '/applications', icon: FileText, label: 'Applied' }] : []),
    { to: '/notifications', icon: Bell, label: 'Alerts' },
  ];

  const email = localStorage.getItem('email') || '';
  const initials = email.charAt(0).toUpperCase() || 'U';

  return (
    <header className="header-root">
      <div
        style={{ maxWidth: '1128px', margin: '0 auto', height: '56px' }}
        className="flex items-center justify-between px-4 gap-3"
      >
        {/* ── Logo + Search ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            to="/"
            style={{
              background: 'var(--brand)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.1rem',
              letterSpacing: '-0.03em',
              padding: '0.2rem 0.625rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Zidio
          </Link>

          <div className="header-search hidden md:flex">
            <Search style={{ width: 15, height: 15, color: 'var(--text-muted)', flexShrink: 0 }} />
            <input placeholder="Search jobs, people…" />
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="flex items-center gap-0.5">
          {/* ✅ Single unified map — no duplicates */}
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-item flex ${location.pathname === to ? 'active' : ''}`}
            >
              <Icon style={{ width: 20, height: 20 }} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle ml-1"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          >
            {theme === 'dark'
              ? <Sun style={{ width: 16, height: 16 }} />
              : <Moon style={{ width: 16, height: 16 }} />
            }
          </button>

          {/* Avatar / Me */}
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(v => !v)}
              className="nav-item flex-col"
              style={{ minWidth: 44, borderRadius: '8px' }}
            >
              <div
                className="avatar avatar-sm avatar-green"
                style={{ fontSize: '0.8rem' }}
              >
                {initials}
              </div>
              <span className="hidden sm:flex items-center gap-0.5" style={{ fontSize: '0.68rem' }}>
                Me <ChevronDown style={{ width: 10, height: 10 }} />
              </span>
            </button>

            {showDropdown && (
              <div
                className="dropdown-menu absolute right-0"
                style={{ top: 'calc(100% + 8px)' }}
              >
                {/* Profile info */}
                <div style={{ padding: '0.625rem 0.75rem', marginBottom: '0.25rem' }}>
                  <div
                    className="avatar avatar-lg avatar-green"
                    style={{ margin: '0 auto 0.5rem', fontSize: '1.25rem' }}
                  >
                    {initials}
                  </div>
                  <p style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    marginBottom: '0.125rem',
                  }}>
                    {email}
                  </p>
                  <p style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                  }}>
                    {role}
                  </p>
                </div>

                <div className="dropdown-divider" />

                <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  <User style={{ width: 15, height: 15 }} />
                  View Profile
                </Link>

                {role === 'STUDENT' && (
                  <Link to="/applications" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <FileText style={{ width: 15, height: 15 }} />
                    My Applications
                  </Link>
                )}

                {role === 'RECRUITER' && (
                  <Link to="/jobs" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <Briefcase style={{ width: 15, height: 15 }} />
                    Posted Jobs
                  </Link>
                )}

                {role === 'ADMIN' && (
                  <Link to="/admin" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <Shield style={{ width: 15, height: 15 }} />
                    Admin Panel
                  </Link>
                )}

                <div className="dropdown-divider" />

                <button className="dropdown-item danger" onClick={handleLogout}>
                  <LogOut style={{ width: 15, height: 15 }} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;