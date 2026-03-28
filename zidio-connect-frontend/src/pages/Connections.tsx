import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getPendingRequests, getMyConnections, acceptConnectionRequest } from '../api/connections';
import { UserCheck, UserPlus, Users, MessageSquare } from 'lucide-react';

const Connections = () => {
  const [pending, setPending] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [pend, conn] = await Promise.all([getPendingRequests(), getMyConnections()]);
      setPending(pend);
      setConnections(conn.filter((c: any) => c.status === 'ACCEPTED'));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAccept = async (id: any) => {
    try { await acceptConnectionRequest(id); fetchData(); }
    catch (e) { console.error(e); alert('Failed to accept request'); }
  };

  const currentUser = localStorage.getItem('email') || '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', transition: 'background 0.3s ease' }}>
      <Header />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
          <Users style={{ width: 22, height: 22, color: 'var(--brand)' }} />
          <h1 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>My Network</h1>
        </div>
        <p style={{ margin: '0 0 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage your connections and pending requests</p>

        {loading ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading network…</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Pending Invitations */}
            {pending.length > 0 && (
              <div className="card" style={{ padding: '1.25rem' }}>
                <h2 style={{ margin: '0 0 1rem', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Invitations
                  <span style={{ background: 'var(--brand)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.45rem', borderRadius: '999px' }}>{pending.length}</span>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {pending.map((req: any) => (
                    <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', border: '1px solid var(--border-default)', borderRadius: '10px', gap: '1rem', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div className="avatar avatar-lg avatar-blue" style={{ fontSize: '1.1rem' }}>{req.senderEmail.charAt(0).toUpperCase()}</div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{req.senderEmail}</p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Wants to connect with you</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.625rem', flexShrink: 0 }}>
                        <button className="btn-ghost" style={{ padding: '0.4rem 0.875rem', fontSize: '0.825rem' }}>Ignore</button>
                        <button onClick={() => handleAccept(req.id)} className="btn-primary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.825rem', gap: '0.375rem' }}>
                          <UserCheck style={{ width: 14, height: 14 }} />Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Connections */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h2 style={{ margin: '0 0 1rem', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-default)' }}>
                My Connections ({connections.length})
              </h2>
              {connections.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                  <UserPlus style={{ width: 48, height: 48, color: 'var(--border-strong)', margin: '0 auto 0.875rem', display: 'block' }} />
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No connections yet</p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Start growing your network by connecting with people.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.875rem' }}>
                  {connections.map((c: any) => {
                    const otherUser = c.senderEmail === currentUser ? c.receiverEmail : c.senderEmail;
                    const colors = ['avatar-green', 'avatar-blue', 'avatar-amber', 'avatar-red'];
                    const color = colors[otherUser.charCodeAt(0) % colors.length];
                    return (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', border: '1px solid var(--border-default)', borderRadius: '10px', transition: 'border-color 0.15s, box-shadow 0.15s', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div className={`avatar avatar-md ${color}`} style={{ fontSize: '1rem', flexShrink: 0 }}>{otherUser.charAt(0).toUpperCase()}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{otherUser}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--brand)', fontWeight: 500 }}>Connected</p>
                        </div>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.375rem', borderRadius: '6px', display: 'flex', transition: 'background 0.15s, color 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-badge)'; e.currentTarget.style.color = 'var(--color-info-text)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                          <MessageSquare style={{ width: 16, height: 16 }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Connections;