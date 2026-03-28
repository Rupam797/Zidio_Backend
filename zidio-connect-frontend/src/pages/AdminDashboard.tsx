import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import {
  getDashboardStats, getAllStudents, getAllRecruiters,
  getAllJobs, toggleUserBlock, deleteUser, toggleJobStatus
} from '../api/admin';
import { BarChart2, GraduationCap, Building2, Briefcase, CheckCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';

/* ── Stat Card ── */
const StatCard = ({ icon, label, value, accent }: {
  icon: React.ReactNode; label: string; value: any; accent: string;
}) => (
  <div className="card animate-fadeInUp" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{
      width: 48,
      height: 48,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: accent,
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>
        {value ?? '—'}
      </p>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>{label}</p>
    </div>
  </div>
);

/* ── User Table ── */
const UserTable = ({ data, columns, onBlock, onDelete }: any) => (
  <div style={{ overflowX: 'auto' }}>
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((c: string) => <th key={c}>{c}</th>)}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
              No records found
            </td>
          </tr>
        ) : data.map((row: any, i: number) => (
          <tr key={row.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.03}s` }}>
            {columns.map((c: string) => {
              const key = c.toLowerCase().replace(/ /g, '');
              if (key === 'status') return (
                <td key={c}>
                  <span className={row.blocked ? 'badge badge-blocked' : 'badge badge-active'}>
                    {row.blocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
              );
              return (
                <td key={c} style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row[key] ?? row.name ?? row.title ?? '—'}
                </td>
              );
            })}
            <td>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {onBlock && (
                  <button
                    onClick={() => onBlock(row.id)}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      border: `1px solid ${row.blocked ? 'var(--color-success-border)' : 'var(--color-info-border)'}`,
                      color: row.blocked ? 'var(--color-success-text)' : 'var(--color-info-text)',
                      background: row.blocked ? 'var(--color-success-bg)' : 'var(--color-info-bg)',
                      cursor: 'pointer',
                      transition: 'opacity 0.15s',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {row.blocked ? 'Unblock' : 'Block'}
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(row.id)}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      border: '1px solid var(--color-danger-border)',
                      color: 'var(--color-danger-text)',
                      background: 'var(--color-danger-bg)',
                      cursor: 'pointer',
                      transition: 'opacity 0.15s',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TABS = [
  { key: 'DASHBOARD', label: 'Dashboard', icon: <BarChart2 style={{ width: 17, height: 17 }} /> },
  { key: 'STUDENTS',  label: 'Students',  icon: <GraduationCap style={{ width: 17, height: 17 }} /> },
  { key: 'RECRUITERS',label: 'Recruiters',icon: <Building2 style={{ width: 17, height: 17 }} /> },
  { key: 'JOBS',      label: 'Jobs',      icon: <Briefcase style={{ width: 17, height: 17 }} /> },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>({});
  const [students, setStudents] = useState<any[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  const fetchData = async () => {
    try {
      const [s, st, rc, jb] = await Promise.all([
        getDashboardStats(), getAllStudents(), getAllRecruiters(), getAllJobs()
      ]);
      setStats(s || {}); setStudents(st || []); setRecruiters(rc || []); setJobs(jb || []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load dashboard data.');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleBlock  = async (id: number) => {
    try {
      await toggleUserBlock(id);
      toast.success('User status updated!');
      fetchData();
    } catch (e) {
      console.error(e);
      toast.error('Failed to update user status.');
    }
  };
  const handleDelete = async (id: number) => {
    if (window.confirm('Permanently delete this user?')) {
      try {
        await deleteUser(id);
        toast.success('User deleted successfully!');
        fetchData();
      } catch (e) {
        console.error(e);
        toast.error('Failed to delete user.');
      }
    }
  };
  const handleToggleJob = async (id: number) => {
    try {
      await toggleJobStatus(id);
      toast.success('Job status updated!');
      fetchData();
    } catch (e) {
      console.error(e);
      toast.error('Failed to update job status.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1rem 3rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>

        {/* ── Sidebar ── */}
        <div style={{ width: 220, flexShrink: 0, position: 'sticky', top: 70 }} className="hidden lg:block">
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="admin-banner" style={{ height: 56, display: 'flex', alignItems: 'flex-end', padding: '0 1rem 0.625rem' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>Admin Panel</span>
            </div>
            <div style={{ padding: '0.5rem' }}>
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Mobile tab bar */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-1">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flexShrink: 0,
                  padding: '0.375rem 0.875rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  background: activeTab === tab.key ? 'var(--brand)' : 'var(--bg-card)',
                  color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
                  boxShadow: activeTab === tab.key ? 'var(--shadow-brand)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'DASHBOARD' && (
            <>
              <h1 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Platform Overview
              </h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <StatCard
                  icon={<GraduationCap style={{ width: 22, height: 22, color: 'var(--color-info-text)' }} />}
                  label="Total Students" value={stats.totalStudents ?? students.length}
                  accent="var(--color-info-bg)"
                />
                <StatCard
                  icon={<Building2 style={{ width: 22, height: 22, color: '#7c3aed' }} />}
                  label="Total Recruiters" value={stats.totalRecruiters ?? recruiters.length}
                  accent="color-mix(in srgb, #7c3aed 12%, transparent)"
                />
                <StatCard
                  icon={<Briefcase style={{ width: 22, height: 22, color: 'var(--color-warn-text)' }} />}
                  label="Total Jobs" value={stats.totalJobs ?? jobs.length}
                  accent="var(--color-warn-bg)"
                />
                <StatCard
                  icon={<CheckCircle style={{ width: 22, height: 22, color: 'var(--color-success-text)' }} />}
                  label="Active Jobs" value={jobs.filter(j => j.active).length}
                  accent="var(--color-success-bg)"
                />
              </div>
            </>
          )}

          {/* Students Tab */}
          {activeTab === 'STUDENTS' && (
            <div className="card" style={{ padding: '1.25rem' }}>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>
                Student Users ({students.length})
              </h2>
              <UserTable data={students} columns={['ID', 'Name', 'Email', 'Status']} onBlock={handleBlock} onDelete={handleDelete} />
            </div>
          )}

          {/* Recruiters Tab */}
          {activeTab === 'RECRUITERS' && (
            <div className="card" style={{ padding: '1.25rem' }}>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>
                Recruiter Users ({recruiters.length})
              </h2>
              <UserTable data={recruiters} columns={['ID', 'Name', 'CompanyName', 'Status']} onBlock={handleBlock} onDelete={handleDelete} />
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'JOBS' && (
            <div className="card" style={{ padding: '1.25rem' }}>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>
                Job Postings ({jobs.length})
              </h2>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      {['Title', 'Company', 'Location', 'Status', 'Action'].map(c => <th key={c}>{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>No jobs found</td></tr>
                    ) : jobs.map((job: any, i: number) => (
                      <tr key={job.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.03}s` }}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {job.title}
                        </td>
                        <td>{job.companyName}</td>
                        <td>{job.location || '—'}</td>
                        <td>
                          <span className={`badge ${job.active ? 'badge-active' : 'badge-blocked'}`}>
                            {job.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleJob(job.id)}
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              padding: '0.25rem 0.75rem',
                              borderRadius: '999px',
                              border: `1px solid ${job.active ? 'var(--color-danger-border)' : 'var(--color-success-border)'}`,
                              color: job.active ? 'var(--color-danger-text)' : 'var(--color-success-text)',
                              background: job.active ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
                              cursor: 'pointer',
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {job.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;