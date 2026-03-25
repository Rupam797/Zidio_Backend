import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getMyApplications } from '../api/jobs';
import { CheckCircle2, XCircle, Clock, Inbox } from 'lucide-react';

const STATUS_STYLES = {
  ACCEPTED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle2 className="w-5 h-5" />, label: 'Accepted' },
  REJECTED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <XCircle className="w-5 h-5" />, label: 'Rejected' },
  PENDING:  { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <Clock className="w-5 h-5" />, label: 'Under Review' },
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: applications.length,
    pending: applications.filter(a => !a.status || a.status === 'PENDING').length,
    accepted: applications.filter(a => a.status === 'ACCEPTED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[800px] mx-auto pt-6 px-4 pb-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Applications</h1>
        <p className="text-gray-500 text-sm mb-6">Track the status of your job applications</p>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: counts.total, color: 'text-gray-900' },
            { label: 'Pending', value: counts.pending, color: 'text-blue-600' },
            { label: 'Accepted', value: counts.accepted, color: 'text-emerald-600' },
            { label: 'Rejected', value: counts.rejected, color: 'text-red-500' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="card p-8 text-center text-gray-400">Loading applications…</div>
        ) : applications.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="flex justify-center mb-4 text-gray-300">
               <Inbox className="w-16 h-16" />
            </div>
            <p className="text-gray-600 font-semibold mb-1">No Applications Yet</p>
            <p className="text-gray-400 text-sm mb-6">Start exploring jobs and apply to your dream roles.</p>
            <a href="/jobs" className="btn-primary inline-flex">Browse Jobs</a>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map((app, i) => {
              const s = STATUS_STYLES[app.status] || STATUS_STYLES.PENDING;
              return (
                <div key={app.id} className={`card p-5 flex items-center justify-between animate-fadeInUp border ${s.border}`} style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center text-xl`}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Application #{app.id}</p>
                      <p className="text-sm text-gray-500">Job ID: {app.jobId || 'N/A'}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                    {s.label}
                  </div>
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
