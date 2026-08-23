import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../lib/api';
import './AuthPages.css';

const BrandMark = () => (
  <svg viewBox="0 0 26 26" fill="none">
    <rect x="9" y="3" width="8" height="18" rx="2.5" stroke="#B8121F" strokeWidth="1.6" />
    <rect x="7" y="1.5" width="12" height="3" rx="1" fill="#B8121F" />
    <line x1="13" y1="9" x2="20" y2="6" stroke="#B8121F" strokeWidth="1.6" />
  </svg>
);

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    password: '',
    subdomain: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        companyName: formData.companyName,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        ...(formData.subdomain ? { subdomain: formData.subdomain } : {}),
      };

      const response = await signup(data);
      setSuccess(true);

      // Optional: Auto-login after signup
      if (response.access_token) {
        setTimeout(() => {
          navigate('/app');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fxc-auth">
        <div className="card">
          <div className="card-band"></div>
          <div className="card-inner" style={{ textAlign: 'center' }}>
            <div className="success-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1>Account created!</h1>
            <p className="subtitle" style={{ marginBottom: '18px' }}>
              Thank you for signing up! A verification email has been sent to <strong>{formData.email}</strong>.
            </p>
            <p className="legal" style={{ marginBottom: '26px' }}>
              Please check your inbox and click the verification link to activate your account.
            </p>
            <Link to="/app" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <h1>Create your account</h1>
          <p className="subtitle">Start managing your fire safety equipment</p>
          <Link className="site-link" to="/">firexcheck.com</Link>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="companyName">Company Name <span className="req">*</span></label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Acme Fire Safety"
              />
            </div>

            <div className="field">
              <label htmlFor="name">Your Name <span className="req">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Smith"
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email Address <span className="req">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@acmefire.com"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password <span className="req">*</span></label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Min. 8 characters"
              />
            </div>

            <div className="field">
              <label htmlFor="subdomain">Subdomain (Optional)</label>
              <div className="subdomain-row">
                <input
                  type="text"
                  id="subdomain"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={handleChange}
                  placeholder="acmefire"
                />
                <div className="subdomain-suffix">.firexcheck.com</div>
              </div>
              <div className="field-hint">Leave blank for an auto-generated subdomain</div>
            </div>

            {error && (
              <div className="error-box">
                <p><strong>Couldn&apos;t create account</strong>{error}</p>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="switch-row">Already have an account? <Link to="/app">Sign in</Link></div>
          <div className="back-row"><Link to="/">← Back to Home</Link></div>

          <div className="divider"></div>
          <p className="legal">By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}
