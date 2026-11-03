import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ = [
  {
    q: 'Is FireXCheck a replacement for InspectNTrack?',
    a: 'If fire extinguishers are your only scope, yes — FireXCheck gives you BS 5306-3 and IS 291 compliance mapping out of the box, with no sales call to get started. If you need one barcode system to track many categories of safety equipment — extinguishers, eyewash stations, AEDs — alongside each other, InspectNTrack’s broader asset-category scope may suit you better.',
  },
  {
    q: 'Does FireXCheck support BS 5306 compliance reporting?',
    a: 'Yes — reports are generated mapped directly to BS 5306-3 (extinguishers), BS 5839-1 (fire alarms) and BS 5266-1 (emergency lighting), ready for review.',
  },
  {
    q: 'Is InspectNTrack still supported?',
    a: 'InspectNTrack was originally a Brady product and is now run by Wentworth Solutions. A 2020 user review mentioned Brady stepping back from support at the time, but Wentworth has continued operating the product since, with activity on its app listings and review responses into 2024. Confirm current support status directly with Wentworth before committing.',
  },
];

export default function CompareInspectNTrackPage() {
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
        <Link className="compare-back" to="/compare">← All comparisons</Link>
        <div className="eyebrow">Compare</div>
        <h1>FireXCheck vs InspectNTrack: Which Fire Extinguisher Tracking Software Fits Your Team?</h1>
        <p className="lede">
          InspectNTrack is an established barcode-based asset-tracking tool for movable safety
          equipment. Here&apos;s an honest, fact-checked look at how FireXCheck compares for teams
          whose scope is specifically fire extinguisher inspection and compliance.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>The short version</h2>
        <p>
          InspectNTrack (built by Wentworth Solutions, formerly a Brady product) is a barcode-based
          tracking system for movable safety assets — fire extinguishers, eyewash stations, AEDs — with
          category-specific inspection question sets and native Android, iOS and Windows apps.
          FireXCheck is built specifically for fire extinguisher compliance, with reporting mapped
          directly to BS 5306-3 and IS 291 rather than a generic question-set template.
        </p>
        <p>
          If your scope is extinguishers and you want standard-mapped compliance tracking without
          configuring question sets yourself, FireXCheck gets you there without a sales call. If
          you need one barcode system covering multiple categories of safety equipment across a US
          or mixed estate, InspectNTrack&apos;s broader scope is a reasonable fit.
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
                <th>InspectNTrack</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Built for</td>
                <td className="fxc-col">Fire extinguisher inspection &amp; compliance tracking (BS 5306-3, IS 291)</td>
                <td>Barcode tracking across multiple safety-asset categories — extinguishers, eyewash stations, AEDs and similar equipment</td>
              </tr>
              <tr>
                <td>Standards mapping</td>
                <td className="fxc-col">Reports mapped directly to BS 5306-3, BS 5839-1, BS 5266-1 and IS 291</td>
                <td>Category-specific question sets; not advertised as mapped to BS 5306-3 or IS 291</td>
              </tr>
              <tr>
                <td>Setup</td>
                <td className="fxc-col">Self-serve signup, live the same day — no sales call required</td>
                <td>No public self-serve signup found — pricing and onboarding require contacting Wentworth Solutions directly</td>
              </tr>
              <tr>
                <td>Pricing model</td>
                <td className="fxc-col">Flat per-site plans from £19/month, published on-site</td>
                <td>Unpublished and inconsistent across listings — figures seen range from roughly $84/month (billed annually) to a $1,500/year starting price</td>
              </tr>
              <tr>
                <td>Platform</td>
                <td className="fxc-col">Web app plus offline-capable mobile inspections</td>
                <td>Native Android, iOS and Windows 10 apps</td>
              </tr>
              <tr>
                <td>QR/barcode tagging</td>
                <td className="fxc-col">Included as standard on every extinguisher record</td>
                <td>Core to the product — barcode, QR, or RFID tagging supported</td>
              </tr>
              <tr>
                <td>Multi-site tracking</td>
                <td className="fxc-col">Built in on every plan</td>
                <td>Yes, including bulk moves of equipment to and from contractor locations</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="compare-source">
          InspectNTrack figures sourced from third-party listings — Capterra, GetApp, Software Advice,
          and G2 — as of November 2026. No official, consistent pricing page was found; the sources
          disagree with each other, so confirm current terms directly with Wentworth Solutions before
          relying on them.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Why teams switch to FireXCheck</h2>
        <p>
          <strong>You want compliance mapping built in, not a generic question set.</strong>{' '}
          InspectNTrack&apos;s inspection forms are organized by equipment category; FireXCheck&apos;s
          are built around the actual BS 5306-3 and IS 291 maintenance and extended-service cycles, so
          nothing needs configuring before your first inspection.
        </p>
        <p>
          <strong>You want to see the price before you talk to anyone.</strong> FireXCheck publishes
          flat per-site pricing from £19/month. InspectNTrack&apos;s pricing isn&apos;t consistently
          published, and third-party listings disagree with each other.
        </p>
        <p>
          <strong>You need clean audit trails without the overhead.</strong> FireXCheck was built
          around one job: making sure every extinguisher, at every site, has a documented,
          timestamped, inspector-signed record — ready the moment a fire marshal or auditor asks for it.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Where InspectNTrack makes sense</h2>
        <p>
          To be fair: if you need one barcode-tracking system across many categories of movable safety
          equipment — extinguishers, eyewash stations, AEDs, and similar assets — in a single tool,
          InspectNTrack&apos;s broader category scope and native desktop/mobile apps are a genuine
          advantage FireXCheck doesn&apos;t try to match. FireXCheck is purpose-built for fire
          extinguisher compliance specifically — we&apos;re not trying to be a general safety-asset
          tracker.
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
