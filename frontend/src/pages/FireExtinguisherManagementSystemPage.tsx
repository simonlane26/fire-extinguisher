import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ_DATA = [
  {
    q: 'What’s included in a fire extinguisher management system?',
    a: 'A proper management system covers the whole program, not just the inspection step: a register of every extinguisher and its location, scheduling and reminders, inspection logging, compliance reporting, and role-based access so admins, managers, and inspectors each see what they need to.',
  },
  {
    q: 'Can I manage more than fire extinguishers in the same system?',
    a: 'Yes — FireXCheck starts with fire extinguishers and lets you add Fire Alarm Logbook (BS 5839-1), Emergency Lighting (BS 5266-1), PAT Testing, and Fire Doors (BS 8214) modules on top, all under the same account and the same site structure.',
  },
  {
    q: 'How many users can access the system?',
    a: 'Starter includes 3 users, Professional includes 10, and Business includes unlimited users — so a two-person facilities team and a 40-person inspection company can both run on the same platform.',
  },
];

export default function FireExtinguisherManagementSystemPage() {
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
        <div className="eyebrow">Management System</div>
        <h1>Fire Extinguisher Management System</h1>
        <p className="lede">
          One system for the whole program — the register, the schedule, the inspections, the reports,
          and the people who need access to each — instead of a different tool or spreadsheet for
          every piece of it.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>A management system is bigger than an inspection app</h2>
        <p>
          &quot;Inspect it&quot; is one job. &quot;Manage the whole program&quot; is a different, bigger
          one: knowing what you own and where it is, who&apos;s responsible for checking it, when
          it&apos;s due, what happens when it fails, and who gets to see or change any of that. Teams
          that outgrow a spreadsheet usually aren&apos;t missing an inspection checklist — they&apos;re
          missing a system that ties the register, the schedule, the inspection history, and the
          reporting together in one place.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>What FireXCheck manages for you</h2>
        <ul className="price-list" style={{ maxWidth: 640 }}>
          <li>A full register of every extinguisher, tagged with site, building, and floor</li>
          <li>Automatic scheduling for monthly checks and extended-service/annual cycles</li>
          <li>Mobile inspection logging with offline support for teams on-site without signal</li>
          <li>Role-based access — admins, managers, and inspectors each see what&apos;s relevant to them</li>
          <li>Audit-ready PDF and CSV compliance reporting, mapped to BS 5306-3 / IS 291</li>
        </ul>
      </div>

      <div className="wrap compare-section">
        <h2>One account, every fire safety discipline</h2>
        <p>
          Most teams start with extinguishers and realize the same gaps exist elsewhere in their fire
          safety program. FireXCheck lets you add the Fire Alarm Logbook (BS 5839-1), Emergency
          Lighting testing (BS 5266-1), PAT Testing, and a Fire Doors register (BS 8214) on top of your
          existing account — same sites, same users, same login, instead of running a separate system
          for every type of equipment.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Scales from one site to a full portfolio</h2>
        <p>
          A single-site facility gets a simple, no-clutter way to manage its register and stop relying
          on a wall chart. A multi-site operation or inspection company gets the same system, scaled —
          with site-by-site filtering, portfolio-wide compliance visibility, and plans that go from 50
          extinguishers and 3 users up to 1,000 extinguishers and unlimited users.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>Run the whole program from one place</h2>
          <p>No sales call required. Start a free trial and set up your register in minutes.</p>
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
            <Link to="/fire-extinguisher-compliance-software">Fire Extinguisher Compliance Software</Link>
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
