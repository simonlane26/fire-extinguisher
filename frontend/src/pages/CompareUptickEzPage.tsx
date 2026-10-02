import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ = [
  {
    q: 'Is FirexCheck a replacement for Uptick or EZ Management?',
    a: 'For a team focused on extinguishers, fire alarms, emergency lighting and PAT, yes — FirexCheck covers that out of the box around BS 5306, BS 5839-1 and BS 5266-1, with no minimum team size. If you’re a larger fire inspection, testing and maintenance business (Uptick’s stated sweet spot is 3–50 technicians) or you need one system covering fire AND security assets like intruder panels and CCTV (EZ Management’s ezServiceHUB), their broader scope may suit you better.',
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

export default function CompareUptickEzPage() {
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
            <Link className="nav-link" to="/compare">Compare</Link>
            <button type="button" className="signin" onClick={goToSignup}>Sign In</button>
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
          </nav>
        </div>
      </header>

      <div className="wrap compare-hero">
        <Link className="compare-back" to="/compare">← All comparisons</Link>
        <div className="eyebrow">Compare</div>
        <h1>FirexCheck vs Uptick vs EZ Management</h1>
        <p className="lede">
          Uptick and EZ Management&apos;s ezServiceHUB are both real, established UK fire &amp; security compliance
          platforms. Here&apos;s an honest, fact-checked look at how FirexCheck compares.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>The short version</h2>
        <p>
          Uptick is built for fire inspection, testing and maintenance businesses running teams of 3–50
          technicians — it explicitly isn&apos;t designed for one-person operations. EZ Management&apos;s
          ezServiceHUB covers fire <em>and</em> security compliance together (fire alarms, intruder panels,
          CCTV) against NSI, SSAIB and BAFE standards, with a 3-user minimum. FirexCheck is built specifically
          around BS 5306, BS 5839-1 and BS 5266-1, works for a single-site operator or a large portfolio, and
          has no minimum team size.
        </p>
        <p>
          If you need fire and security handled in one system, or you&apos;re a larger technician team that
          wants a mature, established platform, Uptick or EZ Management are reasonable choices. If you want a
          fire-safety-specific register that scales down to a solo inspector as easily as it scales up, that&apos;s
          where FirexCheck fits.
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
                <th>Uptick</th>
                <th>EZ Management (ezServiceHUB)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Built for</td>
                <td className="fxc-col">UK fire safety compliance (BS 5306, BS 5839-1, BS 5266-1)</td>
                <td>Fire inspection, testing &amp; maintenance businesses</td>
                <td>Fire &amp; security compliance (NSI, SSAIB, BAFE) — alarms, intruder panels, CCTV</td>
              </tr>
              <tr>
                <td>Pricing model</td>
                <td className="fxc-col">Flat per-site plans from £19/month</td>
                <td>Per-user monthly pricing</td>
                <td>Per-user — ezLITE from €39/user/mo, ezPro from €49/user/mo (15% off with an annual contract)</td>
              </tr>
              <tr>
                <td>Contract terms</td>
                <td className="fxc-col">Month-to-month, no minimum</td>
                <td>No lock-in contracts — monthly, cancel anytime</td>
                <td>Monthly available; annual contract offers a discount</td>
              </tr>
              <tr>
                <td>Minimum team size</td>
                <td className="fxc-col">None — works for a solo operator</td>
                <td>Built for 3–50 technicians; not designed for one-person operations</td>
                <td>Minimum 3 users</td>
              </tr>
              <tr>
                <td>Setup</td>
                <td className="fxc-col">Self-serve signup, live the same day</td>
                <td>Guided onboarding with data migration and training — teams typically operational within ~2 months</td>
                <td>Not publicly specified</td>
              </tr>
              <tr>
                <td>Mobile inspections</td>
                <td className="fxc-col">Included, offline-capable</td>
                <td>Included (iOS/Android/iPad), offline mode</td>
                <td>Included, supports online and offline use</td>
              </tr>
              <tr>
                <td>QR/barcode tagging</td>
                <td className="fxc-col">Included as standard on every extinguisher record</td>
                <td>Not publicly specified</td>
                <td>Not publicly specified</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="compare-source">
          Uptick figures sourced from <a href="https://www.uptickhq.com/uk" target="_blank" rel="noopener noreferrer">uptickhq.com/uk</a>.
          EZ Management figures sourced from third-party listings (GetApp, Capterra) referencing ezServiceHUB, plus{' '}
          <a href="https://ezmanagement.com/asset-tracking-and-maintenance-management-software/" target="_blank" rel="noopener noreferrer">ezmanagement.com</a> (September 2026).
          Confirm current terms directly with each vendor before relying on them.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Where they might win</h2>
        <p>
          To be fair: if you&apos;re already a larger fire inspection and testing business, Uptick&apos;s platform
          is built around exactly that scale, with structured onboarding to match. And if you need one system
          covering fire safety alongside intruder alarms and CCTV rather than a fire-only tool, EZ Management&apos;s
          broader fire-and-security scope is a genuine advantage FirexCheck doesn&apos;t try to match.
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
            <div className="footer-actions">
              <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
              <button type="button" className="footer-cta" onClick={goToSignup}>Book a demo →</button>
            </div>
          </div>
          <div className="also-included">
            <Link to="/compare/joblogic">Compare · FirexCheck vs Joblogic</Link>
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
