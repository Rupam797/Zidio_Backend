import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axiosInstance from '../api/axios';
import { updateProfile, uploadProfilePicture, uploadResume } from '../api/profile';
import { Camera, Edit2, FileText } from 'lucide-react';


const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('STUDENT');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', skills: '', companyName: '', bio: '' });
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      const r = await axiosInstance.get('/student/profile');
      setProfile(r.data); setRole('STUDENT');
      setEditForm({ name: r.data.name||'', skills: r.data.skills||'', bio: r.data.bio||'', companyName: '' });
    } catch {
      try {
        const r = await axiosInstance.get('/recruiter/profile');
        setProfile(r.data); setRole('RECRUITER');
        setEditForm({ name: r.data.name||'', companyName: r.data.companyName||'', bio: r.data.bio||'', skills: '' });
      } catch (e) { console.error(e); }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(role, editForm);
      setIsEditing(false); fetchProfile();
    } catch { alert('Failed to update.'); }
  };

  const handleFile = async (e, type) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try {
      if (type === 'resume') await uploadResume(file);
      else await uploadProfilePicture(role, file);
      alert(`${type === 'resume' ? 'Resume' : 'Photo'} uploaded!`);
      fetchProfile();
    } catch { alert('Upload failed.'); }
    finally { setUploading(false); }
  };

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || '?';

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
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white relative">
                    {profile?.profilePictureUrl ? (
                      <img src={profile.profilePictureUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 text-3xl font-bold">{initials}</div>
                    )}
                    <label className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white cursor-pointer rounded-full">
                      <Camera className="w-6 h-6" />
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFile(e,'picture')} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="px-6 pt-16 pb-6">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="flex flex-col gap-4 max-w-md">
                    <input className="input-field" placeholder="Full Name" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} required />
                    <textarea className="input-field" rows="2" placeholder="Short bio…" value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} />
                    {role === 'STUDENT'
                      ? <input className="input-field" placeholder="Skills (e.g. React, Java, Python)" value={editForm.skills} onChange={e => setEditForm({...editForm, skills: e.target.value})} />
                      : <input className="input-field" placeholder="Company Name" value={editForm.companyName} onChange={e => setEditForm({...editForm, companyName: e.target.value})} />
                    }
                    <div className="flex gap-3">
                      <button type="submit" className="btn-primary">Save Changes</button>
                      <button type="button" className="btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{profile?.name}</h1>
                        <p className="text-gray-600 font-medium mt-0.5">{role === 'STUDENT' ? profile?.skills : profile?.companyName}</p>
                        {profile?.bio && <p className="text-gray-500 text-sm mt-1 max-w-lg">{profile.bio}</p>}
                        <p className="text-sm text-gray-400 mt-2">{profile?.email} · <span className={`font-semibold ${role === 'STUDENT' ? 'text-emerald-600' : 'text-blue-600'}`}>{role}</span></p>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center gap-2"><Edit2 className="w-4 h-4"/> Edit Profile</button>
                        {role === 'STUDENT' && (
                          <label className={`btn-outline cursor-pointer flex items-center gap-2 ${uploading ? 'opacity-60' : ''}`}>
                            <FileText className="w-4 h-4" /> Upload Resume
                            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => handleFile(e,'resume')} disabled={uploading} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Activity / Skills Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="card p-4 flex flex-col items-center text-center">
                <p className="text-2xl font-bold text-zidio-green">—</p>
                <p className="text-xs text-gray-500 mt-1">Connections</p>
              </div>
              <div className="card p-4 flex flex-col items-center text-center">
                <p className="text-2xl font-bold text-zidio-green">—</p>
                <p className="text-xs text-gray-500 mt-1">Applications Sent</p>
              </div>
              <div className="card p-4 flex flex-col items-center text-center">
                <p className="text-2xl font-bold text-zidio-green">—</p>
                <p className="text-xs text-gray-500 mt-1">Profile Views</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
