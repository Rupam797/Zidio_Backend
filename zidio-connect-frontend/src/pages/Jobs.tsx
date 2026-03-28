import React, { useEffect, useState, useCallback } from 'react';
import Header from '../components/Header';
import { getAllJobs, applyForJob, createJob, toggleSaveJob } from '../api/jobs';
import { Search, MapPin, DollarSign, ClipboardList, Bookmark, BookmarkCheck, Briefcase, Filter, X, Clock, Loader2, Plus } from 'lucide-react';

const SkeletonCard = () => (
  <div className="card" style={{ padding: '1.25rem' }}>
    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.875rem' }}>
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '10px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}><div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 6 }} /><div className="skeleton" style={{ height: 11, width: '45%' }} /></div>
    </div>
    <div className="skeleton" style={{ height: 11, width: '100%', marginBottom: 6 }} />
    <div className="skeleton" style={{ height: 11, width: '80%', marginBottom: '1rem' }} />
    <div className="skeleton" style={{ height: 36, borderRadius: '999px' }} />
  </div>
);

const Chip = ({ icon: Icon, label, type }: any) => {
  const map: any = { job: { bg: 'var(--color-info-bg)', text: 'var(--color-info-text)' }, internship: { bg: 'var(--color-warn-bg)', text: 'var(--color-warn-text)' }, location: { bg: 'var(--bg-badge)', text: 'var(--text-secondary)' }, salary: { bg: 'var(--color-success-bg)', text: 'var(--color-success-text)' }, time: { bg: 'var(--bg-badge)', text: 'var(--text-muted)' } };
  const { bg, text } = map[type] || map.location;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.175rem 0.55rem', borderRadius: '999px', background: bg, color: text, fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
      {Icon && <Icon style={{ width: 12, height: 12 }} />}{label}
    </span>
  );
};

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostJob, setShowPostJob] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', companyName: '', location: '', description: '', salary: '', type: 'JOB', skills: '' });
  const [applying, setApplying] = useState<any>(null);
  const [saving, setSaving] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const role = localStorage.getItem('role');

  const fetchJobs = useCallback(async (pageNum = 0, append = false) => {
    try {
      const data = await getAllJobs({ keyword: search || undefined, type: typeFilter || undefined, location: locationFilter || undefined, page: pageNum, size: 12 });
      const items = data.content || data;
      if (append) setJobs(prev => [...prev, ...items]); else setJobs(Array.isArray(items) ? items : []);
      setTotalElements(data.totalElements || items.length || 0);
      setHasMore(data.last === false);
      setPage(pageNum);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setLoadingMore(false); }
  }, [search, typeFilter, locationFilter]);

  useEffect(() => { setLoading(true); const t = setTimeout(() => fetchJobs(0), 300); return () => clearTimeout(t); }, [fetchJobs]);

  const handleApply = async (jobId: any) => {
    if (showCoverLetter === jobId) {
      setApplying(jobId);
      try { await applyForJob(jobId, coverLetter || undefined); setJobs(prev => prev.map(j => j.id === jobId ? { ...j, alreadyApplied: true } : j)); setShowCoverLetter(null); setCoverLetter(''); }
      catch (err: any) { alert(err?.response?.data?.message || 'Application failed.'); }
      finally { setApplying(null); }
    } else { setShowCoverLetter(jobId); }
  };

  const handleSave = async (jobId: any) => {
    setSaving(jobId);
    try { await toggleSaveJob(jobId); setJobs(prev => prev.map(j => j.id === jobId ? { ...j, saved: !j.saved } : j)); }
    catch (e) { console.error(e); } finally { setSaving(null); }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await createJob(newJob); setShowPostJob(false); setNewJob({ title: '', companyName: '', location: '', description: '', salary: '', type: 'JOB', skills: '' }); fetchJobs(0); }
    catch { alert('Failed to post job.'); }
  };

  const clearFilters = () => { setSearch(''); setTypeFilter(''); setLocationFilter(''); };
  const hasFilters = search || typeFilter || locationFilter;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', transition: 'background 0.3s ease' }}>
      <Header />
      <main style={{ maxWidth: 1128, margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
        {/* Header row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Job Opportunities</h1>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{totalElements} position{totalElements !== 1 ? 's' : ''} available</p>
          </div>
          {(role === 'RECRUITER' || role === 'ADMIN') && (
            <button className="btn-outline" onClick={() => setShowPostJob(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              {showPostJob ? <><X style={{ width: 15, height: 15 }} />Cancel</> : <><Plus style={{ width: 15, height: 15 }} />Post a Job</>}
            </button>
          )}
        </div>

        {/* Search & filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)' }} />
              <input className="input-field" placeholder="Search by title, company, or keywords…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
            </div>
            <button className="btn-outline" onClick={() => setShowFilters(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0, ...(showFilters ? { background: 'var(--brand-dim)', borderColor: 'var(--brand)', color: 'var(--brand)' } : {}) }}>
              <Filter style={{ width: 15, height: 15 }} /><span className="hidden sm:block">Filters</span>
            </button>
          </div>
          {showFilters && (
            <div className="animate-fadeInUp" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field" style={{ width: 'auto', minWidth: 150 }}>
                <option value="">All Types</option><option value="JOB">Full-time Job</option><option value="INTERNSHIP">Internship</option>
              </select>
              <input className="input-field" placeholder="Filter by location…" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} style={{ width: 'auto', minWidth: 180 }} />
              {hasFilters && <button className="btn-ghost" onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><X style={{ width: 14, height: 14 }} />Clear</button>}
            </div>
          )}
        </div>

        {/* Post Job Form */}
        {showPostJob && (
          <div className="card animate-fadeInUp" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1.25rem', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />Post a New Job
            </h2>
            <form onSubmit={handlePostJob} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {[{ label: 'Job Title *', key: 'title', placeholder: 'e.g. Frontend Developer', required: true }, { label: 'Company Name *', key: 'companyName', placeholder: 'e.g. Zidio Corp', required: true }, { label: 'Location', key: 'location', placeholder: 'e.g. Remote, Bangalore' }, { label: 'Salary/Stipend', key: 'salary', placeholder: 'e.g. ₹30,000/month' }].map(({ label, key, placeholder, required }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>{label}</label>
                  <input className="input-field" placeholder={placeholder} required={required} value={(newJob as any)[key]} onChange={e => setNewJob({ ...newJob, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>Type *</label>
                <select className="input-field" value={newJob.type} onChange={e => setNewJob({ ...newJob, type: e.target.value })}><option value="JOB">Full-time Job</option><option value="INTERNSHIP">Internship</option></select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>Required Skills</label>
                <input className="input-field" placeholder="e.g. React, Node.js, Java" value={newJob.skills} onChange={e => setNewJob({ ...newJob, skills: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>Job Description *</label>
                <textarea className="input-field" rows={4} required placeholder="Describe the role, responsibilities, and requirements…" value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-primary">Post Job</button>
                <button type="button" className="btn-outline" onClick={() => setShowPostJob(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {loading ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />) : jobs.length > 0 ? (
            jobs.map((job, i) => (
              <div key={job.id} className="card animate-fadeInUp" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', animationDelay: `${i < 12 ? i * 0.04 : 0}s` }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '10px', flexShrink: 0, background: 'var(--brand-dim)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>{(job.companyName || 'Z').charAt(0)}</div>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{job.title}</h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.companyName || job.recruiterName}</p>
                      </div>
                    </div>
                    {role === 'STUDENT' && (
                      <button onClick={() => handleSave(job.id)} disabled={saving === job.id} style={{ background: 'none', border: 'none', cursor: 'pointer', color: job.saved ? 'var(--brand)' : 'var(--text-muted)', padding: '0.25rem', flexShrink: 0, transition: 'color 0.15s' }}>
                        {job.saved ? <BookmarkCheck style={{ width: 18, height: 18 }} /> : <Bookmark style={{ width: 18, height: 18 }} />}
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                    {job.type     && <Chip label={job.type}     type={job.type === 'INTERNSHIP' ? 'internship' : 'job'} icon={Briefcase} />}
                    {job.location && <Chip label={job.location} type="location" icon={MapPin} />}
                    {job.salary   && <Chip label={job.salary}   type="salary"   icon={DollarSign} />}
                    {job.timeAgo  && <Chip label={job.timeAgo}  type="time"     icon={Clock} />}
                  </div>
                  {job.skills && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.75rem' }}>
                      {job.skills.split(',').slice(0, 4).map((s: string, idx: number) => <span key={idx} className="skill-tag">{s.trim()}</span>)}
                    </div>
                  )}
                  <p style={{ margin: '0 0 0.625rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.description || 'No description provided.'}
                  </p>
                  {job.applicantCount > 0 && <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}</p>}
                </div>
                {showCoverLetter === job.id && (
                  <div style={{ marginBottom: '0.75rem' }} className="animate-fadeInUp">
                    <textarea className="input-field" rows={3} placeholder="Write a cover letter (optional)…" value={coverLetter} onChange={e => setCoverLetter(e.target.value)} style={{ resize: 'none', fontSize: '0.85rem', marginBottom: 0 }} />
                  </div>
                )}
                {role === 'STUDENT' && (
                  job.alreadyApplied ? (
                    <div style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-success-text)', background: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', borderRadius: '999px', padding: '0.5rem' }}>✓ Applied</div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleApply(job.id)} disabled={applying === job.id} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                        {applying === job.id ? 'Applying…' : showCoverLetter === job.id ? 'Submit Application' : 'Apply Now'}
                      </button>
                      {showCoverLetter === job.id && (
                        <button onClick={() => { setShowCoverLetter(null); setCoverLetter(''); }} className="btn-ghost" style={{ padding: '0.5rem 0.75rem' }}><X style={{ width: 16, height: 16 }} /></button>
                      )}
                    </div>
                  )
                )}
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0' }}>
              <Search style={{ width: 48, height: 48, color: 'var(--border-strong)', margin: '0 auto 0.75rem', display: 'block' }} />
              <p style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.5rem' }}>No jobs match your search.</p>
              {hasFilters && <button onClick={clearFilters} style={{ color: 'var(--brand)', fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear all filters</button>}
            </div>
          )}
        </div>

        {hasMore && !loading && (
          <div style={{ marginTop: '1.5rem' }}>
            <button onClick={() => { setLoadingMore(true); fetchJobs(page + 1, true); }} disabled={loadingMore} className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
              {loadingMore ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />Loading…</span> : 'Load More Jobs'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;