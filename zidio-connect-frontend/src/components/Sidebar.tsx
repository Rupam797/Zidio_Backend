import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ClipboardList, User, Settings } from 'lucide-react';

const role = localStorage.getItem('role') || 'STUDENT';

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Profile Card */}
      <div className="card overflow-hidden">
        <div className="profile-banner h-16" />
        <div className="flex flex-col items-center -mt-8 pb-4 px-4 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-white bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl font-bold shadow-sm">
            U
          </div>
          <Link to="/profile" className="font-bold text-gray-900 mt-2 hover:text-zidio-green hover:underline text-sm">
            Your Profile
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">{role === 'RECRUITER' ? 'Recruiter' : role === 'ADMIN' ? 'Administrator' : 'Student'}</p>
          <div className="w-full border-t border-gray-100 mt-4 pt-3 text-xs">
            <div className="flex justify-between text-gray-500 hover:bg-gray-50 px-2 py-1.5 rounded cursor-pointer">
              <span>Profile views</span>
              <span className="text-zidio-green font-semibold">—</span>
            </div>
            <div className="flex justify-between text-gray-500 hover:bg-gray-50 px-2 py-1.5 rounded cursor-pointer">
              <span>Connections</span>
              <span className="text-zidio-green font-semibold">—</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Links</p>
        {[
          { to: '/jobs', icon: <Briefcase className="w-4 h-4" />, label: 'Browse Jobs' },
          { to: '/applications', icon: <ClipboardList className="w-4 h-4" />, label: 'My Applications' },
          { to: '/profile', icon: <User className="w-4 h-4" />, label: 'Edit Profile' },
          ...(role === 'ADMIN' ? [{ to: '/admin', icon: <Settings className="w-4 h-4" />, label: 'Admin Panel' }] : []),
        ].map(link => (
          <Link key={link.to} to={link.to}
            className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-zidio-green hover:bg-emerald-50 px-2 py-2 rounded-lg transition-colors font-medium">
            <span className="text-gray-500">{link.icon}</span> {link.label}
          </Link>
        ))}
      </div>

      {/* Trending */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Trending Topics</p>
        {['#ReactDeveloper', '#HiringNow', '#Freshers2025', '#TechJobs', '#Zidio'].map((tag, i) => (
          <div key={tag} className="flex items-center justify-between py-1.5 cursor-pointer hover:text-zidio-green transition-colors">
            <span className="text-sm text-zidio-green font-medium">{tag}</span>
            <span className="text-xs text-gray-400">{(5 - i) * 120 + 'k'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
