import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/login', { state: { registered: true } });
    } catch {
      setError('Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleInfo = {
    STUDENT: { icon: '🎓', label: 'Student', desc: 'Find jobs and internships' },
    RECRUITER: { icon: '🏢', label: 'Recruiter', desc: 'Post jobs and find talent' },
    ADMIN: { icon: '⚙️', label: 'Admin', desc: 'Manage platform users' },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #f0f2f5 100%)' }}>
      <div className="w-full max-w-lg animate-fadeInUp">
        <div className="text-center mb-8">
          <Link to="/login" className="text-white bg-zidio-green font-black text-3xl px-4 py-1 rounded-xl inline-block mb-4">Zidio</Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1 text-sm">Join thousands of professionals on Zidio Connect</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input className="input-field" type="text" placeholder="John Doe" value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input className="input-field" type="password" placeholder="Min. 8 characters" value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})} required />
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(roleInfo).map(([role, info]) => (
                  <button key={role} type="button"
                    onClick={() => setFormData({...formData, role})}
                    className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${formData.role === role ? 'border-zidio-green bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="text-2xl mb-1">{info.icon}</div>
                    <div className="text-xs font-semibold text-gray-800">{info.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{info.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3 mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/></svg>
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-zidio-green font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
