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
  {
    to: '/compare/firexcheck-vs-servicetrade-vs-buildingreports',
    title: 'FirexCheck vs ServiceTrade vs BuildingReports',
    desc: 'A purpose-built fire extinguisher inspection tool vs two broader field service and compliance reporting platforms.',
  },
  {
    to: '/compare/firexcheck-vs-inspect-point',
    title: 'FirexCheck vs Inspect Point',
    desc: 'A fire extinguisher-focused register vs a full fire protection inspection platform for sprinkler, alarm and suppression contractors.',
  },
  {
    to: '/compare/firexcheck-vs-inspectntrack',
    title: 'FireXCheck vs InspectNTrack',
    desc: 'Barcode-based safety asset tracking vs a purpose-built fire extinguisher register mapped to BS 5306-3 and IS 291.',
  },
  {
    to: '/compare/firexcheck-vs-safetyculture',
    title: 'FireXCheck vs SafetyCulture (iAuditor)',
    desc: 'A general-purpose checklist and audit platform vs built-in BS 5306/IS 291 compliance tracking for fire extinguishers specifically.',
  },
  {
    to: '/compare/firexcheck-vs-goaudits',
    title: 'FireXCheck vs GoAudits',
    desc: 'A general digital audit/checklist tool vs a purpose-built fire extinguisher inspection and compliance register.',
  },
  {
    to: '/compare/firexcheck-vs-fire-inspect-hub',
    title: 'FireXCheck vs Fire Inspect Hub',
    desc: 'An NFPA-oriented US inspection tool vs a UK/Irish register built around BS 5306-3 and IS 291.',
  },
  {
    to: '/compare/firexcheck-vs-maintainx',
    title: 'FireXCheck vs MaintainX',
    desc: 'A general CMMS for work orders and preventive maintenance vs software built specifically for fire extinguisher inspection and compliance.',
  },
  {
    to: '/compare/firexcheck-vs-firebug-ext',
    title: 'FireXCheck vs Firebug EXT',
    desc: 'A dedicated-handheld, barcode-based US inspection system vs FireXCheck’s phone-based, BS 5306/IS 291-mapped approach.',
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
        <div className="eyebrow">Compare</div>
        <h1>How FirexCheck compares</h1>
        <p className="lede">Honest, fact-checked comparisons against other tools fire safety teams consider.</p>
      </div>

      <div className="wrap compare-section">
        <div className="compare-index-list">
          {COMPARISONS.map((c) => (
            <Link className="compare-index-card" to={c.to} key={c.to}>
              <h2 className="compare-index-title">{c.title}</h2>
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
