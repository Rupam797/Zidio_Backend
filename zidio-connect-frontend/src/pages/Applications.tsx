import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getMyApplications, withdrawApplication } from '../api/jobs';
import { CheckCircle2, XCircle, Clock, Inbox, ArrowLeft, Briefcase, MapPin } from 'lucide-react';

const STATUS: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode; label: string }> = {
  APPLIED:     { bg: 'var(--color-info-bg)',    text: 'var(--color-info-text)',    border: 'var(--color-info-border)',    icon: <Clock style={{ width: 18, height: 18 }} />,       label: 'Under Review' },
  SHORTLISTED: { bg: 'var(--color-success-bg)', text: 'var(--color-success-text)', border: 'var(--color-success-border)', icon: <CheckCircle2 style={{ width: 18, height: 18 }} />, label: 'Shortlisted' },
  REJECTED:    { bg: 'var(--color-danger-bg)',  text: 'var(--color-danger-text)',  border: 'var(--color-danger-border)',  icon: <XCircle style={{ width: 18, height: 18 }} />,     label: 'Rejected' },
  WITHDRAWN:   { bg: 'var(--bg-badge)',         text: 'var(--text-muted)',         border: 'var(--border-default)',       icon: <ArrowLeft style={{ width: 18, height: 18 }} />,   label: 'Withdrawn' },
};

const Applications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState<any>(null);

  useEffect(() => {
    getMyApplications().then(setApplications).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async (id: any) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    setWithdrawing(id);
    try {
      await withdrawApplication(id);
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'WITHDRAWN' } : app));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to withdraw');
    } finally { setWithdrawing(null); }
  };

  const counts = {
    total:       applications.length,
    pending:     applications.filter(a => !a.status || a.status === 'APPLIED').length,
    shortlisted: applications.filter(a => a.status === 'SHORTLISTED').length,
    rejected:    applications.filter(a => a.status === 'REJECTED').length,
    withdrawn:   applications.filter(a => a.status === 'WITHDRAWN').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', transition: 'background 0.3s ease' }}>
      <Header />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
        <h1 style={{ margin: '0 0 0.25rem', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>My Applications</h1>
        <p style={{ margin: '0 0 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Track the status of your job applications</p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total',       value: counts.total,       color: 'var(--text-primary)' },
            { label: 'Pending',     value: counts.pending,     color: 'var(--color-info-text)' },
            { label: 'Shortlisted', value: counts.shortlisted, color: 'var(--color-success-text)' },
            { label: 'Rejected',    value: counts.rejected,    color: 'var(--color-danger-text)' },
            { label: 'Withdrawn',   value: counts.withdrawn,   color: 'var(--text-muted)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}><div className="skeleton" style={{ height: 14, width: '55%', marginBottom: 6 }} /><div className="skeleton" style={{ height: 11, width: '40%' }} /></div>
                </div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Inbox style={{ width: 56, height: 56, color: 'var(--border-strong)', margin: '0 auto 1rem', display: 'block' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.375rem' }}>No Applications Yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 1.5rem' }}>Start exploring jobs and apply to your dream roles.</p>
            <a href="/jobs" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>Browse Jobs</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {applications.map((app, i) => {
              const s = STATUS[app.status] || STATUS.APPLIED;
              return (
                <div key={app.id} className="card animate-fadeInUp" style={{ padding: '1.25rem', borderLeft: `3px solid ${s.border}`, animationDelay: `${i * 0.04}s` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: s.bg, color: s.text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {s.icon}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{app.jobTitle || `Application #${app.id}`}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.625rem', marginTop: '0.25rem' }}>
                          {app.companyName && <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Briefcase style={{ width: 13, height: 13 }} />{app.companyName}</span>}
                          {app.jobLocation && <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin style={{ width: 13, height: 13 }} />{app.jobLocation}</span>}
                        </div>
                        {app.jobType && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>{app.jobType}</span>}
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.timeAgo || (app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '')}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.775rem', fontWeight: 700, background: s.bg, color: s.text }}>{s.label}</span>
                      {app.status === 'APPLIED' && (
                        <button onClick={() => handleWithdraw(app.id)} disabled={withdrawing === app.id}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.775rem', fontWeight: 600, color: 'var(--color-danger-text)', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif" }}>
                          {withdrawing === app.id ? 'Withdrawing…' : 'Withdraw'}
                        </button>
                      )}
                    </div>
                  </div>
                  {app.coverLetter && (
                    <div style={{ marginTop: '0.875rem', padding: '0.75rem 1rem', background: 'var(--bg-page)', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                      <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cover Letter</p>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{app.coverLetter}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Applications;