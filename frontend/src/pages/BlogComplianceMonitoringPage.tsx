import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ_DATA = [
  {
    q: 'Who is responsible for fire safety compliance monitoring?',
    a: 'Under the Regulatory Reform (Fire Safety) Order 2005 (and equivalent legislation in Scotland and Northern Ireland), it’s the “responsible person” for the premises — often the employer, building owner, or a nominated facilities/compliance manager. In multi-site organizations this is usually delegated to a compliance officer who oversees the whole portfolio.',
  },
  {
    q: 'Is compliance monitoring the same as an inspection?',
    a: 'No — an inspection is a single event. Monitoring is the ongoing system around it: knowing what’s due, when, confirming it happened, and being able to produce the record afterward. You can do every inspection on time and still fail at monitoring if there’s no reliable way to prove it.',
  },
  {
    q: 'What tools count as fire safety compliance monitoring?',
    a: 'Anything from a well-kept spreadsheet to dedicated software — the test is whether it can answer “what’s overdue right now, across every site?” without manual reconciliation. Spreadsheets technically can; they just don’t scale or alert you automatically, which is where most gaps start.',
  },
];

export default function BlogComplianceMonitoringPage() {
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
        <div className="eyebrow">Compliance</div>
        <h1>Fire Safety Compliance Monitoring: What It Means and How It Works</h1>
        <p className="lede">
          Inspecting your fire safety equipment and monitoring compliance for it are two different
          jobs. Here&apos;s what the second one actually involves — and why most paper systems quietly
          fail at it.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Monitoring is bigger than inspecting</h2>
        <p>
          Doing an inspection is a single event: someone checks a piece of equipment on a given day.
          Compliance monitoring is the system wrapped around that event — knowing in advance what&apos;s
          due, confirming it actually happened, flagging what&apos;s slipped, and being able to produce
          a complete record the moment someone asks for one. You can perform every individual
          inspection correctly and still fail at monitoring, if there&apos;s no reliable way to prove
          any of it happened on schedule.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>What falls under fire safety compliance monitoring</h2>
        <p>
          For most UK and Irish premises, &quot;fire safety compliance&quot; covers more than one
          piece of equipment, each with its own standard and interval:
        </p>
        <ul className="price-list" style={{ maxWidth: 680 }}>
          <li>Portable fire extinguishers — BS 5306-3 (or IS 291 in Ireland)</li>
          <li>Fire alarm systems — BS 5839-1, with weekly, quarterly, and annual test cycles</li>
          <li>Emergency lighting — BS 5266-1, including monthly function tests and an annual full-duration test</li>
          <li>Fire doors — BS 8214, covering regular visual and operational checks</li>
        </ul>
        <p>
          Monitoring across all of these means tracking several different schedules at once, often
          across multiple buildings — which is exactly where a single spreadsheet per site starts to
          break down.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Who&apos;s actually responsible for it</h2>
        <p>
          Under the Regulatory Reform (Fire Safety) Order 2005 in England and Wales (and equivalent
          legislation elsewhere in the UK and Ireland), the legal duty sits with the &quot;responsible
          person&quot; for a premises — often the employer or building owner. In practice, that duty
          is usually delegated day-to-day to a facilities manager or a dedicated compliance officer,
          especially once an organization has more than one site to keep track of.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Where manual monitoring usually breaks down</h2>
        <p>
          A spreadsheet can technically track due dates. What it can&apos;t do reliably is alert
          anyone before something slips, reconcile itself across multiple buildings and inspectors,
          or survive the moment someone forgets to update a row after a visit. None of those failures
          show up until an auditor, insurer, or fire risk assessor asks a specific question —
          &quot;prove this alarm was tested in March&quot; — and the answer depends on whether anyone
          remembered to write it down.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>How software-based monitoring closes the gap</h2>
        <p>
          FireXCheck tracks every piece of equipment under one account — extinguishers, fire alarms,
          emergency lighting, and fire doors — with the correct interval applied automatically per
          standard. Overdue and due-soon items are flagged on a live dashboard rather than discovered
          during an audit, and every completed check is timestamped and exportable, so compliance
          monitoring stops depending on anyone&apos;s memory.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>Monitor compliance, not just inspections</h2>
          <p>No sales call required. Start a free trial and see your compliance dashboard in minutes.</p>
          <div className="compare-cta-actions">
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
            <Link className="btn-outline magnetic" to="/fire-extinguisher-compliance-software">See Compliance Software</Link>
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
            <Link to="/blog/how-often-fire-extinguishers-serviced-uk">Blog · How Often Do Extinguishers Need Servicing?</Link>
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
            headline: 'Fire Safety Compliance Monitoring: What It Means and How It Works',
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
