import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ = [
  {
    q: 'Is FireXCheck a replacement for SafetyCulture (iAuditor)?',
    a: 'If fire extinguisher compliance is your main need, yes — FireXCheck gives you BS 5306-3 and IS 291 scheduling and reporting already built in, with no template to design. If you need one platform for safety walks, quality audits, incident reporting and inspections across many departments or industries, SafetyCulture’s general-purpose breadth is a genuine advantage FireXCheck doesn’t try to match.',
  },
  {
    q: 'Does SafetyCulture have built-in fire extinguisher compliance scheduling?',
    a: "Not natively. SafetyCulture is a checklist and inspection-template builder — you (or a template from its public library) define the fire extinguisher questions and any reminder logic yourself. It doesn't track BS 5306-3 or IS 291 intervals automatically the way a purpose-built tool does.",
  },
  {
    q: 'Does FireXCheck support BS 5306 compliance reporting?',
    a: 'Yes — reports are generated mapped directly to BS 5306-3 (extinguishers), BS 5839-1 (fire alarms) and BS 5266-1 (emergency lighting), ready for review.',
  },
];

export default function CompareSafetyCulturePage() {
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
        <h1>FireXCheck vs SafetyCulture (iAuditor): Which Fits Fire Extinguisher Compliance?</h1>
        <p className="lede">
          SafetyCulture (formerly iAuditor) is a widely used general-purpose inspection and checklist
          platform, not a fire-safety-specific tool. Here&apos;s an honest, fact-checked look at how it
          compares to FireXCheck if your job is specifically fire extinguisher compliance.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>The short version</h2>
        <p>
          SafetyCulture is a flexible checklist and audit platform used across construction,
          manufacturing, retail, hospitality and many other industries — you build or adapt a template
          for whatever you&apos;re inspecting, including fire extinguishers if you choose to. FireXCheck
          is purpose-built specifically for fire extinguisher inspection and compliance, with BS 5306-3
          and IS 291 scheduling and reporting already built into the data model — nothing to design.
        </p>
        <p>
          If extinguisher compliance is your actual job, FireXCheck gets you there without building and
          maintaining your own checklist logic. If you need one platform to run many different kinds of
          inspections and audits across your organisation, SafetyCulture&apos;s general-purpose breadth
          is the better fit.
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
                <th>SafetyCulture (iAuditor)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Built for</td>
                <td className="fxc-col">Fire extinguisher inspection &amp; compliance tracking (BS 5306-3, IS 291)</td>
                <td>General-purpose inspection, audit and checklist platform used across safety, quality and compliance in many industries</td>
              </tr>
              <tr>
                <td>Fire extinguisher compliance logic</td>
                <td className="fxc-col">Built in — monthly and extended-service intervals tracked automatically per standard</td>
                <td>Not built in — you create or adapt a checklist template yourself; no automatic BS 5306-3/IS 291 interval tracking</td>
              </tr>
              <tr>
                <td>Setup</td>
                <td className="fxc-col">Self-serve signup, live the same day, extinguisher data model ready out of the box</td>
                <td>Self-serve signup with a free tier, but a fire-specific compliance setup still needs a template built or adapted first</td>
              </tr>
              <tr>
                <td>Pricing model</td>
                <td className="fxc-col">Flat per-site plans from £19/month, published on-site</td>
                <td>Free tier for small teams; Premium around $24–29 per user/month depending on billing term; Enterprise is custom-quoted</td>
              </tr>
              <tr>
                <td>QR/barcode tagging</td>
                <td className="fxc-col">Included as standard, tied directly to each extinguisher&apos;s compliance record</td>
                <td>Supported generically for linking assets to inspections, not specific to fire extinguishers</td>
              </tr>
              <tr>
                <td>Industry breadth</td>
                <td className="fxc-col">Fire safety only — extinguishers, fire alarms, emergency lighting, PAT testing</td>
                <td>Very broad — safety walks, quality audits, incident reporting and more across many industries</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="compare-source">
          SafetyCulture figures sourced from third-party trackers — TrustRadius, Capterra, G2 and
          PricingSaaS — as of November 2026. These sources disagree with each other on exact figures;
          confirm current pricing at safetyculture.com/pricing before relying on them.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Why teams switch to FireXCheck</h2>
        <p>
          <strong>You don&apos;t want to build your own compliance logic.</strong> SafetyCulture gives
          you a blank checklist; FireXCheck gives you the BS 5306-3 and IS 291 maintenance and
          extended-service cycles already wired into the extinguisher record, with alerts before
          anything&apos;s overdue.
        </p>
        <p>
          <strong>You want data built around extinguishers, not generic checklist items.</strong>{' '}
          Condition, location, standard, and due dates are first-class fields in FireXCheck — not
          answers typed into a form you designed yourself.
        </p>
        <p>
          <strong>You want pricing that scales with sites, not inspectors.</strong> FireXCheck charges
          flat per-site plans; SafetyCulture&apos;s paid tiers are priced per user, which can get
          expensive as your inspector headcount grows.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Where SafetyCulture makes sense</h2>
        <p>
          To be fair: if you need one platform for many different kinds of inspections — safety walks,
          quality audits, incident reporting, equipment checks across departments — and extinguishers
          are just one small piece of that, SafetyCulture&apos;s breadth, template library and
          general-purpose flexibility are a genuine advantage FireXCheck doesn&apos;t try to match.
          FireXCheck is purpose-built for fire extinguisher compliance specifically — we&apos;re not
          trying to be a general inspection platform.
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
