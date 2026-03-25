import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      if (data.role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #f0f2f5 100%)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2" style={{ background: 'linear-gradient(145deg, #059669 0%, #047857 100%)' }}>
        <div className="mb-8">
          <div className="text-white font-black text-5xl tracking-tight mb-1">Zidio</div>
          <div className="text-emerald-200 font-medium text-lg">Connect</div>
        </div>
        <h2 className="text-white font-bold text-4xl leading-tight mb-4">
          Your next career<br/>opportunity awaits.
        </h2>
        <p className="text-emerald-100 text-lg leading-relaxed max-w-sm">
          Connect with top recruiters, showcase your skills, and land your dream job on Zidio Connect.
        </p>
        <div className="mt-12 flex gap-6">
          <div className="text-center">
            <div className="text-white font-bold text-3xl">10K+</div>
            <div className="text-emerald-200 text-sm">Students</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-3xl">500+</div>
            <div className="text-emerald-200 text-sm">Recruiters</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-3xl">2K+</div>
            <div className="text-emerald-200 text-sm">Jobs Posted</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fadeInUp">
          <div className="lg:hidden mb-8 text-center">
            <div className="text-white bg-zidio-green font-black text-3xl px-4 py-1 rounded-xl inline-block mb-2">Zidio</div>
          </div>
          <div className="card p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm mb-6">Sign in to continue to Zidio Connect</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-xs text-zidio-green hover:underline font-medium">Forgot password?</a>
                </div>
                <input
                  className="input-field"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-3 mt-2" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/></svg>
                    Signing in…
                  </span>
                ) : 'Sign in'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"/></div>
              <div className="relative text-center"><span className="bg-white px-3 text-xs text-gray-400">OR</span></div>
            </div>

            <p className="text-center text-sm text-gray-500">
              New to Zidio?{' '}
              <Link to="/register" className="text-zidio-green font-semibold hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
