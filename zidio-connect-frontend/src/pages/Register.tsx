import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

const ROLES = [
  { value: 'STUDENT',   icon: '🎓', label: 'Student',   desc: 'Find jobs & internships' },
  { value: 'RECRUITER', icon: '🏢', label: 'Recruiter', desc: 'Post jobs & find talent' },
  { value: 'ADMIN',     icon: '⚙️', label: 'Admin',     desc: 'Manage the platform' },
];

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/login', { state: { registered: true } });
    } catch {
      setError('Registration failed. This email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, val: string) => setFormData(prev => ({ ...prev, [key]: val }));

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'var(--bg-page)',
      transition: 'background 0.3s ease',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }} className="animate-fadeInUp">

        {/* ── Logo ── */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ background: 'var(--brand)', color: '#fff', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', padding: '0.25rem 0.75rem', borderRadius: '8px', display: 'inline-block', marginBottom: '1rem' }}>
            Zidio
          </span>
          <h1 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.03em', margin: 0 }}>
            Create your account
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.375rem', fontSize: '0.875rem' }}>
            Join thousands of professionals on Zidio Connect
          </p>
        </div>

        <div className="auth-card">
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                Full Name
              </label>
              <input className="input-field" type="text" placeholder="John Doe"
                value={formData.name} onChange={e => update('name', e.target.value)} required autoComplete="name" />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                Email Address
              </label>
              <input className="input-field" type="email" placeholder="you@example.com"
                value={formData.email} onChange={e => update('email', e.target.value)} required autoComplete="email" />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                Password
              </label>
              <input className="input-field" type="password" placeholder="Min. 6 characters"
                value={formData.password} onChange={e => update('password', e.target.value)} required autoComplete="new-password" />
              {/* Password strength hint */}
              {formData.password.length > 0 && (
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.375rem' }}>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: '99px',
                      background: i < Math.min(Math.floor(formData.password.length / 3), 4)
                        ? (formData.password.length < 6 ? '#ef4444' : formData.password.length < 9 ? '#f59e0b' : 'var(--brand)')
                        : 'var(--border-default)',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* Role selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.625rem' }}>
                I am a…
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem' }}>
                {ROLES.map(({ value, icon, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    className={`role-option ${formData.role === value ? 'selected' : ''}`}
                    onClick={() => update('role', value)}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>{icon}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.25rem' }}>
              {loading
                ? <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Creating account…</>
                : 'Create Account'
              }
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;