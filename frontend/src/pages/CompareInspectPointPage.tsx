import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ = [
  {
    q: 'Is FireXCheck a replacement for Inspect Point?',
    a: 'If extinguishers are your scope, yes — FireXCheck covers that out of the box, built around BS 5306, BS 5839-1 and BS 5266-1, with no sales demo required to start. If you’re a fire protection contractor also running sprinkler, alarm, suppression and special-hazards inspections, Inspect Point’s broader trade coverage and built-in NFPA/UL-C templates may suit you better.',
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

export default function CompareInspectPointPage() {
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
            <button type="button" className="signin" onClick={goToSignup}>Sign In</button>
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
          </nav>
        </div>
      </header>

      <div className="wrap compare-hero">
        <Link className="compare-back" to="/compare">← All comparisons</Link>
        <div className="eyebrow">Compare</div>
        <h1>FireXCheck vs Inspect Point: Which Fire Extinguisher Inspection Software Fits Your Team?</h1>
        <p className="lede">
          Inspect Point is a real, established platform for fire protection contractors. Here&apos;s an
          honest, fact-checked look at how FireXCheck compares for teams whose scope is fire
          extinguisher inspection and compliance.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>The short version</h2>
        <p>
          Inspect Point is built for fire protection contractors running full inspection businesses
          across sprinkler, alarm, extinguisher, special-hazards and chemical-suppression systems,
          with built-in NFPA and UL-C inspection templates. FireXCheck is built specifically for teams
          who need fast, simple fire extinguisher inspection tracking — mapped to BS 5306, BS 5839-1
          and BS 5266-1 — without paying for or configuring modules for trades you don&apos;t service.
        </p>
        <p>
          If you&apos;re a multi-site facilities manager or a compliance officer who just needs
          extinguishers tracked, tagged and audit-ready, FireXCheck gets you there without a sales
          demo. If you&apos;re a larger fire protection contractor servicing multiple trades, Inspect
          Point&apos;s broader scope is a reasonable fit.
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
                <th>Inspect Point</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Built for</td>
                <td className="fxc-col">Fire extinguisher inspection &amp; compliance tracking (BS 5306, BS 5839-1, BS 5266-1)</td>
                <td>Full fire protection inspections — sprinkler, alarm, extinguisher, special hazards &amp; chemical suppression, with built-in NFPA/UL-C templates</td>
              </tr>
              <tr>
                <td>Setup</td>
                <td className="fxc-col">Self-serve signup, live the same day — no sales call required</td>
                <td>No public self-serve signup — inspectpoint.com runs a &quot;Request a Demo&quot; funnel before you can start</td>
              </tr>
              <tr>
                <td>Pricing model</td>
                <td className="fxc-col">Flat per-site plans from £19/month</td>
                <td>Quote-based, not published — one listed tier requires a minimum of 10 technicians, billed annually</td>
              </tr>
              <tr>
                <td>Minimum team size</td>
                <td className="fxc-col">None — works for a solo operator</td>
                <td>At least one pricing tier requires a 10-technician minimum</td>
              </tr>
              <tr>
                <td>Multi-site tracking</td>
                <td className="fxc-col">Built in on every plan</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Mobile inspections</td>
                <td className="fxc-col">Included, offline-capable</td>
                <td>Included, works online or offline</td>
              </tr>
              <tr>
                <td>QR/barcode tagging</td>
                <td className="fxc-col">Included as standard on every extinguisher record</td>
                <td>Not publicly specified</td>
              </tr>
              <tr>
                <td>Compliance reporting</td>
                <td className="fxc-col">One-click reports mapped directly to BS 5306 / BS 5839-1 / BS 5266-1</td>
                <td>Code-compliant question sets with built-in NFPA &amp; UL-C inspection templates (US market)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="compare-source">
          Inspect Point figures sourced from{' '}
          <a href="https://www.inspectpoint.com/trades/" target="_blank" rel="noopener noreferrer">inspectpoint.com</a>,{' '}
          third-party listings (Capterra, GetApp, Software Advice), and an aggregator summary (PulseSignal) for the
          technician-minimum and per-seat pricing detail, as of November 2026. No public pricing page exists —
          confirm current terms directly with Inspect Point before relying on them.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Why teams switch to FireXCheck</h2>
        <p>
          <strong>You don&apos;t need a full fire protection suite.</strong> If extinguishers are your
          scope, Inspect Point&apos;s broader platform means more setup, more fields, and more things
          to configure before your first inspection log.
        </p>
        <p>
          <strong>You want to be live today, not after a demo.</strong> FireXCheck has no sales-call
          gate — add a site, add your extinguishers, start logging inspections.
        </p>
        <p>
          <strong>You need clean audit trails without the overhead.</strong> FireXCheck was built
          around one job: making sure every extinguisher, at every site, has a documented,
          timestamped, inspector-signed record — ready the moment a fire marshal or auditor asks for it.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Where Inspect Point makes sense</h2>
        <p>
          To be fair: if you&apos;re a fire protection contractor servicing sprinkler, alarm,
          suppression and special-hazards systems alongside extinguishers, Inspect Point&apos;s
          broader trade coverage, built-in NFPA/UL-C templates and dispatch tooling are a genuine
          advantage FireXCheck doesn&apos;t try to match. FireXCheck is purpose-built for UK/Irish
          extinguisher compliance — we&apos;re not trying to be a full fire protection suite.
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
            <Link to="/compare/joblogic">Compare · FireXCheck vs Joblogic</Link>
            <Link to="/compare/uptick-ezmanagement">Compare · FireXCheck vs Uptick vs EZ Management</Link>
            <Link to="/compare/firexcheck-vs-servicetrade-vs-buildingreports">Compare · vs ServiceTrade &amp; BuildingReports</Link>
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
