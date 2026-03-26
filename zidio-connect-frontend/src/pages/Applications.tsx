import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getMyApplications, withdrawApplication } from '../api/jobs';
import { CheckCircle2, XCircle, Clock, Inbox, ArrowLeft, Briefcase, MapPin, AlertCircle, Loader2 } from 'lucide-react';

const STATUS_STYLES = {
  APPLIED:     { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700', icon: <Clock className="w-5 h-5" />, label: 'Under Review' },
  SHORTLISTED: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-700', icon: <CheckCircle2 className="w-5 h-5" />, label: 'Shortlisted' },
  REJECTED:    { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-700', icon: <XCircle className="w-5 h-5" />, label: 'Rejected' },
  WITHDRAWN:   { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-500 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-600', icon: <ArrowLeft className="w-5 h-5" />, label: 'Withdrawn' },
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);

  const fetchApps = () => {
    setLoading(true);
    getMyApplications()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, []);

  const handleWithdraw = async (id) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    setWithdrawing(id);
    try {
      const updated = await withdrawApplication(id);
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'WITHDRAWN' } : app));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to withdraw');
    } finally {
      setWithdrawing(null);
    }
  };

  const counts = {
    total: applications.length,
    pending: applications.filter(a => !a.status || a.status === 'APPLIED').length,
    shortlisted: applications.filter(a => a.status === 'SHORTLISTED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
    withdrawn: applications.filter(a => a.status === 'WITHDRAWN').length,
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[800px] mx-auto pt-6 px-4 pb-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">My Applications</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Track the status of your job applications</p>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Total', value: counts.total, color: 'text-gray-900 dark:text-gray-100' },
            { label: 'Pending', value: counts.pending, color: 'text-blue-600' },
            { label: 'Shortlisted', value: counts.shortlisted, color: 'text-emerald-600' },
            { label: 'Rejected', value: counts.rejected, color: 'text-red-500' },
            { label: 'Withdrawn', value: counts.withdrawn, color: 'text-gray-500' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-5">
                <div className="flex gap-3">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="skeleton h-4 w-48 mb-1" />
                    <div className="skeleton h-3 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="flex justify-center mb-4 text-gray-300">
               <Inbox className="w-16 h-16" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-semibold mb-1">No Applications Yet</p>
            <p className="text-gray-400 text-sm mb-6">Start exploring jobs and apply to your dream roles.</p>
            <a href="/jobs" className="btn-primary inline-flex">Browse Jobs</a>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map((app, i) => {
              const s = STATUS_STYLES[app.status] || STATUS_STYLES.APPLIED;
              return (
                <div key={app.id} className={`card p-5 animate-fadeInUp border ${s.border}`} style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center flex-shrink-0`}>
                        {s.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{app.jobTitle || `Application #${app.id}`}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {app.companyName && <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {app.companyName}</span>}
                          {app.jobLocation && <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {app.jobLocation}</span>}
                        </div>
                        {app.jobType && <span className="text-xs text-gray-400 mt-1 block">{app.jobType}</span>}
                        <p className="text-xs text-gray-400 mt-1">{app.timeAgo || (app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '')}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                        {s.label}
                      </div>
                      {app.status === 'APPLIED' && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          disabled={withdrawing === app.id}
                          className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline"
                        >
                          {withdrawing === app.id ? 'Withdrawing…' : 'Withdraw'}
                        </button>
                      )}
                    </div>
                  </div>
                  {app.coverLetter && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Cover Letter</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{app.coverLetter}</p>
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
