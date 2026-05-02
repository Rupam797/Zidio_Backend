import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, Home, Users, Briefcase, Bell, User,
  LogOut, ChevronDown, Moon, Sun, FileText, Settings, Shield,
  X, Loader2, GraduationCap, Building2
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { globalSearch, SearchResult } from '../api/search';
import axiosInstance from '../api/axios';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('theme') || 'light');
  const [role, setRole] = useState<string>(() => localStorage.getItem('role') || '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!role || role === 'ADMIN') return;
      try {
        const endpoint = role === 'RECRUITER' ? '/recruiter/profile' : '/student/profile';
        const r = await axiosInstance.get(endpoint);
        if (r.data.profilePictureUrl) setProfilePic(r.data.profilePictureUrl);
        if (r.data.name) setUserName(r.data.name);
      } catch (e) {
        console.error('Failed to fetch profile in header', e);
      }
    };
    fetchProfile();
  }, [role]);

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
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search
  const performSearch = useCallback((q: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!q.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    setShowSearch(true);

    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await globalSearch(q);
        setSearchResults(results);
      } catch (e) {
        console.error('Search error:', e);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    performSearch(val);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  const handleResultClick = (result: SearchResult) => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    if (result.type === 'JOB') {
      navigate('/jobs');
    } else {
      navigate('/network');
    }
  };

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
  const initials = userName ? userName.charAt(0).toUpperCase() : (email.charAt(0).toUpperCase() || 'U');

  // Group search results by type
  const jobResults = searchResults.filter(r => r.type === 'JOB');
  const studentResults = searchResults.filter(r => r.type === 'STUDENT');
  const recruiterResults = searchResults.filter(r => r.type === 'RECRUITER');

  const typeIcon = (type: string) => {
    if (type === 'JOB') return <Briefcase style={{ width: 16, height: 16, color: 'var(--brand)', flexShrink: 0 }} />;
    if (type === 'STUDENT') return <GraduationCap style={{ width: 16, height: 16, color: '#7c3aed', flexShrink: 0 }} />;
    return <Building2 style={{ width: 16, height: 16, color: '#f59e0b', flexShrink: 0 }} />;
  };

  const typeBadge = (type: string) => {
    const colors: Record<string, { bg: string; fg: string }> = {
      JOB: { bg: 'var(--brand-dim)', fg: 'var(--brand)' },
      STUDENT: { bg: '#f3e8ff', fg: '#7c3aed' },
      RECRUITER: { bg: '#fff7ed', fg: '#f59e0b' },
    };
    const c = colors[type] || colors.JOB;
    return (
      <span style={{
        fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
        background: c.bg, color: c.fg, padding: '0.1rem 0.4rem', borderRadius: '4px',
      }}>
        {type}
      </span>
    );
  };

  const renderResultItem = (r: SearchResult) => (
    <button
      key={`${r.type}-${r.id}`}
      onClick={() => handleResultClick(r)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
        padding: '0.625rem 0.875rem', background: 'transparent', border: 'none',
        cursor: 'pointer', textAlign: 'left', borderRadius: '8px',
        transition: 'background 0.15s', fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-badge)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Avatar or icon */}
      {r.imageUrl ? (
        <img src={r.imageUrl} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div style={{
          width: 36, height: 36, borderRadius: r.type === 'JOB' ? '8px' : '50%', flexShrink: 0,
          background: r.type === 'JOB' ? 'var(--brand-dim)' : r.type === 'STUDENT' ? '#f3e8ff' : '#fff7ed',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {typeIcon(r.type)}
        </div>
      )}
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {r.title}
          </span>
          {typeBadge(r.type)}
        </div>
        {r.subtitle && (
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {r.subtitle}
          </p>
        )}
        {r.extra && (
          <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
            {r.extra}
          </p>
        )}
      </div>
    </button>
  );

  const renderSection = (label: string, items: SearchResult[]) => {
    if (items.length === 0) return null;
    return (
      <div>
        <div style={{ padding: '0.375rem 0.875rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </div>
        {items.map(renderResultItem)}
      </div>
    );
  };

  return (
    <header className="header-root">
      <div
        style={{ maxWidth: '1128px', margin: '0 auto', height: '56px' }}
        className="flex items-center justify-between px-4 gap-3"
      >
        {/* ── Logo + Search ── */}
        <div className="flex items-center gap-3 flex-shrink-0" style={{ position: 'relative' }} ref={searchRef}>
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

          <div className="header-search hidden md:flex" style={{ position: 'relative' }}>
            <Search style={{ width: 15, height: 15, color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              placeholder="Search jobs, people…"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => { if (searchQuery.trim()) setShowSearch(true); }}
              style={{ minWidth: '14rem' }}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.125rem', display: 'flex', color: 'var(--text-muted)', borderRadius: '50%' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            )}
          </div>

          {/* ── Search Results Popover ── */}
          {showSearch && (
            <div
              className="animate-scaleIn"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: '420px',
                maxHeight: '480px',
                overflowY: 'auto',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 100,
                padding: '0.5rem 0',
                transformOrigin: 'top left',
              }}
            >
              {searchLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                  Searching…
                </div>
              ) : searchResults.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <Search style={{ width: 24, height: 24, margin: '0 auto 0.75rem', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontWeight: 500 }}>No results found for "{searchQuery}"</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem' }}>Try different keywords or check spelling</p>
                </div>
              ) : (
                <>
                  {renderSection('Jobs', jobResults)}
                  {jobResults.length > 0 && (studentResults.length > 0 || recruiterResults.length > 0) && (
                    <div style={{ height: '1px', background: 'var(--border-default)', margin: '0.375rem 0.75rem' }} />
                  )}
                  {renderSection('Students', studentResults)}
                  {studentResults.length > 0 && recruiterResults.length > 0 && (
                    <div style={{ height: '1px', background: 'var(--border-default)', margin: '0.375rem 0.75rem' }} />
                  )}
                  {renderSection('Recruiters', recruiterResults)}
                </>
              )}
            </div>
          )}
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
                style={{ fontSize: '0.8rem', padding: profilePic ? 0 : undefined, overflow: 'hidden' }}
              >
                {profilePic ? <img src={profilePic} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
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
                    style={{ margin: '0 auto 0.5rem', fontSize: '1.25rem', padding: profilePic ? 0 : undefined, overflow: 'hidden' }}
                  >
                    {profilePic ? <img src={profilePic} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
                  </div>
                  <p style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    marginBottom: '0.125rem',
                  }}>
                    {userName || email}
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