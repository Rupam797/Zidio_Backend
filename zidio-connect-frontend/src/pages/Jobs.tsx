import React, { useEffect, useState, useCallback } from 'react';
import Header from '../components/Header';
import { getAllJobs, applyForJob, createJob, toggleSaveJob, getJobDetail } from '../api/jobs';
import { Search, MapPin, DollarSign, ClipboardList, Bookmark, BookmarkCheck, ChevronDown, Briefcase, Filter, X, Clock, Loader2 } from 'lucide-react';

const SkeletonJobCard = () => (
  <div className="card p-5">
    <div className="flex gap-3 mb-3">
      <div className="skeleton w-10 h-10 rounded-lg" />
      <div className="flex-1">
        <div className="skeleton h-4 w-2/3 mb-1" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
    <div className="skeleton h-3 w-full mb-1" />
    <div className="skeleton h-3 w-5/6 mb-4" />
    <div className="skeleton h-9 w-full rounded-full" />
  </div>
);

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostJob, setShowPostJob] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', companyName: '', location: '', description: '', salary: '', type: 'JOB', skills: '' });
  const [applying, setApplying] = useState(null);
  const [saving, setSaving] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCoverLetter, setShowCoverLetter] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const role = localStorage.getItem('role');

  const fetchJobs = useCallback(async (pageNum = 0, append = false) => {
    try {
      const data = await getAllJobs({
        keyword: search || undefined,
        type: typeFilter || undefined,
        location: locationFilter || undefined,
        page: pageNum,
        size: 12
      });
      const items = data.content || data;
      if (append) {
        setJobs(prev => [...prev, ...items]);
      } else {
        setJobs(Array.isArray(items) ? items : []);
      }
      setTotalElements(data.totalElements || items.length || 0);
      setHasMore(data.last === false);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, typeFilter, locationFilter]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => fetchJobs(0), 300);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const handleApply = async (jobId) => {
    if (showCoverLetter === jobId) {
      // Submit with cover letter
      setApplying(jobId);
      try {
        await applyForJob(jobId, coverLetter || undefined);
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, alreadyApplied: true } : j));
        setShowCoverLetter(null);
        setCoverLetter('');
      } catch (err: any) {
        const msg = err?.response?.data?.message || "Application failed.";
        alert(msg);
      } finally {
        setApplying(null);
      }
    } else {
      setShowCoverLetter(jobId);
    }
  };

  const handleSave = async (jobId) => {
    setSaving(jobId);
    try {
      await toggleSaveJob(jobId);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, saved: !j.saved } : j));
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await createJob(newJob);
      setShowPostJob(false);
      setNewJob({ title: '', companyName: '', location: '', description: '', salary: '', type: 'JOB', skills: '' });
      fetchJobs(0);
    } catch {
      alert("Failed to post job. Ensure you are logged in as a Recruiter.");
    }
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    fetchJobs(page + 1, true);
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setLocationFilter('');
  };

  const hasFilters = search || typeFilter || locationFilter;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[1128px] mx-auto pt-6 px-4 pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Job Opportunities</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{totalElements} position{totalElements !== 1 ? 's' : ''} available</p>
          </div>
          {(role === 'RECRUITER' || role === 'ADMIN') && (
            <button onClick={() => setShowPostJob(!showPostJob)} className="btn-outline">
              {showPostJob ? '✕ Cancel' : '+ Post a Job'}
            </button>
          )}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="input-field pl-10"
                placeholder="Search by title, company, or description…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-outline flex items-center gap-2 ${showFilters ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : ''}`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:block">Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 animate-fadeInUp">
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="input-field w-auto min-w-[140px]"
              >
                <option value="">All Types</option>
                <option value="JOB">Full-time Job</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
              <input
                className="input-field w-auto min-w-[180px]"
                placeholder="Filter by location…"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
              />
              {hasFilters && (
                <button onClick={clearFilters} className="btn-outline text-sm flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Post Job Form (Recruiter only) */}
        {showPostJob && (
          <div className="card p-6 mb-6 animate-fadeInUp">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-gray-700 dark:text-gray-300"/> Post a New Job</h2>
            <form onSubmit={handlePostJob} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title *</label>
                <input className="input-field" placeholder="e.g. Frontend Developer" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
                <input className="input-field" placeholder="e.g. Zidio Corp" required value={newJob.companyName} onChange={e => setNewJob({...newJob, companyName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input className="input-field" placeholder="e.g. Remote, Bangalore" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary/Stipend</label>
                <input className="input-field" placeholder="e.g. ₹30,000/month" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
                <select className="input-field" value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})}>
                  <option value="JOB">Full-time Job</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Required Skills</label>
                <input className="input-field" placeholder="e.g. React, Node.js, Java" value={newJob.skills} onChange={e => setNewJob({...newJob, skills: e.target.value})} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Description *</label>
                <textarea className="input-field" rows={4} placeholder="Describe the role, responsibilities, and requirements…" required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} />
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
          ) : jobs.length > 0 ? jobs.map((job, i) => (
            <div key={job.id} className="card p-5 flex flex-col justify-between animate-fadeInUp" style={{ animationDelay: `${i < 12 ? i * 0.04 : 0}s` }}>
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-lg font-bold text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                      {(job.companyName || 'Z').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">{job.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{job.companyName || job.recruiterName}</p>
                    </div>
                  </div>
                  {role === 'STUDENT' && (
                    <button
                      onClick={() => handleSave(job.id)}
                      disabled={saving === job.id}
                      className="text-gray-400 hover:text-emerald-600 transition-colors p-1"
                      title={job.saved ? 'Unsave job' : 'Save job'}
                    >
                      {job.saved ? <BookmarkCheck className="w-5 h-5 text-emerald-600" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {job.type && <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.type}</span>}
                  {job.location && <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>}
                  {job.salary && <span className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>}
                  {job.timeAgo && <span className="text-xs bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.timeAgo}</span>}
                </div>
                {job.skills && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.skills.split(',').slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">{skill.trim()}</span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{job.description || 'No description provided.'}</p>
                {job.applicantCount > 0 && <p className="text-xs text-gray-400 mb-2">{job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}</p>}
              </div>

              {/* Cover letter modal */}
              {showCoverLetter === job.id && (
                <div className="mb-3 animate-fadeInUp">
                  <textarea
                    className="input-field text-sm mb-2"
                    rows={3}
                    placeholder="Write a cover letter (optional)…"
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                  />
                </div>
              )}

              {role === 'STUDENT' && (
                job.alreadyApplied ? (
                  <div className="text-center text-sm font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 rounded-full py-2">✓ Applied</div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={applying === job.id}
                      className="btn-primary flex-1 justify-center"
                    >
                      {applying === job.id ? 'Applying…' : showCoverLetter === job.id ? 'Submit Application' : 'Apply Now'}
                    </button>
                    {showCoverLetter === job.id && (
                      <button onClick={() => { setShowCoverLetter(null); setCoverLetter(''); }} className="btn-outline px-3">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          )) : (
            <div className="col-span-3 text-center py-16">
              <div className="flex justify-center mb-3">
                <Search className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No jobs match your search.</p>
              {hasFilters && <button onClick={clearFilters} className="text-zidio-green text-sm font-semibold mt-2 hover:underline">Clear all filters</button>}
            </div>
          )}
        </div>

        {/* Load More */}
        {hasMore && !loading && (
          <div className="mt-6">
            <button onClick={handleLoadMore} disabled={loadingMore} className="btn-outline w-full justify-center py-3">
              {loadingMore ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</span> : 'Load More Jobs'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;
