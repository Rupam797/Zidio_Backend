import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getAllJobs, applyForJob, createJob } from '../api/jobs';
import { Search, MapPin, DollarSign, ClipboardList } from 'lucide-react';

const SkeletonJobCard = () => (
  <div className="card p-5">
    <div className="skeleton h-4 w-2/3 mb-3" />
    <div className="skeleton h-3 w-1/2 mb-2" />
    <div className="skeleton h-3 w-full mb-1" />
    <div className="skeleton h-3 w-5/6 mb-4" />
    <div className="skeleton h-8 w-full rounded-full" />
  </div>
);

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostJob, setShowPostJob] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', companyName: '', location: '', description: '', salary: '' });
  const [applying, setApplying] = useState(null);
  const [search, setSearch] = useState('');

  const fetchJobs = async () => {
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await applyForJob(jobId);
      alert("Applied successfully!");
    } catch {
      alert("Application failed. Ensure you are logged in as a Student.");
    } finally {
      setApplying(null);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await createJob(newJob);
      alert("Job posted successfully!");
      setShowPostJob(false);
      setNewJob({ title: '', companyName: '', location: '', description: '', salary: '' });
      fetchJobs();
    } catch {
      alert("Failed to post job. Ensure you are logged in as a Recruiter.");
    }
  };

  const filtered = jobs.filter(j =>
    !search || j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[1128px] mx-auto pt-6 px-4 pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Opportunities</h1>
            <p className="text-sm text-gray-500 mt-0.5">{jobs.length} positions available</p>
          </div>
          <button onClick={() => setShowPostJob(!showPostJob)} className="btn-outline">
            {showPostJob ? '✕ Cancel' : '+ Post a Job'}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input-field pl-10"
            placeholder="Search by title, company, or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Post Job Form */}
        {showPostJob && (
          <div className="card p-6 mb-6 animate-fadeInUp">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-gray-700"/> Post a New Job</h2>
            <form onSubmit={handlePostJob} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input className="input-field" placeholder="e.g. Frontend Developer" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input className="input-field" placeholder="e.g. Zidio Corp" required value={newJob.companyName} onChange={e => setNewJob({...newJob, companyName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input className="input-field" placeholder="e.g. Remote, Bangalore" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary/Stipend</label>
                <input className="input-field" placeholder="e.g. ₹30,000/month" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                <textarea className="input-field" rows="4" placeholder="Describe the role, responsibilities, and requirements…" required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" className="btn-primary">Post Job</button>
                <button type="button" className="btn-outline" onClick={() => setShowPostJob(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({length: 6}).map((_, i) => <SkeletonJobCard key={i} />)
          ) : filtered.length > 0 ? filtered.map((job, i) => (
            <div key={job.id} className="card p-5 flex flex-col justify-between animate-fadeInUp" style={{ animationDelay: `${i * 0.04}s` }}>
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-lg font-bold text-emerald-700 flex-shrink-0">
                    {(job.companyName || 'Z').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 leading-tight">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.companyName}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {job.location && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>}
                  {job.salary && <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{job.description || 'No description provided.'}</p>
              </div>
              <button
                onClick={() => handleApply(job.id)}
                disabled={applying === job.id}
                className="btn-primary w-full justify-center"
              >
                {applying === job.id ? 'Applying…' : 'Apply Now'}
              </button>
            </div>
          )) : (
            <div className="col-span-3 text-center py-16">
              <div className="flex justify-center mb-3">
                <Search className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No jobs match your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Jobs;
