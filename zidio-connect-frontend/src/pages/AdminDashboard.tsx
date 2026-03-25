import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getDashboardStats, getAllStudents, getAllRecruiters, getAllJobs, toggleUserBlock, deleteUser, toggleJobStatus } from '../api/admin';
import { BarChart2, GraduationCap, Building2, Briefcase, CheckCircle } from 'lucide-react';

const StatCard = ({ icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4 animate-fadeInUp">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const UserTable = ({ data, columns, onBlock, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          {columns.map(c => (
            <th key={c} className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{c}</th>
          ))}
          <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr><td colSpan={columns.length + 1} className="p-8 text-center text-gray-400">No records found</td></tr>
        ) : data.map((row, i) => (
          <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors animate-fadeInUp" style={{ animationDelay: `${i * 0.03}s` }}>
            {columns.map(c => {
              const key = c.toLowerCase().replace(/ /g, '');
              if (key === 'status') return (
                <td key={c} className="p-3">
                  <span className={row.blocked ? 'badge-blocked' : 'badge-active'}>
                    {row.blocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
              );
              return <td key={c} className="p-3 text-sm text-gray-700 max-w-[180px] truncate">{row[key] ?? row.name ?? row.title ?? '—'}</td>;
            })}
            <td className="p-3">
              <div className="flex gap-2">
                {onBlock && (
                  <button onClick={() => onBlock(row.id)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${row.blocked ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}>
                    {row.blocked ? 'Unblock' : 'Block'}
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(row.id)}
                    className="text-xs font-semibold px-3 py-1 rounded-full border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
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
  { key: 'DASHBOARD', label: 'Dashboard', icon: <BarChart2 className="w-5 h-5" /> },
  { key: 'STUDENTS', label: 'Students', icon: <GraduationCap className="w-5 h-5" /> },
  { key: 'RECRUITERS', label: 'Recruiters', icon: <Building2 className="w-5 h-5" /> },
  { key: 'JOBS', label: 'Jobs', icon: <Briefcase className="w-5 h-5" /> },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  const fetchData = async () => {
    try {
      const [s, st, rc, jb] = await Promise.all([
        getDashboardStats(), getAllStudents(), getAllRecruiters(), getAllJobs()
      ]);
      setStats(s || {}); setStudents(st || []); setRecruiters(rc || []); setJobs(jb || []);
    } catch (e) { console.error("Admin fetch error:", e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleBlock = async (id) => { try { await toggleUserBlock(id); fetchData(); } catch (e) { console.error(e); } };
  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this user?")) { try { await deleteUser(id); fetchData(); } catch (e) { console.error(e); } }
  };
  const handleToggleJob = async (id) => { try { await toggleJobStatus(id); fetchData(); } catch (e) { console.error(e); } };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 pt-6 pb-12 flex gap-5 items-start">

        {/* Sidebar */}
        <div className="w-[220px] flex-shrink-0 sticky top-[70px] hidden lg:block">
          <div className="card overflow-hidden">
            <div className="admin-banner h-16 flex items-end px-4 pb-3">
              <span className="text-white font-bold text-sm">Admin Panel</span>
            </div>
            <div className="p-3 flex flex-col gap-1">
              {TABS.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2.5 text-sm font-medium px-3 py-2.5 rounded-lg w-full text-left transition-colors ${activeTab === tab.key ? 'bg-emerald-50 text-zidio-green font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <span className={activeTab === tab.key ? 'text-zidio-green' : 'text-gray-400'}>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* Mobile Tab Bar */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-1">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-1.5 ${activeTab === tab.key ? 'bg-zidio-green text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'DASHBOARD' && (
            <>
              <h1 className="text-xl font-bold text-gray-900">Platform Overview</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<GraduationCap className="w-6 h-6 text-blue-600" />} label="Total Students" value={stats.totalStudents ?? students.length} color="bg-blue-50" />
                <StatCard icon={<Building2 className="w-6 h-6 text-violet-600" />} label="Total Recruiters" value={stats.totalRecruiters ?? recruiters.length} color="bg-violet-50" />
                <StatCard icon={<Briefcase className="w-6 h-6 text-amber-600" />} label="Total Jobs" value={stats.totalJobs ?? jobs.length} color="bg-amber-50" />
                <StatCard icon={<CheckCircle className="w-6 h-6 text-emerald-600" />} label="Active Jobs" value={jobs.filter(j => j.active).length} color="bg-emerald-50" />
              </div>
            </>
          )}

          {activeTab === 'STUDENTS' && (
            <div className="card p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Student Users ({students.length})</h2>
              <UserTable
                data={students}
                columns={['ID', 'Name', 'Email', 'Status']}
                onBlock={handleBlock}
                onDelete={handleDelete}
              />
            </div>
          )}

          {activeTab === 'RECRUITERS' && (
            <div className="card p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recruiter Users ({recruiters.length})</h2>
              <UserTable
                data={recruiters}
                columns={['ID', 'Name', 'CompanyName', 'Status']}
                onBlock={handleBlock}
                onDelete={handleDelete}
              />
            </div>
          )}

          {activeTab === 'JOBS' && (
            <div className="card p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Job Postings ({jobs.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {['Title', 'Company', 'Location', 'Status', 'Action'].map(c => (
                        <th key={c} className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-gray-400">No jobs found</td></tr>
                    ) : jobs.map((job, i) => (
                      <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors animate-fadeInUp" style={{ animationDelay: `${i * 0.03}s` }}>
                        <td className="p-3 text-sm font-medium text-gray-900 max-w-[180px] truncate">{job.title}</td>
                        <td className="p-3 text-sm text-gray-600">{job.companyName}</td>
                        <td className="p-3 text-sm text-gray-500">{job.location || '—'}</td>
                        <td className="p-3">
                          <span className={job.active ? 'badge-active' : 'badge-blocked'}>{job.active ? 'Active' : 'Inactive'}</span>
                        </td>
                        <td className="p-3">
                          <button onClick={() => handleToggleJob(job.id)}
                            className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${job.active ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}>
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
