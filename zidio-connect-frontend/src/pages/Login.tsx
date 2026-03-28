import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('email', data.email);
      if (data.role === 'ADMIN') navigate('/admin');
      else navigate('/');
      toast.success('Logged in successfully!');
    } catch {
      toast.error('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--bg-page)',
        transition: 'background 0.3s ease',
      }}
    >
      {/* ── Left Panel ── */}
      <div
        className="auth-left-panel hidden lg:flex flex-col justify-center"
        style={{ width: '45%', padding: '3rem 4rem' }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 800,
            fontSize: '2.25rem',
            color: '#fff',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            marginBottom: '0.25rem',
          }}>
            Zidio
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '1rem', marginBottom: '2.5rem' }}>
            Connect
          </div>

          <h2 style={{
            color: '#fff',
            fontWeight: 800,
            fontSize: '2.25rem',
            lineHeight: 1.2,
            marginBottom: '1rem',
            letterSpacing: '-0.03em',
          }}>
            Your next<br />opportunity<br />awaits.
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 340 }}>
            Connect with top recruiters, showcase your skills, and land your dream job on Zidio Connect.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem' }}>
            {[
              { n: '10K+', l: 'Students' },
              { n: '500+', l: 'Recruiters' },
              { n: '2K+',  l: 'Jobs Posted' },
            ].map(({ n, l }) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.04em', lineHeight: 1 }}>{n}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }} className="animate-fadeInUp">
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{
              background: 'var(--brand)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.5rem',
              letterSpacing: '-0.04em',
              padding: '0.25rem 0.75rem',
              borderRadius: '8px',
              display: 'inline-block',
            }}>
              Zidio
            </span>
          </div>

          <div className="auth-card">
            <h1 style={{
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '1.5rem',
              letterSpacing: '-0.03em',
              marginBottom: '0.25rem',
            }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Sign in to continue to Zidio Connect
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.375rem',
                }}>
                  Email address
                </label>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Password
                  </label>
                  <a href="#" style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--brand)' }}>
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input-field"
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: '0.125rem',
                      display: 'flex',
                    }}
                  >
                    {showPw
                      ? <EyeOff style={{ width: 16, height: 16 }} />
                      : <Eye style={{ width: 16, height: 16 }} />
                    }
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.25rem' }}
              >
                {loading
                  ? <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Signing in…</>
                  : 'Sign in'
                }
              </button>
            </form>

            <div className="divider-text" style={{ margin: '1.5rem 0' }}>or</div>

            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              New to Zidio?{' '}
              <Link to="/register" style={{ color: 'var(--brand)', fontWeight: 700 }}>
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;