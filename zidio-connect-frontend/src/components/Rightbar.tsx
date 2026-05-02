import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info, Newspaper, ChevronDown } from 'lucide-react';
import { getSuggestions, sendConnectionRequest } from '../api/connections';

const NEWS = [
  { title: 'Tech hiring sees a strong rebound in 2025',         meta: 'Top story · 12.4k readers' },
  { title: 'AI & ML skills dominate recruiter searches',        meta: 'Top story · 9.8k readers' },
  { title: 'Remote-first companies outperform office peers',    meta: '1d ago · 6.2k readers' },
  { title: 'How to ace your next technical interview',          meta: '2d ago · 4.1k readers' },
  { title: 'Open source contributions boost career prospects',  meta: '3d ago · 3.5k readers' },
];

const FOOTER_LINKS = ['About', 'Help', 'Privacy', 'Terms', 'Advertising'];

const Rightbar = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await getSuggestions();
        setSuggestions(data.slice(0, 5));
      } catch (e) { console.error(e); }
    };
    fetchSuggestions();
  }, []);

  const handleConnect = async (email: string) => {
    try {
      await sendConnectionRequest(email);
      setSuggestions(prev => prev.filter(p => p.email !== email));
    } catch (e) {
      console.error(e);
      alert('Failed to send connection request');
    }
  };
  return (
    <div style={{ width: 300, flexShrink: 0, position: 'sticky', top: 70 }} className="hidden lg:flex flex-col gap-3">
      {/* ── Zidio News ── */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.875rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Newspaper style={{ width: 15, height: 15, color: 'var(--brand)' }} />
            <h2 style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              Zidio News
            </h2>
          </div>
          <button style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-badge)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'background 0.15s',
          }}>
            <Info style={{ width: 13, height: 13 }} />
          </button>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {NEWS.map((item, i) => (
            <li
              key={i}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}
            >
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--brand)',
                flexShrink: 0,
                marginTop: '0.4rem',
              }} />
              <div>
                <p style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                  lineHeight: 1.4,
                  transition: 'color 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                >
                  {item.title}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0.125rem 0 0' }}>
                  {item.meta}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <button style={{
          marginTop: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.25rem 0',
          transition: 'color 0.15s',
          fontFamily: "'DM Sans', sans-serif",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          Show more <ChevronDown style={{ width: 14, height: 14 }} />
        </button>
      </div>

      {/* ── People You May Know ── */}
      <div className="card" style={{ padding: '1rem' }}>
        <h2 style={{
          fontSize: '0.875rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 0.875rem',
        }}>
          People You May Know
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {suggestions.map(p => {
            const initials = p.name ? p.name.charAt(0).toUpperCase() : p.email.charAt(0).toUpperCase();
            const colors = ['avatar-green', 'avatar-blue', 'avatar-amber', 'avatar-red'];
            const color = colors[p.email.charCodeAt(0) % colors.length];
            return (
              <div key={p.email} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className={`avatar avatar-md ${color}`} style={{ padding: p.profilePictureUrl ? 0 : undefined, overflow: 'hidden' }}>
                  {p.profilePictureUrl ? <img src={p.profilePictureUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: 0,
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {p.name}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {p.role}
                  </p>
                </div>
                <button onClick={() => handleConnect(p.email)} className="btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', flexShrink: 0 }}>
                  Connect
                </button>
              </div>
            );
          })}
        </div>

        <Link
          to="/network"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            marginTop: '1rem',
            paddingTop: '0.875rem',
            borderTop: '1px solid var(--border-default)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--brand)',
            textDecoration: 'none',
          }}
        >
          View all suggestions <ArrowRight style={{ width: 13, height: 13 }} />
        </Link>
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: '0.25rem 0.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.25rem 0.5rem',
      }}>
        {FOOTER_LINKS.map(item => (
          <span
            key={item}
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            {item}
          </span>
        ))}
        <span style={{ width: '100%', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
          Zidio Connect © 2025
        </span>
      </div>
    </div>
  );
};

export default Rightbar;