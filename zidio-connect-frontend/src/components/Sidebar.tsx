import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, ClipboardList, User, Settings, Shield, TrendingUp } from 'lucide-react';
import axiosInstance from '../api/axios';

const TRENDING = [
  { tag: '#ReactDeveloper', count: '600k' },
  { tag: '#HiringNow',      count: '500k' },
  { tag: '#Freshers2025',   count: '420k' },
  { tag: '#TechJobs',       count: '360k' },
  { tag: '#Zidio',          count: '240k' },
];

const Sidebar = () => {
  const role = localStorage.getItem('role') || 'STUDENT';
  const email = localStorage.getItem('email') || '';
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [connectionsCount, setConnectionsCount] = useState<number | string>('—');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = role === 'RECRUITER' ? '/recruiter/profile' : '/student/profile';
        const r = await axiosInstance.get(endpoint);
        setProfile(r.data);
      } catch (e) {
        console.error(e);
      }
    };
    const fetchConnections = async () => {
      try {
        const r = await axiosInstance.get('/connections');
        const accepted = r.data.filter((c: any) => c.status === 'ACCEPTED');
        setConnectionsCount(accepted.length);
      } catch (e) {
        console.error(e);
      }
    };
    if (role !== 'ADMIN') {
      fetchProfile();
      fetchConnections();
    }
  }, [role]);

  const initials = profile?.name ? profile.name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase() || 'U';
  const roleLabel = role === 'RECRUITER' ? 'Recruiter' : role === 'ADMIN' ? 'Administrator' : 'Student';

  const quickLinks = [
    { to: '/jobs',         icon: Briefcase,     label: 'Browse Jobs' },
    { to: '/applications', icon: ClipboardList, label: 'My Applications' },
    { to: '/profile',      icon: User,          label: 'Edit Profile' },
    ...(role === 'ADMIN' ? [{ to: '/admin', icon: Shield, label: 'Admin Panel' }] : []),
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* ── Profile Card ── */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div 
          className="profile-banner" 
          style={{ 
            height: 64,
            backgroundImage: profile?.backgroundPictureUrl ? `url(${profile.backgroundPictureUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} 
        />
        <div style={{ padding: '0 1rem 1.125rem', marginTop: '-2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Avatar */}
            <div
              className="avatar avatar-2xl avatar-green"
              style={{
                position: 'relative',
                zIndex: 1,
                border: '3px solid var(--bg-card)',
                boxShadow: 'var(--shadow-md)',
                fontSize: profile?.profilePictureUrl ? '1rem' : '1.6rem',
                padding: profile?.profilePictureUrl ? 0 : undefined,
                overflow: 'hidden'
              }}
            >
              {profile?.profilePictureUrl ? (
                <img src={profile.profilePictureUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                initials
              )}
            </div>

            <Link
              to="/profile"
              style={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                marginTop: '0.5rem',
                textDecoration: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            >
              {profile?.name || email || 'Your Profile'}
            </Link>

            <span style={{
              fontSize: '0.75rem',
              color: 'var(--brand)',
              fontWeight: 600,
              marginTop: '0.125rem',
              background: 'var(--brand-dim)',
              padding: '0.1rem 0.5rem',
              borderRadius: '999px',
            }}>
              {roleLabel}
            </span>
          </div>

          {/* Stats */}
          <div style={{
            marginTop: '0.875rem',
            paddingTop: '0.875rem',
            borderTop: '1px solid var(--border-default)',
          }}>
            <div className="sidebar-stat-row">
              <span className="sidebar-stat-label">Profile views</span>
              <span className="sidebar-stat-value">{profile?.profileViews ?? 0}</span>
            </div>
            <div className="sidebar-stat-row">
              <span className="sidebar-stat-label">Connections</span>
              <span className="sidebar-stat-value">{connectionsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div className="card" style={{ padding: '1rem' }}>
        <p className="section-label">Quick Links</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          {quickLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className="quick-link"
              style={{
                color: location.pathname === to ? 'var(--brand)' : undefined,
                background: location.pathname === to ? 'var(--brand-dim)' : undefined,
                fontWeight: location.pathname === to ? 600 : 500,
              }}
            >
              <Icon
                style={{
                  width: 16,
                  height: 16,
                  color: location.pathname === to ? 'var(--brand)' : 'var(--text-muted)',
                  flexShrink: 0,
                }}
              />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Trending ── */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
          <p className="section-label" style={{ marginBottom: 0 }}>Trending</p>
          <TrendingUp style={{ width: 14, height: 14, color: 'var(--brand)' }} />
        </div>
        {TRENDING.map(({ tag, count }) => (
          <div
            key={tag}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.4rem 0.375rem',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-badge)')}
            onMouseLeave={e => (e.currentTarget.style.background = '')}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand)' }}>{tag}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;