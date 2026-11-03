import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ_DATA = [
  {
    q: 'What is fire extinguisher tracking software?',
    a: 'It’s software that keeps a live record of every fire extinguisher you own — where it is, when it was last inspected, when it’s next due, and its current condition — instead of relying on a spreadsheet that’s only ever as accurate as the last person who remembered to update it.',
  },
  {
    q: 'How do I track fire extinguishers across multiple buildings or sites?',
    a: 'Each extinguisher gets its own QR-tagged record tied to a specific site, building, and floor. FireXCheck gives you one dashboard across every location you manage, filterable by site or building, so you can see the whole estate or drill into one room without maintaining a separate file per building.',
  },
  {
    q: 'What happens if an extinguisher is moved or relocated?',
    a: 'You update its location field the next time it’s inspected or at any point from its record — the QR tag and inspection history stay attached to that specific unit, so moving it between rooms or buildings doesn’t break its audit trail.',
  },
];

export default function FireExtinguisherTrackingSoftwarePage() {
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
        <div className="eyebrow">Tracking Software</div>
        <h1>Fire Extinguisher Tracking Software</h1>
        <p className="lede">
          Know exactly where every extinguisher is, when it was last checked, and what&apos;s due
          next — across one building or a hundred — without a spreadsheet that goes stale the moment
          someone forgets to update it.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Why &quot;where is it and when was it checked&quot; is harder than it sounds</h2>
        <p>
          A spreadsheet tracking system looks fine with 15 extinguishers in one building. It stops
          working the moment you add a second site, a third inspector, or an extinguisher that gets
          moved from one floor to another and nobody updates the row. Facilities teams and inspection
          companies end up with the same basic question — &quot;which extinguishers are overdue, and
          where exactly are they?&quot; — buried in a file that&apos;s only accurate on the day someone
          last touched it.
        </p>
        <p>
          Fire extinguisher tracking software exists to answer that question in real time, not on
          whatever date the spreadsheet was last updated.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>How FireXCheck tracks every extinguisher you own</h2>
        <ul className="price-list" style={{ maxWidth: 640 }}>
          <li>Every extinguisher gets a unique QR tag tied to its site, building, and floor</li>
          <li>One live dashboard shows every unit across every location you manage</li>
          <li>Filter instantly by site, building, inspector, or compliance status</li>
          <li>Each unit&apos;s full history — location, inspections, condition — travels with it if it&apos;s relocated</li>
          <li>Overdue and due-soon units are flagged automatically, with no manual recount needed</li>
        </ul>
        <p>
          You&apos;re not tracking a spreadsheet row anymore — you&apos;re tracking the physical asset,
          with a record that updates the moment somebody scans it.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Built for multi-site tracking from day one</h2>
        <p>
          Multi-site tracking isn&apos;t an add-on module — it&apos;s how FireXCheck is built. Whether
          you&apos;re a facilities manager responsible for five buildings or a fire safety inspection
          company managing extinguisher counts for dozens of clients, the same dashboard scales with
          you: filter down to one site when you need to walk a building, or zoom out to see your whole
          portfolio&apos;s compliance status in one screen.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>Stop tracking extinguishers by spreadsheet</h2>
          <p>No sales call required. Start a free trial and tag your first extinguisher in minutes.</p>
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
            <Link to="/fire-extinguisher-compliance-software">Fire Extinguisher Compliance Software</Link>
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
