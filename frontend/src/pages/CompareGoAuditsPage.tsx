import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ = [
  {
    q: 'Is FireXCheck a replacement for GoAudits?',
    a: 'If fire extinguisher inspection and compliance tracking is your scope, yes — FireXCheck is purpose-built for that, mapped to BS 5306-3, BS 5839-1 and BS 5266-1, with no generic checklist-builder step required. If you need one platform to run audits across many different trades or industries (restaurants, hotels, construction sites, retail), GoAudits’ general-purpose checklist builder covers more ground than FireXCheck tries to.',
  },
  {
    q: 'Does FireXCheck support BS 5306 compliance reporting?',
    a: 'Yes — reports are generated mapped directly to BS 5306 (extinguishers), BS 5839-1 (fire alarms) and BS 5266-1 (emergency lighting), ready for review.',
  },
  {
    q: 'Can I import my existing inspection data?',
    a: 'Yes. FireXCheck supports CSV import and export, so you can bring in your existing extinguisher register from a spreadsheet or another system.',
  },
];

export default function CompareGoAuditsPage() {
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
        <Link className="compare-back" to="/compare">← All comparisons</Link>
        <div className="eyebrow">Compare</div>
        <h1>FireXCheck vs GoAudits: Which Fire Extinguisher Inspection Software Fits Your Team?</h1>
        <p className="lede">
          GoAudits is a real, general-purpose digital audit and checklist platform used across many
          industries — fire inspection is one of several use cases it supports. Here&apos;s an honest
          look at how FireXCheck compares for teams whose scope is specifically fire extinguisher
          inspection and compliance.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>The short version</h2>
        <p>
          GoAudits is a customizable checklist-and-audit builder: you build (or adapt) checklists for
          whatever you&apos;re inspecting — restaurants, hotels, construction sites, retail stores, or
          fire safety equipment — and run them from a mobile app with photo capture, scoring and
          instant reports. FireXCheck is built specifically for fire extinguisher inspection and
          compliance tracking, mapped to BS 5306-3, BS 5839-1 and BS 5266-1, with the inspection
          intervals and record structure already built in — no checklist-building step required.
        </p>
        <p>
          If you run audits across many different industries or site types and fire safety is just one
          checklist among many, GoAudits&apos; flexibility is a genuine advantage. If fire extinguishers
          (and optionally fire alarms, emergency lighting and PAT) are your actual scope, FireXCheck gets
          you to a working, standards-mapped register without configuring a generic tool to behave like
          one.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Side-by-side</h2>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th></th>
                <th className="fxc-col">FireXCheck</th>
                <th>GoAudits</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Built for</td>
                <td className="fxc-col">Fire extinguisher inspection &amp; compliance tracking (BS 5306-3, BS 5839-1, BS 5266-1, IS 291)</td>
                <td>General-purpose digital audits and checklists across many industries, including a fire inspection use case</td>
              </tr>
              <tr>
                <td>Setup</td>
                <td className="fxc-col">Self-serve signup, live the same day — inspection structure and intervals already built in</td>
                <td>Self-serve with a free trial, but you build or adapt your own checklist templates first</td>
              </tr>
              <tr>
                <td>Pricing model</td>
                <td className="fxc-col">Flat per-site plans from £19/month, published openly</td>
                <td>Third-party listings show plans from around $12/user/month, but GoAudits&apos; own pricing page asks you to contact sales for a quote</td>
              </tr>
              <tr>
                <td>Fire extinguisher specificity</td>
                <td className="fxc-col">Built-in extinguisher register with inspection fields, types and intervals pre-modelled</td>
                <td>Fire extinguisher checklists exist as templates within a general checklist builder, not a dedicated asset register</td>
              </tr>
              <tr>
                <td>Multi-site tracking</td>
                <td className="fxc-col">Built in on every plan</td>
                <td>Yes, as part of its broader audit-planning features</td>
              </tr>
              <tr>
                <td>Mobile inspections</td>
                <td className="fxc-col">Included, offline-capable</td>
                <td>Included, with offline mobile access and photo capture</td>
              </tr>
              <tr>
                <td>QR/barcode tagging</td>
                <td className="fxc-col">Included as standard on every extinguisher record</td>
                <td>Not specifically documented for fire extinguisher assets — GoAudits is checklist-centric rather than asset-centric</td>
              </tr>
              <tr>
                <td>Compliance reporting</td>
                <td className="fxc-col">One-click reports mapped directly to BS 5306-3 / BS 5839-1 / BS 5266-1 / IS 291</td>
                <td>Instant audit reports with scoring and analytics, not specific to a named fire safety standard</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="compare-source">
          GoAudits figures sourced from{' '}
          <a href="https://www.capterra.com/p/191777/GoAudits/pricing/" target="_blank" rel="noopener noreferrer">Capterra</a>,{' '}
          <a href="https://www.getapp.com/security-software/a/goaudits" target="_blank" rel="noopener noreferrer">GetApp</a>,{' '}
          <a href="https://www.softwareadvice.com/ehs/goaudits-profile/" target="_blank" rel="noopener noreferrer">Software Advice</a>, and{' '}
          <a href="https://goaudits.com/blog/best-fire-inspection-software/" target="_blank" rel="noopener noreferrer">GoAudits&apos; own blog</a>{' '}
          (vendor marketing, treated as such), as of November 2026. Third-party pricing listings disagree with
          each other and GoAudits&apos; own pricing page requires contacting sales — confirm current terms
          directly with GoAudits before relying on them.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Why teams switch to FireXCheck</h2>
        <p>
          <strong>You don&apos;t want to build your own fire safety checklist.</strong> GoAudits gives you a
          blank (or lightly templated) canvas; FireXCheck gives you a working extinguisher register with the
          standard&apos;s intervals already modelled in.
        </p>
        <p>
          <strong>You want pricing you can actually see.</strong> FireXCheck publishes flat per-site pricing
          from £19/month. GoAudits&apos; own pricing page is a &quot;contact us&quot; form, and third-party
          listings of its price disagree with each other.
        </p>
        <p>
          <strong>You need an asset register, not just a checklist log.</strong> Every extinguisher in
          FireXCheck is a persistent, QR-tagged record with its own history — not a line item inside a
          recurring audit form.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Where GoAudits makes sense</h2>
        <p>
          To be fair: if you run inspections or audits across several unrelated domains — food safety,
          health and safety walk-throughs, retail merchandising, construction site checks, and fire safety
          all at once — GoAudits&apos; general-purpose checklist builder lets one tool cover all of it.
          That flexibility is a real advantage FireXCheck doesn&apos;t try to match. FireXCheck is purpose-built
          for fire extinguisher (and related UK/Irish fire safety equipment) compliance — we&apos;re not
          trying to be a general audit platform.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>See it yourself</h2>
          <p>Start a free trial and log your first inspection in under 10 minutes. No sales call, no credit card.</p>
          <div className="compare-cta-actions">
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
            <a className="btn-outline magnetic" href="/#pricing">See Pricing</a>
          </div>
        </div>
      </div>

      <div className="wrap compare-section">
        <h2>FAQ</h2>
        <div className="compare-faq">
          {FAQ.map((item) => (
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
            <Link to="/compare">Compare · All comparisons</Link>
            <Link to="/resources/what-is-fire-extinguisher-inspection-software">Resources · What Is Fire Extinguisher Inspection Software?</Link>
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
