import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getMyNotifications, markAllRead } from '../api/notifications';
import { Bell, Heart, MessageSquare, UserPlus, Briefcase, CheckCheck } from 'lucide-react';

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  POST_LIKE: {
    icon: <Heart style={{ width: 15, height: 15 }} />,
    color: '#ef4444',
    bg: 'var(--color-danger-bg)',
  },
  COMMENT: {
    icon: <MessageSquare style={{ width: 15, height: 15 }} />,
    color: 'var(--color-info-text)',
    bg: 'var(--color-info-bg)',
  },
  CONNECTION_REQUEST: {
    icon: <UserPlus style={{ width: 15, height: 15 }} />,
    color: 'var(--color-success-text)',
    bg: 'var(--color-success-bg)',
  },
  CONNECTION_ACCEPTED: {
    icon: <UserPlus style={{ width: 15, height: 15 }} />,
    color: 'var(--color-success-text)',
    bg: 'var(--color-success-bg)',
  },
  JOB_APPLICATION: {
    icon: <Briefcase style={{ width: 15, height: 15 }} />,
    color: '#7c3aed',
    bg: 'color-mix(in srgb, #7c3aed 10%, transparent)',
  },
};

const DEFAULT_CFG = {
  icon: <Bell style={{ width: 15, height: 15 }} />,
  color: 'var(--text-muted)',
  bg: 'var(--bg-badge)',
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [marking,  setMarking]  = useState(false);

  useEffect(() => {
    getMyNotifications()
      .then(setNotifications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAllRead = async () => {
    setMarking(true);
    try {
      await markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) { console.error(e); }
    finally { setMarking(false); }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Header />
      <main style={{ maxWidth: 700, margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>

        {/* ── Title row ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.125rem', letterSpacing: '-0.03em' }}>
              Notifications
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: 0 }}>
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                : 'All caught up'
              }
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              className="btn-ghost"
              onClick={handleMarkAllRead}
              disabled={marking}
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.825rem' }}
            >
              <CheckCheck style={{ width: 15, height: 15 }} />
              {marking ? 'Marking…' : 'Mark all read'}
            </button>
          )}
        </div>

        {/* ── List ── */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {loading ? (
            /* Skeletons */
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 13, width: '75%', marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 11, width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <Bell style={{ width: 52, height: 52, color: 'var(--border-strong)', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-secondary)', fontWeight: 700, margin: '0 0 0.25rem', fontSize: '1rem' }}>
                You're all caught up!
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                No notifications yet. Check back later.
              </p>
            </div>
          ) : (
            notifications.map((note: any, i: number) => {
              const cfg    = TYPE_CONFIG[note.type] || DEFAULT_CFG;
              const isLast = i === notifications.length - 1;
              return (
                <div
                  key={note.id}
                  className="animate-fadeInUp"
                  style={{
                    display: 'flex',
                    gap: '0.875rem',
                    padding: '1rem 1.25rem',
                    borderBottom: isLast ? 'none' : '1px solid var(--border-default)',
                    background: !note.read
                      ? 'color-mix(in srgb, var(--brand) 5%, transparent)'
                      : 'transparent',
                    transition: 'background 0.2s',
                    cursor: 'default',
                    animationDelay: `${i * 0.025}s`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = !note.read ? 'color-mix(in srgb, var(--brand) 5%, transparent)' : 'transparent')}
                >
                  {/* Icon */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: cfg.bg, color: cfg.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '0.125rem',
                  }}>
                    {cfg.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)',
                      fontWeight: note.read ? 400 : 600,
                      lineHeight: 1.5,
                    }}>
                      {note.message}
                    </p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!note.read && (
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'var(--brand)', flexShrink: 0, marginTop: '0.4rem',
                    }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;