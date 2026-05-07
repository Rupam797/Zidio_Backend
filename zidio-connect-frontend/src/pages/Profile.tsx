import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axiosInstance from '../api/axios';
import { updateProfile, uploadProfilePicture, uploadBackgroundPicture, uploadResume } from '../api/profile';
import { getDashboardStats } from '../api/jobs';
import { getMyPosts } from '../api/posts';
import { PostCard } from '../components/Feed';
import { Camera, Edit2, FileText, Globe, Code, Briefcase, Book, ExternalLink, Save, X, Users, CheckCircle } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState('STUDENT');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({ name: '', skills: '', companyName: '', bio: '', phone: '', college: '', branch: '', yearOfPassing: '', linkedinUrl: '', githubUrl: '', portfolioUrl: '', experience: '' });
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const r = await axiosInstance.get('/student/profile');
      setProfile(r.data); setRole('STUDENT');
      setEditForm({ name: r.data.name || '', skills: r.data.skills || '', bio: r.data.bio || '', phone: r.data.phone || '', college: r.data.college || '', branch: r.data.branch || '', yearOfPassing: r.data.yearOfPassing || '', linkedinUrl: r.data.linkedinUrl || '', githubUrl: r.data.githubUrl || '', portfolioUrl: r.data.portfolioUrl || '', experience: r.data.experience || '', companyName: '' });
      try { setStats(await getDashboardStats()); } catch {}
    } catch {
      try {
        const r = await axiosInstance.get('/recruiter/profile');
        setProfile(r.data); setRole('RECRUITER');
        setEditForm({ name: r.data.name || '', companyName: r.data.companyName || '', bio: r.data.bio || '', skills: '', phone: '', college: '', branch: '', yearOfPassing: '', linkedinUrl: '', githubUrl: '', portfolioUrl: '', experience: '' });
      } catch (e) { console.error(e); }
    } finally { setLoading(false); }

    setLoadingPosts(true);
    try {
      const posts = await getMyPosts();
      setMyPosts(posts);
    } catch (e) { console.error(e); } finally { setLoadingPosts(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await updateProfile(role, editForm); setIsEditing(false); fetchProfile(); }
    catch { alert('Failed to update.'); }
    finally { setSaving(false); }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      if (type === 'resume') await uploadResume(file);
      else if (type === 'background') await uploadBackgroundPicture(role, file);
      else await uploadProfilePicture(role, file);
      fetchProfile();
    } catch { alert('Upload failed.'); }
    finally { setUploading(false); }
  };

  const initials = profile?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const fieldLabel = (text: string) => (
    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>{text}</label>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', transition: 'background 0.3s ease' }}>
      <Header />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
        {loading ? (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="skeleton" style={{ height: 160, borderRadius: 0 }} />
            <div style={{ padding: '4rem 1.5rem 1.5rem' }}>
              <div className="skeleton" style={{ height: 18, width: '35%', marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 13, width: '55%', marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 13, width: '30%' }} />
            </div>
          </div>
        ) : (
          <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Main profile card (Hero) */}
            <div className="card" style={{ overflow: 'hidden' }}>
              {/* Banner */}
              <div 
                className="profile-banner banner-container" 
                style={{ 
                  height: 160, 
                  position: 'relative',
                  backgroundImage: profile?.backgroundPictureUrl ? `url(${profile.backgroundPictureUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} 
              >
                <label className="banner-overlay">
                  <Camera style={{ width: 16, height: 16 }} /> Edit Header
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e, 'background')} />
                </label>
              </div>

              {/* Avatar + Info */}
              <div style={{ padding: '0 1.5rem 1.5rem', marginTop: '-48px' }}>
                {/* Avatar */}
                <div style={{ position: 'relative', width: 110, display: 'inline-block', marginBottom: '1rem' }}>
                  <div className="avatar-container" style={{ width: 110, height: 110, borderRadius: '50%', border: '4px solid var(--bg-card)', boxShadow: 'var(--shadow-md)', overflow: 'hidden', background: 'var(--bg-badge)', position: 'relative' }}>
                    {profile?.profilePictureUrl ? (
                      <img src={profile.profilePictureUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-dim)', color: 'var(--brand)', fontSize: '2rem', fontWeight: 800 }}>{initials}</div>
                    )}
                    <label className="avatar-overlay">
                      <Camera style={{ width: 22, height: 22 }} />
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e, 'picture')} />
                    </label>
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdate} style={{ maxWidth: 600 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        {fieldLabel('Full Name *')}
                        <input className="input-field" placeholder="Full Name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
                      </div>
                      {role === 'STUDENT' && (
                        <div>
                          {fieldLabel('Phone')}
                          <input className="input-field" placeholder="Phone number" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                        </div>
                      )}
                      {role === 'RECRUITER' && (
                        <div>
                          {fieldLabel('Company Name')}
                          <input className="input-field" placeholder="Company Name" value={editForm.companyName} onChange={e => setEditForm({ ...editForm, companyName: e.target.value })} />
                        </div>
                      )}
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      {fieldLabel('Bio')}
                      <textarea className="input-field" rows={2} placeholder="Short bio…" value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} style={{ resize: 'none' }} />
                    </div>
                    {role === 'STUDENT' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                          <div>{fieldLabel('College')}<input className="input-field" placeholder="College/University" value={editForm.college} onChange={e => setEditForm({ ...editForm, college: e.target.value })} /></div>
                          <div>{fieldLabel('Branch')}<input className="input-field" placeholder="e.g. Computer Science" value={editForm.branch} onChange={e => setEditForm({ ...editForm, branch: e.target.value })} /></div>
                          <div>{fieldLabel('Year of Passing')}<input className="input-field" placeholder="e.g. 2025" value={editForm.yearOfPassing} onChange={e => setEditForm({ ...editForm, yearOfPassing: e.target.value })} /></div>
                          <div>{fieldLabel('Skills (Comma separated)')}<input className="input-field" placeholder="e.g. React, Java, Python" value={editForm.skills} onChange={e => setEditForm({ ...editForm, skills: e.target.value })} /></div>
                          <div>{fieldLabel('LinkedIn URL')}<input className="input-field" placeholder="https://linkedin.com/in/…" value={editForm.linkedinUrl} onChange={e => setEditForm({ ...editForm, linkedinUrl: e.target.value })} /></div>
                          <div>{fieldLabel('GitHub URL')}<input className="input-field" placeholder="https://github.com/…" value={editForm.githubUrl} onChange={e => setEditForm({ ...editForm, githubUrl: e.target.value })} /></div>
                          <div>{fieldLabel('Portfolio URL')}<input className="input-field" placeholder="https://yourportfolio.com" value={editForm.portfolioUrl} onChange={e => setEditForm({ ...editForm, portfolioUrl: e.target.value })} /></div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                          {fieldLabel('Experience')}
                          <textarea className="input-field" rows={4} placeholder="Prior internships, projects, or relevant experience…" value={editForm.experience} onChange={e => setEditForm({ ...editForm, experience: e.target.value })} style={{ resize: 'vertical' }} />
                        </div>
                      </>
                    )}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Save style={{ width: 15, height: 15 }} />{saving ? 'Saving…' : 'Save Changes'}
                      </button>
                      <button type="button" className="btn-outline" onClick={() => setIsEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <X style={{ width: 15, height: 15 }} />Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h1 style={{ margin: '0 0 0.375rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                          {profile?.name}
                        </h1>

                        {/* Role & Connections Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', background: role === 'STUDENT' ? 'var(--brand-dim)' : role === 'RECRUITER' ? 'var(--color-info-bg)' : 'var(--color-warn-bg)', color: role === 'STUDENT' ? 'var(--brand)' : role === 'RECRUITER' ? 'var(--color-info-text)' : 'var(--color-warn-text)', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                            {role}
                          </span>
                          
                          {role === 'STUDENT' && stats?.connections !== undefined && (
                            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#f3e8ff', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                              <Users style={{ width: 13, height: 13 }} />
                              {stats.connections} Connections
                            </span>
                          )}
                        </div>

                        {profile?.bio && <p style={{ margin: '0.5rem 0 0.875rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: 600 }}>{profile.bio}</p>}

                        {/* Company (Recruiter) */}
                        {role === 'RECRUITER' && profile?.companyName && (
                          <p style={{ margin: '0 0 0.75rem', color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.95rem' }}>
                            <Briefcase style={{ width: 16, height: 16 }} />{profile.companyName}
                          </p>
                        )}

                        {/* Meta info */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          <span>{profile?.email}</span>
                          {role === 'STUDENT' && profile?.college && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Book style={{ width: 14, height: 14 }} />{profile.college}{profile.branch ? ` · ${profile.branch}` : ''}</span>}
                          {role === 'STUDENT' && profile?.yearOfPassing && <span>Batch {profile.yearOfPassing}</span>}
                          {profile?.phone && <span>{profile.phone}</span>}
                        </div>

                        {/* Links */}
                        {role === 'STUDENT' && (profile?.linkedinUrl || profile?.githubUrl || profile?.portfolioUrl) && (
                          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            {profile.linkedinUrl && (
                              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-info-text)', textDecoration: 'none' }}>
                                <Globe style={{ width: 14, height: 14 }} />LinkedIn<ExternalLink style={{ width: 11, height: 11 }} />
                              </a>
                            )}
                            {profile.githubUrl && (
                              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                                <Code style={{ width: 14, height: 14 }} />GitHub<ExternalLink style={{ width: 11, height: 11 }} />
                              </a>
                            )}
                            {profile.portfolioUrl && (
                              <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand)', textDecoration: 'none' }}>
                                <Globe style={{ width: 14, height: 14 }} />Portfolio<ExternalLink style={{ width: 11, height: 11 }} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flexShrink: 0, marginTop: '0.5rem' }}>
                        <button onClick={() => setIsEditing(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <Edit2 style={{ width: 14, height: 14 }} />Edit Profile
                        </button>
                        {role === 'STUDENT' && (
                          <label className="btn-outline" style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <FileText style={{ width: 14, height: 14 }} />Upload Resume
                            <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => handleFile(e, 'resume')} disabled={uploading} />
                          </label>
                        )}
                        {role === 'STUDENT' && profile?.resumeUrl && (
                          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none' }}>
                            <FileText style={{ width: 14, height: 14 }} />View Resume<ExternalLink style={{ width: 12, height: 12 }} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Two-Column Details Layout */}
            {!isEditing && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Sidebar (About) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  
                  {/* Skills Section */}
                  {role === 'STUDENT' && profile?.skills && (
                    <div className="card" style={{ padding: '1.25rem' }}>
                      <h3 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Top Skills</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {profile.skills.split(',').map((skill: string, i: number) => {
                          const s = skill.trim();
                          if (!s) return null;
                          return (
                            <span key={i} style={{ 
                              display: 'inline-flex', alignItems: 'center', gap: '0.375rem', 
                              padding: '0.375rem 0.75rem', background: 'var(--bg-badge)', 
                              color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600, 
                              borderRadius: '8px', border: '1px solid var(--border-default)', 
                              transition: 'all 0.2s', cursor: 'default'
                            }} 
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }} 
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>
                              <CheckCircle style={{ width: 14, height: 14, color: 'var(--brand)' }} />
                              {s}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Experience Section */}
                  {role === 'STUDENT' && profile?.experience && (
                    <div className="card" style={{ padding: '1.25rem' }}>
                      <h3 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Experience</h3>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.65 }}>
                        {profile.experience}
                      </p>
                    </div>
                  )}

                  {/* Dashboard Stats (Student) */}
                  {role === 'STUDENT' && stats && (
                    <div className="card" style={{ padding: '1.25rem' }}>
                      <h3 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Dashboard Overview</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                          { value: stats.totalApplications, label: 'Applications Sent', color: 'var(--brand)' },
                          { value: stats.shortlisted, label: 'Shortlisted By Recruiters', color: 'var(--color-success-text)' },
                          { value: stats.savedJobs, label: 'Saved Jobs', color: 'var(--color-info-text)' }
                        ].map(s => (
                          <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0.75rem', background: 'var(--bg-badge)', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</span>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: s.color }}>{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recruiter Stats Fallback */}
                  {role === 'RECRUITER' && (
                    <div className="card" style={{ padding: '1.25rem' }}>
                      <h3 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Overview</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {['Connections', 'Active Job Posts', 'Profile Views'].map(l => (
                          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0.75rem', background: 'var(--bg-badge)', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{l}</span>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>—</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Main Area (Activity / Posts) */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                  <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Activity & Postings</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, background: 'var(--bg-badge)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      {myPosts.length} Post{myPosts.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {loadingPosts ? (
                      <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div className="animate-spin" style={{ width: 24, height: 24, border: '3px solid var(--border-default)', borderTopColor: 'var(--brand)', borderRadius: '50%', margin: '0 auto 1rem' }} />
                        Loading your posts...
                      </div>
                    ) : myPosts.length === 0 ? (
                      <div className="card" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 1rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>You haven't posted anything yet.</p>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Share your thoughts, projects, or achievements with your network!</p>
                      </div>
                    ) : (
                      myPosts.map((post, i) => (
                        <PostCard key={post.id} post={post} delay={i < 5 ? i * 0.1 : 0} />
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;