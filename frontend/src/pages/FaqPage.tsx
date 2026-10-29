import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ_DATA = [
  {
    q: 'How do I track fire extinguisher inspections across multiple sites?',
    a: "FireXCheck gives you one dashboard for every location you manage — no more spreadsheets per building or texting site managers for updates. Each extinguisher gets a QR code or asset tag; inspectors scan it, log the check, and the result syncs instantly to your master account. You can filter by site or inspector and see at a glance which locations are compliant and which are overdue. If you're running inspections across 5 sites or 500, the workflow doesn't change.",
  },
  {
    q: 'What standards does FireXCheck cover, and are my records compliant?',
    a: "FireXCheck is built around BS 5306-3 (the British Standard for portable extinguisher commissioning and maintenance) and IS 291 (its Irish equivalent) — monthly visual checks, annual maintenance, and each standard's own extended-service or discharge-test cycle, all documented with dates and inspector identity. Your tenant is set to one standard at a time, so every inspection form and compliance calculation uses the correct intervals for your jurisdiction. Records are timestamped and exportable, so you're audit-ready without reconstructing paper logs.",
  },
  {
    q: 'Can FireXCheck remind my team when inspections are due?',
    a: "Yes. Each extinguisher's monthly and extended-service dates are tracked automatically, and overdue or due-soon items are flagged on the dashboard the moment they slip — no relying on a wall calendar or someone's memory. If you're managing dozens of extinguishers across multiple buildings, nothing falls through unnoticed.",
  },
  {
    q: 'What kind of reports can I generate for compliance or clients?',
    a: "FireXCheck generates exportable PDF and CSV reports by site, date range, or equipment status — ready to hand to an auditor, inspector, or property owner. If you're a facilities manager, you get a single compliance snapshot across your whole portfolio. If you're an inspection company, you get client-ready reports without manual formatting. No more digging through email threads or binders when someone asks you to prove an extinguisher was checked.",
  },
  {
    q: 'Do I need special hardware to use FireXCheck?',
    a: 'No. Inspectors use their phone camera to scan QR tags — no proprietary scanner, no extra device to buy or lose. You print and apply the tags once; everything after that runs through the FireXCheck app or browser.',
  },
  {
    q: 'Is FireXCheck built for single-site facilities too, or only multi-site companies?',
    a: 'Both. Single-site teams get a simple, no-clutter way to stay on top of inspections and ditch the paper log. Multi-site teams get the same simplicity, scaled — with site-level filtering and portfolio-wide visibility layered on top.',
  },
];

export default function FaqPage() {
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
            <Link className="nav-link" to="/faq">FAQ</Link>
            <button type="button" className="signin" onClick={goToSignup}>Sign In</button>
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
          </nav>
        </div>
      </header>

      <div className="wrap compare-hero">
        <Link className="compare-back" to="/">← Back to Home</Link>
        <div className="eyebrow">FAQ</div>
        <h1>Frequently asked questions</h1>
        <p className="lede">Everything you need to know about tracking fire extinguisher inspections with FireXCheck.</p>
      </div>

      <div className="wrap" style={{ paddingBottom: 20 }}>
        <div className="faq-list">
          {FAQ_DATA.map((item) => (
            <div className="faq-item" key={item.q}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{item.q}</h2>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
        <div className="faq-cta">
          <p>Ready to get started?</p>
          <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
          <button type="button" className="btn-outline magnetic" onClick={goToSignup}>Book a Demo</button>
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_DATA.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          }),
        }}
      />
    </div>
  );
}
