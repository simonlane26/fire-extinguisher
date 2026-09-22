import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ = [
  {
    q: 'Is FirexCheck a replacement for Joblogic?',
    a: 'It depends what you need. If fire safety compliance — extinguishers, fire alarms, emergency lighting and PAT testing — is the job, FirexCheck gives you that out of the box, built around BS 5306, BS 5839-1 and BS 5266-1, with no forms to configure. If you’re already running engineers across HVAC, gas, door entry and fire & security in Joblogic and want one system for every trade, its breadth may suit you better than a fire-specific tool.',
  },
  {
    q: 'Does FirexCheck support BS 5306 compliance reporting?',
    a: 'Yes — reports are generated mapped directly to BS 5306 (extinguishers), BS 5839-1 (fire alarms) and BS 5266-1 (emergency lighting), ready for review.',
  },
  {
    q: 'Can I import my existing inspection data?',
    a: 'Yes. FirexCheck supports CSV import and export, so you can bring in your existing extinguisher register from a spreadsheet or another system.',
  },
];

export default function CompareJoblogicPage() {
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
            <Link className="nav-link" to="/compare/joblogic">Compare</Link>
            <button type="button" className="signin" onClick={goToSignup}>Sign In</button>
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
          </nav>
        </div>
      </header>

      <div className="wrap compare-hero">
        <Link className="compare-back" to="/">← Back to Home</Link>
        <div className="eyebrow">Compare</div>
        <h1>FirexCheck vs Joblogic: which fits a fire safety compliance team?</h1>
        <p className="lede">
          Joblogic is a well-established, general field service management platform used across trades
          including fire &amp; security, HVAC, gas and door maintenance. FirexCheck is built for one thing:
          fire safety compliance. Here&apos;s an honest, fact-checked look at where each one fits.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>The short version</h2>
        <p>
          Joblogic is a broad field service management platform — job scheduling, engineer tracking,
          invoicing and asset registers across many trades, with fire &amp; security as one of several
          verticals it supports. FirexCheck is purpose-built specifically for UK fire safety compliance:
          extinguishers, fire alarms, emergency lighting and PAT testing, mapped directly to BS 5306,
          BS 5839-1 and BS 5266-1 from day one.
        </p>
        <p>
          If you need one platform to run engineers across many different trades, Joblogic&apos;s breadth is
          a real strength. If fire safety compliance is the whole job, FirexCheck gets you there without
          configuring generic forms into a fire-specific workflow.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Feature-by-feature</h2>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th></th>
                <th className="fxc-col">FirexCheck</th>
                <th>Joblogic</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Built for</td>
                <td className="fxc-col">Fire safety compliance specifically (BS 5306, BS 5839-1, BS 5266-1)</td>
                <td>General field service management across many trades (HVAC, gas, door entry, fire &amp; security and more)</td>
              </tr>
              <tr>
                <td>Pricing model</td>
                <td className="fxc-col">Flat per-site plans from £19/month</td>
                <td>Per-user, from £45/user/month on the Standard plan (billed annually); Premium and Enterprise are quote-based</td>
              </tr>
              <tr>
                <td>Setup</td>
                <td className="fxc-col">Self-serve signup, live the same day</td>
                <td>Standard plan is self-serve; Premium/Enterprise get guided onboarding, which Joblogic notes may carry a fee depending on the project</td>
              </tr>
              <tr>
                <td>Mobile inspections</td>
                <td className="fxc-col">Included, offline-capable</td>
                <td>Included, offline-capable — both platforms offer an offline mobile app</td>
              </tr>
              <tr>
                <td>QR/barcode tagging</td>
                <td className="fxc-col">Included as standard on every extinguisher record</td>
                <td>Included as part of its asset management tools</td>
              </tr>
              <tr>
                <td>Compliance reporting</td>
                <td className="fxc-col">One-click reports mapped directly to BS 5306 / BS 5839-1 / BS 5266-1</td>
                <td>Configurable compliance forms — industry-standard or bespoke, built to suit whichever trade you set them up for</td>
              </tr>
              <tr>
                <td>Multi-site management</td>
                <td className="fxc-col">Built in on every plan</td>
                <td>Site asset registers and maintenance planning across multiple customer sites</td>
              </tr>
              <tr>
                <td>Support</td>
                <td className="fxc-col">Direct email support</td>
                <td>Phone and email support</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="compare-source">
          Joblogic figures and features sourced from <a href="https://www.joblogic.com/pricing/" target="_blank" rel="noopener noreferrer">joblogic.com/pricing</a> and{' '}
          <a href="https://www.joblogic.com/en-us/features" target="_blank" rel="noopener noreferrer">joblogic.com/features</a> (September 2026). Confirm current terms directly with Joblogic before relying on them.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Why teams choose FirexCheck for fire safety specifically</h2>
        <p>
          Joblogic is a solid, capable platform if you&apos;re running a multi-trade field service operation
          and want fire &amp; security handled inside the same system as everything else. But general-purpose
          tools mean general-purpose forms — you configure fire compliance into it rather than getting it
          built in.
        </p>
        <p>
          FirexCheck starts from BS 5306, BS 5839-1 and BS 5266-1, not a blank form builder. If fire safety
          compliance is the job — not one of ten trades you manage — that&apos;s the difference.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>Try it yourself</h2>
          <p>No sales call required. Start a free trial, tag your first site, and see your first compliance report in minutes.</p>
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
              <div className="faq-q">{item.q}</div>
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
            <button type="button" className="footer-cta" onClick={goToSignup}>Book a demo →</button>
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
