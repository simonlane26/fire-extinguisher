import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ = [
  {
    q: 'Is FireXCheck a replacement for ServiceTrade or BuildingReports?',
    a: 'If fire extinguisher inspections are your core business or a major part of your facilities checklist, FireXCheck gives you that out of the box, built around BS 5306-3 and IS 291, with nothing to configure. If you run a multi-trade field service business and need dispatch, scheduling and invoicing in one system, ServiceTrade’s breadth may suit you better. If you need a single platform covering many compliance categories beyond extinguishers at enterprise scale, BuildingReports is worth evaluating.',
  },
  {
    q: 'Does FireXCheck support BS 5306-3 and IS 291 compliance reporting?',
    a: 'Yes — your account is set to one standard, BS 5306-3 (British) or IS 291 (Irish), and every inspection form and compliance report is generated against the correct intervals and documentation for that standard automatically.',
  },
  {
    q: 'Can I try FireXCheck without talking to sales first?',
    a: 'Yes. Start a free trial directly from the site — no credit card, no sales call required to see whether it fits.',
  },
];

export default function CompareServiceTradeBuildingReportsPage() {
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
            <Link className="nav-link" to="/faq">FAQ</Link>
            <button type="button" className="signin" onClick={goToSignup}>Sign In</button>
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
          </nav>
        </div>
      </header>

      <div className="wrap compare-hero">
        <Link className="compare-back" to="/compare">← All comparisons</Link>
        <div className="eyebrow">Compare</div>
        <h1>FireXCheck vs ServiceTrade vs BuildingReports: which fire inspection software actually fits you?</h1>
        <p className="lede">
          If you&apos;re evaluating fire extinguisher and life safety inspection software, you&apos;ve probably
          come across ServiceTrade and BuildingReports in your research. Both are established, capable
          tools — but they were built for broader field service and compliance reporting, not specifically
          for the day-to-day grind of fire extinguisher inspections. FireXCheck was. Here&apos;s an honest
          breakdown.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Quick answer</h2>
        <p><strong>Pick ServiceTrade</strong> if you&apos;re a multi-trade field service company (HVAC, fire, plumbing) that needs a full dispatch and invoicing platform.</p>
        <p><strong>Pick BuildingReports</strong> if you need reporting across many compliance categories (sprinklers, alarms, backflow) at enterprise scale.</p>
        <p><strong>Pick FireXCheck</strong> if you specifically manage fire extinguisher inspections — one site or a thousand — and want something your technicians can use in the field without a training manual.</p>
      </div>

      <div className="wrap compare-section">
        <h2>Feature comparison</h2>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th></th>
                <th className="fxc-col">FireXCheck</th>
                <th>ServiceTrade</th>
                <th>BuildingReports</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Built for</td>
                <td className="fxc-col">Fire extinguisher inspections specifically</td>
                <td>General field service — HVAC, fire, plumbing and other trades</td>
                <td>Broad compliance suite across many inspection categories</td>
              </tr>
              <tr>
                <td>Mobile-first inspection workflow</td>
                <td className="fxc-col">Yes</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Setup</td>
                <td className="fxc-col">Minutes, self-serve</td>
                <td>Typically days to weeks, sales-assisted</td>
                <td>Typically weeks, enterprise onboarding</td>
              </tr>
              <tr>
                <td>Pricing</td>
                <td className="fxc-col">Published on site, from £19/month</td>
                <td>Quote-only — custom tiers</td>
                <td>Quote-only — no published pricing found</td>
              </tr>
              <tr>
                <td>Free trial</td>
                <td className="fxc-col">Yes, no credit card required</td>
                <td>Not published — accounts are quote-based</td>
                <td>Not published — accounts are quote-based</td>
              </tr>
              <tr>
                <td>Standards coverage</td>
                <td className="fxc-col">BS 5306-3 and IS 291, built in</td>
                <td>Configurable — not pre-built around a specific extinguisher standard</td>
                <td>Broad compliance-category coverage across multiple inspection types</td>
              </tr>
              <tr>
                <td>Best for</td>
                <td className="fxc-col">SMB/mid-size inspection companies, facilities teams</td>
                <td>Multi-trade field service organisations</td>
                <td>Large enterprise compliance programmes</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="compare-source">
          Pricing and trial availability compiled from third-party software directories (Capterra,
          TrustRadius, SoftwareAdvice) as of October 2026 — neither ServiceTrade nor BuildingReports
          publishes pricing or trial terms on its own site, and sources disagree on whether a ServiceTrade
          trial currently exists. Confirm current terms directly with each vendor before relying on them.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Why teams switch to FireXCheck</h2>
        <p>
          <strong>You don&apos;t need a platform, you need a tool that works.</strong> ServiceTrade and
          BuildingReports are built to handle many compliance categories and trades. If fire extinguishers
          are your core business or a major part of your facilities checklist, you&apos;re paying for — and
          navigating — a lot you&apos;ll never touch.
        </p>
        <p>
          <strong>Pricing you can actually see.</strong> Neither competitor publishes pricing — you need a
          sales call just to get a number. We publish ours because we&apos;re not trying to lock you into a
          demo before you know whether this fits your budget.
        </p>
        <p>
          <strong>Built around how extinguisher inspections actually happen.</strong> Tag scanning,
          inspection checklists, auto-generated compliance reports — FireXCheck&apos;s workflow mirrors the
          job on-site, not a generic work-order template retrofitted for fire safety.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>What they do better</h2>
        <p>
          To be fair: ServiceTrade is the stronger choice if you&apos;re running a multi-trade service
          business and need scheduling, dispatch and invoicing in one system. BuildingReports has more
          institutional trust with large enterprise accounts and covers a wider range of inspection types
          beyond extinguishers. If that&apos;s your situation, they&apos;re worth evaluating.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>Try it yourself</h2>
          <p>Free to start, no sales call required. See if it fits your inspection workflow in the next 10 minutes.</p>
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
              <div className="footer-trust">No credit card. No contracts. Cancel anytime.</div>
            </div>
            <div className="footer-actions">
              <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
              <button type="button" className="footer-cta" onClick={goToSignup}>Book a demo →</button>
            </div>
          </div>
          <div className="also-included">
            <Link to="/compare/joblogic">Compare · vs Joblogic</Link>
            <Link to="/compare/uptick-ezmanagement">Compare · vs Uptick &amp; EZ Management</Link>
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
