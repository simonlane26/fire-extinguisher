import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ_DATA = [
  {
    q: 'Do all extinguisher types follow the same service schedule?',
    a: 'No. Every type gets a monthly visual check and an annual service, but the longer-interval cycle differs: water, foam, wet chemical, and most powder extinguishers get a 5-year extended service, while CO2 and clean-agent extinguishers skip straight to a 10-year overhaul instead.',
  },
  {
    q: 'What happens if a fire extinguisher service is overdue?',
    a: 'Strictly, an overdue extinguisher may no longer be considered compliant or reliably serviceable, which is a problem both for safety and for your fire risk assessment. In practice it also exposes you at audit — insurers and fire risk assessors specifically check service dates, not just presence of the equipment.',
  },
  {
    q: 'Can I service my own extinguishers to save money?',
    a: 'The monthly visual check — yes, that’s designed for in-house staff. The annual maintenance service and extended service/overhaul need a competent person, typically a BAFE-registered or manufacturer-trained engineer, since they involve mechanical checks and sometimes discharge testing that untrained staff shouldn’t attempt.',
  },
];

export default function BlogServicingFrequencyPage() {
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
        <Link className="compare-back" to="/blog">← Back to Blog</Link>
        <div className="eyebrow">Servicing</div>
        <h1>How Often Do Fire Extinguishers Need Servicing in the UK?</h1>
        <p className="lede">
          There are three different intervals that apply depending on the check, not one single
          answer — here&apos;s the full schedule under BS 5306-3.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>The quick answer</h2>
        <ul className="price-list" style={{ maxWidth: 680 }}>
          <li><strong>Every month</strong> — a visual check, done by trained staff, no engineer required</li>
          <li><strong>Every 12 months</strong> — a full maintenance service by a competent person, for every extinguisher type</li>
          <li><strong>Every 5 years</strong> — an extended service for water, foam, wet chemical, and most powder extinguishers</li>
          <li><strong>Every 10 years</strong> — an overhaul for CO2 and clean-agent extinguishers (instead of the 5-year tier), and for some sealed-for-life powder units</li>
        </ul>
      </div>

      <div className="wrap compare-section">
        <h2>Why the interval depends on extinguisher type</h2>
        <p>
          The monthly check and annual service apply to every extinguisher the same way — but the
          longer-interval cycle splits by what&apos;s inside the extinguisher and how it&apos;s built.
          Water, foam, wet chemical, and most powder extinguishers need a more thorough extended
          service — which can include a discharge test — every 5 years. CO2 and clean-agent
          extinguishers don&apos;t have that 5-year tier at all; instead they go straight to a 10-year
          overhaul, which typically includes a hydraulic pressure test of the cylinder. Some
          manufacturer-sealed, stored-pressure powder units follow the same 10-year cycle rather than
          the 5-year one — check the manufacturer&apos;s documentation for that specific unit if
          you&apos;re unsure which applies.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>What happens if you miss a service date</h2>
        <p>
          An overdue extinguisher isn&apos;t automatically useless, but it is a compliance gap —
          you can no longer demonstrate it&apos;s in &quot;efficient working order&quot; the way the
          Fire Safety Order requires, and most insurers will treat a lapsed service record as a real
          problem if a claim is ever assessed. It&apos;s also the single most common thing a fire
          risk assessor or auditor checks first, because it&apos;s the easiest thing to verify — the
          date is either current or it isn&apos;t.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Who can carry out each type of service</h2>
        <p>
          The monthly visual check can be done by any trained member of staff — it&apos;s designed
          for that. The annual maintenance service and the extended service/overhaul both need a
          competent person: typically someone BAFE-registered or trained directly by the
          extinguisher&apos;s manufacturer, since both involve mechanical work and, at the longer
          interval, discharge or pressure testing that isn&apos;t safe for untrained staff to attempt.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Tracking different intervals across a whole estate</h2>
        <p>
          The hard part usually isn&apos;t knowing the schedule — it&apos;s applying three different
          intervals correctly across dozens or hundreds of extinguishers of mixed types, without a
          spreadsheet quietly drifting out of date. FireXCheck calculates each unit&apos;s next due
          date automatically based on its type and your account&apos;s standard, and flags anything
          overdue before it becomes the thing an auditor catches.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>Never lose track of a service date again</h2>
          <p>No sales call required. Start a free trial and set your first schedule in minutes.</p>
          <div className="compare-cta-actions">
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
            <Link className="btn-outline magnetic" to="/fire-extinguisher-tracking-software">See Tracking Software</Link>
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
            <Link to="/blog/what-is-bs-5306">Blog · What Is BS 5306-3?</Link>
            <Link to="/blog/fire-extinguisher-inspection-checklist">Blog · Fire Extinguisher Inspection Checklist</Link>
            <Link to="/blog/fire-safety-compliance-monitoring">Blog · Fire Safety Compliance Monitoring</Link>
            <Link to="/resources/what-is-fire-extinguisher-inspection-software">Resources · What Is Fire Extinguisher Inspection Software?</Link>
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
            '@type': 'Article',
            headline: 'How Often Do Fire Extinguishers Need Servicing in the UK?',
            datePublished: '2026-11-03',
            author: { '@type': 'Organization', name: 'FireXCheck' },
          }),
        }}
      />
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
