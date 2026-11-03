import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ_DATA = [
  {
    q: 'What makes software “fire extinguisher compliant”?',
    a: 'Compliance comes from following the correct inspection and maintenance intervals for your standard — BS 5306-3 in the UK or IS 291 in Ireland — and being able to produce a documented record on request. FireXCheck applies the correct intervals automatically for the standard your account is set to and keeps every inspection timestamped and exportable.',
  },
  {
    q: 'Does FireXCheck cover BS 5306 and IS 291?',
    a: 'Yes. Your tenant is set to one standard at a time, and every inspection form, due-date calculation, and compliance report uses the correct intervals for that jurisdiction — BS 5306-3 (and BS 5839-1 / BS 5266-1 for fire alarms and emergency lighting) in the UK, or IS 291 in Ireland.',
  },
  {
    q: 'Can I produce a compliance report instantly if an auditor asks?',
    a: 'Yes — export a PDF or CSV report by site, date range, or equipment status in a few clicks, ready to hand over without digging through files or reconstructing a paper trail.',
  },
];

export default function FireExtinguisherComplianceSoftwarePage() {
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
            <Link className="nav-link" to="/faq">FAQ</Link>
            <Link className="nav-link" to="/resources/what-is-fire-extinguisher-inspection-software">Resources</Link>
            <button type="button" className="signin" onClick={goToSignup}>Sign In</button>
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
          </nav>
        </div>
      </header>

      <div className="wrap compare-hero">
        <Link className="compare-back" to="/">← Back to Home</Link>
        <div className="eyebrow">Compliance Software</div>
        <h1>Fire Extinguisher Compliance Software</h1>
        <p className="lede">
          Prove your extinguishers are compliant the moment someone asks — not three days later after
          you&apos;ve reconstructed a paper trail. FireXCheck maps every inspection to BS 5306-3 and
          IS 291 automatically.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Compliance isn&apos;t the inspection — it&apos;s the proof</h2>
        <p>
          Doing the inspection is only half the job. The other half is being able to prove, on demand,
          that it happened on time, by a named person, to the correct standard. That&apos;s where most
          paper-based and spreadsheet-based systems fall down — the inspection might genuinely have
          happened, but if the record is a handwritten tag that&apos;s faded or a spreadsheet cell with
          no audit trail, you&apos;re relying on trust, not proof.
        </p>
        <p>
          A fire extinguisher test and compliance platform needs to do more than remind you a check is
          due — it needs to produce a defensible record the moment a fire marshal, insurer, or auditor
          asks for one.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>How FireXCheck keeps you compliant automatically</h2>
        <ul className="price-list" style={{ maxWidth: 640 }}>
          <li>Set your account to BS 5306-3/BS 5839-1/BS 5266-1 (UK) or IS 291 (Ireland) once — every form uses the right intervals from then on</li>
          <li>Monthly visual checks and annual maintenance cycles are tracked per unit, not per spreadsheet tab</li>
          <li>Overdue and due-soon units are flagged on the dashboard before they become a compliance gap</li>
          <li>Every inspection is timestamped, inspector-attributed, and permanently attached to that extinguisher&apos;s record</li>
          <li>Export audit-ready PDF or CSV reports by site, date range, or status in a few clicks</li>
        </ul>
      </div>

      <div className="wrap compare-section">
        <h2>Who needs a dedicated compliance platform</h2>
        <p>
          Compliance officers are the clearest case — you&apos;re the one who has to produce the
          inspection history when it&apos;s asked for, and &quot;I&apos;ll check the binder&quot; isn&apos;t
          a good answer in that moment. But the same need shows up for facilities managers accountable
          for a building&apos;s fire safety sign-off, and for fire safety inspection companies whose
          clients expect a clean compliance report as part of the service, not an afterthought.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>Get audit-ready, automatically</h2>
          <p>No sales call required. Start a free trial and see your compliance dashboard in minutes.</p>
          <div className="compare-cta-actions">
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
            <a className="btn-outline magnetic" href="/#pricing">See Pricing</a>
          </div>
        </div>
      </div>

      <div className="wrap compare-section">
        <h2>FAQ</h2>
        <div className="compare-faq">
          {FAQ_DATA.map((item) => (
            <div className="faq-item" key={item.q}>
              <h3 className="faq-q">{item.q}</h3>
              <div className="faq-a">{item.a}</div>
            </div>
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
          <div className="also-included">
            <Link to="/fire-extinguisher-inspection-software">Fire Extinguisher Inspection Software</Link>
            <Link to="/fire-extinguisher-tracking-software">Fire Extinguisher Tracking Software</Link>
            <Link to="/fire-extinguisher-management-system">Fire Extinguisher Management System</Link>
            <Link to="/fire-extinguisher-barcode-software">Fire Extinguisher Barcode Software</Link>
            <Link to="/resources/what-is-fire-extinguisher-inspection-software">Resources · What Is Fire Extinguisher Inspection Software?</Link>
            <Link to="/compare">Compare · All comparisons</Link>
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
