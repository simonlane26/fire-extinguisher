import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const COMPARISONS = [
  {
    to: '/compare/joblogic',
    title: 'FirexCheck vs Joblogic',
    desc: 'A purpose-built fire safety register vs a general field service management platform used across many trades.',
  },
  {
    to: '/compare/uptick-ezmanagement',
    title: 'FirexCheck vs Uptick vs EZ Management',
    desc: 'How FirexCheck compares to two UK fire & security compliance platforms, Uptick and EZ Management’s ezServiceHUB.',
  },
];

export default function CompareIndexPage() {
  const navigate = useNavigate();
  const goToSignup = () => navigate('/signup');

  return (
    <div className="fxc-landing">
      <header>
        <div className="wrap header-inner">
          <Link className="logo" to="/">
            <img src="/images/landing/firexcheck-logo.png" alt="FirexCheck" />
          </Link>
          <nav>
            <a className="nav-link" href="/#modules2">Features</a>
            <a className="nav-link" href="/#pricing">Pricing</a>
            <Link className="nav-link" to="/compare">Compare</Link>
            <button type="button" className="signin" onClick={goToSignup}>Sign In</button>
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
          </nav>
        </div>
      </header>

      <div className="wrap compare-hero">
        <Link className="compare-back" to="/">← Back to Home</Link>
        <div className="eyebrow">Compare</div>
        <h1>How FirexCheck compares</h1>
        <p className="lede">Honest, fact-checked comparisons against other tools fire safety teams consider.</p>
      </div>

      <div className="wrap compare-section">
        <div className="compare-index-list">
          {COMPARISONS.map((c) => (
            <Link className="compare-index-card" to={c.to} key={c.to}>
              <div className="compare-index-title">{c.title}</div>
              <p>{c.desc}</p>
              <span className="compare-index-arrow">Read comparison →</span>
            </Link>
          ))}
        </div>
      </div>

      <footer id="about">
        <div className="wrap">
          <div className="footer-inner reveal is-visible">
            <div>
              <div className="footer-title">Get the register set up</div>
              <div className="footer-sub">Talk to us about your sites, asset counts, and which modules you need — we&apos;ll set up your first register together.</div>
            </div>
            <div className="footer-actions">
              <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
              <button type="button" className="footer-cta" onClick={goToSignup}>Book a demo →</button>
            </div>
          </div>
          <div className="rev">
            <span>© {new Date().getFullYear()} FirexCheck — a product of IgnisTech Ltd.</span>
            <span>Rev {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')} · Cheshire, UK</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
