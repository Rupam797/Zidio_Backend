import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Rightbar from '../components/Rightbar';
import Feed from '../components/Feed';
import { Home as HomeIcon, Users, Briefcase, Bell, MessageSquare } from 'lucide-react';

const Home = () => {
  const location = useLocation();
  const role = localStorage.getItem('role') || '';

  const navItems = [
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/network', icon: Users, label: 'Network' },
    { to: '/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/chat', icon: MessageSquare, label: 'Chat' },
    { to: '/notifications', icon: Bell, label: 'Alerts' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', transition: 'background 0.3s ease' }}>
      <Header />
      <main
        className="home-layout"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '1.25rem 1rem 3rem',
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Sidebar — hidden on mobile/tablet via CSS class */}
        <div
          className="sidebar-left"
          style={{ width: 220, flexShrink: 0, position: 'sticky', top: 70 }}
        >
          <Sidebar />
        </div>

        {/* Main Feed */}
        <div className="feed-column" style={{ flex: 1, minWidth: 0, maxWidth: 600 }}>
          <Feed />
        </div>

        {/* Right Sidebar — hidden on mobile/tablet via CSS class */}
        <div className="sidebar-right" style={{ width: 280, flexShrink: 0 }}>
          <Rightbar />
        </div>
      </main>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <nav className="mobile-bottom-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={location.pathname === to ? 'active' : ''}
          >
            <Icon style={{ width: 22, height: 22 }} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Home;