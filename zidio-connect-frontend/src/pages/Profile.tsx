import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axiosInstance from '../api/axios';
import { updateProfile, uploadProfilePicture, uploadResume } from '../api/profile';
import { getDashboardStats } from '../api/jobs';
import { Camera, Edit2, FileText, Globe, Code, Briefcase, Book, MapPin, ExternalLink } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('STUDENT');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '', skills: '', companyName: '', bio: '',
    phone: '', college: '', branch: '', yearOfPassing: '',
    linkedinUrl: '', githubUrl: '', experience: ''
  });
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchProfile = async () => {
    try {
      const r = await axiosInstance.get('/student/profile');
      setProfile(r.data);
      setRole('STUDENT');
      setEditForm({
        name: r.data.name || '', skills: r.data.skills || '', bio: r.data.bio || '',
        phone: r.data.phone || '', college: r.data.college || '', branch: r.data.branch || '',
        yearOfPassing: r.data.yearOfPassing || '', linkedinUrl: r.data.linkedinUrl || '',
        githubUrl: r.data.githubUrl || '', experience: r.data.experience || '', companyName: ''
      });
      // Fetch dashboard stats for student
      try {
        const s = await getDashboardStats();
        setStats(s);
      } catch {}
    } catch {
      try {
        const r = await axiosInstance.get('/recruiter/profile');
        setProfile(r.data);
        setRole('RECRUITER');
        setEditForm({
          name: r.data.name || '', companyName: r.data.companyName || '', bio: r.data.bio || '',
          skills: '', phone: '', college: '', branch: '', yearOfPassing: '',
          linkedinUrl: '', githubUrl: '', experience: ''
        });
      } catch (e) { console.error(e); }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(role, editForm);
      setIsEditing(false);
      fetchProfile();
    } catch { alert('Failed to update.'); }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      if (type === 'resume') await uploadResume(file);
      else await uploadProfilePicture(role, file);
      fetchProfile();
    } catch { alert('Upload failed.'); }
    finally { setUploading(false); }
  };

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[860px] mx-auto pt-6 px-4 pb-12">
        {loading ? (
          <div className="card overflow-hidden animate-fadeIn">
            <div className="skeleton h-40 rounded-none" />
            <div className="p-6 pt-16">
              <div className="skeleton h-5 w-40 mb-2" />
              <div className="skeleton h-3 w-64 mb-1" />
              <div className="skeleton h-3 w-32" />
            </div>
          </div>
        ) : (
          <div className="animate-fadeInUp">
            {/* Profile Card */}
            <div className="card overflow-hidden">
              {/* Banner */}
              <div className="profile-banner h-40 relative">
                {/* Avatar */}
                <div className="absolute -bottom-12 left-6 group">
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-white dark:bg-gray-800 relative">
                    {profile?.profilePictureUrl ? (
                      <img src={profile.profilePictureUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-3xl font-bold">{initials}</div>
                    )}
                    <label className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white cursor-pointer rounded-full">
                      <Camera className="w-6 h-6" />
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, 'picture')} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="px-6 pt-16 pb-6">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="flex flex-col gap-4 max-w-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                        <input className="input-field" placeholder="Full Name" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} required />
                      </div>
                      {role === 'STUDENT' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                          <input className="input-field" placeholder="Phone number" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                        </div>
                      )}
                      {role === 'RECRUITER' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                          <input className="input-field" placeholder="Company Name" value={editForm.companyName} onChange={e => setEditForm({...editForm, companyName: e.target.value})} />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                      <textarea className="input-field" rows={2} placeholder="Short bio…" value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} />
                    </div>
                    {role === 'STUDENT' && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">College</label>
                            <input className="input-field" placeholder="College/University" value={editForm.college} onChange={e => setEditForm({...editForm, college: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch</label>
                            <input className="input-field" placeholder="e.g. Computer Science" value={editForm.branch} onChange={e => setEditForm({...editForm, branch: e.target.value})} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills</label>
                          <input className="input-field" placeholder="e.g. React, Java, Python" value={editForm.skills} onChange={e => setEditForm({...editForm, skills: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
                            <input className="input-field" placeholder="https://linkedin.com/in/…" value={editForm.linkedinUrl} onChange={e => setEditForm({...editForm, linkedinUrl: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
                            <input className="input-field" placeholder="https://github.com/…" value={editForm.githubUrl} onChange={e => setEditForm({...editForm, githubUrl: e.target.value})} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year of Passing</label>
                          <input className="input-field" placeholder="e.g. 2025" value={editForm.yearOfPassing} onChange={e => setEditForm({...editForm, yearOfPassing: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience</label>
                          <textarea className="input-field" rows={3} placeholder="Prior internships, projects, or relevant experience…" value={editForm.experience} onChange={e => setEditForm({...editForm, experience: e.target.value})} />
                        </div>
                      </>
                    )}
                    <div className="flex gap-3">
                      <button type="submit" className="btn-primary">Save Changes</button>
                      <button type="button" className="btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{profile?.name}</h1>
                        {profile?.bio && <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-lg">{profile.bio}</p>}
                        {role === 'STUDENT' && profile?.skills && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {profile.skills.split(',').map((skill: string, i: number) => (
                              <span key={i} className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-700">{skill.trim()}</span>
                            ))}
                          </div>
                        )}
                        {role === 'RECRUITER' && profile?.companyName && (
                          <p className="text-gray-600 dark:text-gray-400 font-medium mt-0.5 flex items-center gap-1"><Briefcase className="w-4 h-4" /> {profile.companyName}</p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
                          <span>{profile?.email}</span>
                          <span className={`font-semibold ${role === 'STUDENT' ? 'text-emerald-600' : 'text-blue-600'}`}>{role}</span>
                        </div>
                        {role === 'STUDENT' && (
                          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {profile?.college && <span className="flex items-center gap-1"><Book className="w-4 h-4" /> {profile.college}{profile.branch ? ` · ${profile.branch}` : ''}</span>}
                            {profile?.yearOfPassing && <span>Batch {profile.yearOfPassing}</span>}
                            {profile?.phone && <span>{profile.phone}</span>}
                          </div>
                        )}
                        {/* Social Links */}
                        {role === 'STUDENT' && (profile?.linkedinUrl || profile?.githubUrl) && (
                          <div className="flex gap-3 mt-3">
                            {profile.linkedinUrl && (
                              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                                <Globe className="w-4 h-4" /> LinkedIn <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {profile.githubUrl && (
                              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-800 dark:text-gray-200 hover:underline">
                                <Code className="w-4 h-4" /> GitHub <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}
                        {/* Experience */}
                        {role === 'STUDENT' && profile?.experience && (
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 max-w-lg">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Experience</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{profile.experience}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center gap-2"><Edit2 className="w-4 h-4"/> Edit Profile</button>
                        {role === 'STUDENT' && (
                          <label className={`btn-outline cursor-pointer flex items-center gap-2 ${uploading ? 'opacity-60' : ''}`}>
                            <FileText className="w-4 h-4" /> Upload Resume
                            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => handleFile(e, 'resume')} disabled={uploading} />
                          </label>
                        )}
                        {role === 'STUDENT' && profile?.resumeUrl && (
                          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-outline flex items-center gap-2">
                            <FileText className="w-4 h-4" /> View Resume <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {role === 'STUDENT' && stats ? (
                <>
                  <div className="card p-4 flex flex-col items-center text-center">
                    <p className="text-2xl font-bold text-zidio-green">{stats.totalApplications}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Applications</p>
                  </div>
                  <div className="card p-4 flex flex-col items-center text-center">
                    <p className="text-2xl font-bold text-emerald-600">{stats.shortlisted}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Shortlisted</p>
                  </div>
                  <div className="card p-4 flex flex-col items-center text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.savedJobs}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Saved Jobs</p>
                  </div>
                  <div className="card p-4 flex flex-col items-center text-center">
                    <p className="text-2xl font-bold text-indigo-600">{stats.connections}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Connections</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="card p-4 flex flex-col items-center text-center">
                    <p className="text-2xl font-bold text-zidio-green">—</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Connections</p>
                  </div>
                  <div className="card p-4 flex flex-col items-center text-center">
                    <p className="text-2xl font-bold text-zidio-green">—</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Applications Sent</p>
                  </div>
                  <div className="card p-4 flex flex-col items-center text-center">
                    <p className="text-2xl font-bold text-zidio-green">—</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Profile Views</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
