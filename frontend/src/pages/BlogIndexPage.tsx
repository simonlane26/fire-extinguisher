import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const POSTS = [
  {
    to: '/blog/what-is-bs-5306',
    title: 'What Is BS 5306-3? UK Fire Extinguisher Maintenance Standard Explained',
    desc: 'What the standard actually requires, who has to follow it, and whether it counts as law — without having to buy the official document.',
  },
  {
    to: '/blog/fire-extinguisher-inspection-checklist',
    title: 'Fire Extinguisher Inspection Checklist (Free Template)',
    desc: 'The full monthly visual-check list, ready to use today — plus how to get it emailed as a printable copy.',
  },
  {
    to: '/blog/how-often-fire-extinguishers-serviced-uk',
    title: 'How Often Do Fire Extinguishers Need Servicing in the UK?',
    desc: 'The three different intervals that apply — monthly, annual, and 5- or 10-year — and why the long cycle depends on extinguisher type.',
  },
  {
    to: '/blog/fire-safety-compliance-monitoring',
    title: 'Fire Safety Compliance Monitoring: What It Means and How It Works',
    desc: 'Why monitoring is a different job from inspecting, who’s legally responsible for it, and where manual systems usually break down.',
  },
];

export default function BlogIndexPage() {
  const navigate = useNavigate();
  const goToSignup = () => navigate('/signup');

  return (
    <div className="fxc-landing">
      <header>
        <div className="wrap header-inner">
          <Link className="logo" to="/">
            <img src="/images/landing/firexcheck-logo.png" alt="FireXCheck" />
          </Link>
          <nav>
            <a className="nav-link" href="/#modules2">Features</a>
            <a className="nav-link" href="/#pricing">Pricing</a>
            <Link className="nav-link" to="/compare">Compare</Link>
            <Link className="nav-link" to="/blog">Blog</Link>
            <Link className="nav-link" to="/faq">FAQ</Link>
            <Link className="nav-link" to="/resources/what-is-fire-extinguisher-inspection-software">Resources</Link>
            <button type="button" className="signin" onClick={goToSignup}>Sign In</button>
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
          </nav>
        </div>
      </header>

      <div className="wrap compare-hero">
        <Link className="compare-back" to="/">← Back to Home</Link>
        <div className="eyebrow">Blog</div>
        <h1>Fire safety, explained in plain English</h1>
        <p className="lede">
          Practical answers to the questions people actually search for — standards, schedules,
          checklists, and what compliance really means day to day.
        </p>
      </div>

      <div className="wrap compare-section">
        <div className="compare-index-list">
          {POSTS.map((p) => (
            <Link className="compare-index-card" to={p.to} key={p.to}>
              <h2 className="compare-index-title">{p.title}</h2>
              <p>{p.desc}</p>
              <span className="compare-index-arrow">Read the article →</span>
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
