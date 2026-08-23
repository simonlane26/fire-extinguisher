import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/AuthPages.css';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, name: string) => Promise<void>;
}

const BrandMark = () => (
  <svg viewBox="0 0 26 26" fill="none">
    <rect x="9" y="3" width="8" height="18" rx="2.5" stroke="#B8121F" strokeWidth="1.6" />
    <rect x="7" y="1.5" width="12" height="3" rx="1" fill="#B8121F" />
    <line x1="13" y1="9" x2="20" y2="6" stroke="#B8121F" strokeWidth="1.6" />
  </svg>
);

export default function LoginForm({ onLogin, onRegister }: LoginFormProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await onRegister(email, password, name);
      } else {
        await onLogin(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fxc-auth">
      <div className="card">
        <div className="card-band"></div>
        <div className="card-inner">
          <div className="brand">
            <BrandMark />
            <span>FirexCheck</span>
          </div>

          <div className="eyebrow">Register Access</div>
          <h1>{isRegister ? 'Create your account' : 'Sign in'}</h1>
          <p className="subtitle subtitle-only">
            {isRegister ? 'Start managing your fire safety equipment' : 'Welcome back to your compliance register'}
          </p>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="field">
                <label htmlFor="name">Full Name <span className="req">*</span></label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required={isRegister}
                />
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@acmefire.com"
                required
              />
            </div>

            <div className="field">
              <div className="field-top">
                <label htmlFor="password">Password</label>
                {!isRegister && (
                  <Link to="/forgot-password">Forgot password?</Link>
                )}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                minLength={6}
                required
              />
              {isRegister && (
                <div className="field-hint">Must be at least 6 characters</div>
              )}
            </div>

            {error && (
              <div className="error-box">
                <p>
                  <strong>Authentication failed</strong>
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => setError('')}
                  className="error-dismiss"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="switch-row">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                  }}
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New to FirexCheck?{' '}
                <Link to="/signup">Create an account</Link>
              </>
            )}
          </div>
          <div className="back-row"><Link to="/">← Back to Home</Link></div>

          <div className="divider"></div>
          <p className="legal">
            By {isRegister ? 'creating an account' : 'signing in'}, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
