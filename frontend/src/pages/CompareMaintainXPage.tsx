import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ = [
  {
    q: 'Is MaintainX built for fire extinguisher inspections?',
    a: 'Not specifically. MaintainX is a general CMMS (computerized maintenance management system) for work orders, asset management, and preventive maintenance across manufacturing, facilities, and many other industries. Fire-specific inspection workflows and compliance templates aren’t built in — you’d configure checklists and procedures yourself to fit BS 5306-3 or similar standards.',
  },
  {
    q: 'Does FireXCheck replace MaintainX for a facilities team that already uses it for general maintenance?',
    a: 'Not necessarily — many teams run both. MaintainX for general asset and work-order management, FireXCheck specifically for fire extinguisher (and fire alarm, emergency lighting, PAT) compliance, where the inspection intervals, record formats, and reports are already mapped to the right standard out of the box.',
  },
  {
    q: 'How does pricing compare?',
    a: 'FireXCheck is a flat per-site plan from £19/month covering up to 50 extinguishers and 3 users. MaintainX bills per user per month (reported between roughly $20–$25/user/month depending on the source, plus a free tier), so the total cost scales with headcount rather than asset count.',
  },
];

export default function CompareMaintainXPage() {
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
        <h1>FireXCheck vs MaintainX: Dedicated Fire Extinguisher Software or General CMMS?</h1>
        <p className="lede">
          MaintainX is a well-regarded, general-purpose maintenance management platform used across
          manufacturing and facilities. Here&apos;s an honest look at how it compares to FireXCheck for
          teams whose job is specifically fire extinguisher inspection and compliance.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>The short version</h2>
        <p>
          MaintainX is a CMMS built for work orders, asset management, and preventive maintenance across
          a wide range of industries — manufacturing floors, facilities teams, and multi-site operations
          that need a central system for keeping equipment running. It&apos;s not built around fire codes
          specifically; fire-safety reviewers note that recurring fire and life-safety inspections are
          possible on MaintainX, but fire-specific inspector workflows need configuration, and advanced
          compliance reporting can feel limited next to a dedicated fire-inspection platform.
        </p>
        <p>
          FireXCheck is built around one job: fire extinguisher inspection and compliance, mapped directly
          to BS 5306-3 and BS 5839-1/BS 5266-1 in the UK and IS 291 in Ireland. If extinguishers (and
          related fire safety equipment) are your actual scope, FireXCheck gets you compliant records
          without building that workflow yourself inside a general maintenance tool.
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
                <th>MaintainX</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Built for</td>
                <td className="fxc-col">Fire extinguisher inspection &amp; compliance tracking (BS 5306-3, BS 5839-1, BS 5266-1, IS 291)</td>
                <td>General CMMS — work orders, asset management &amp; preventive maintenance across manufacturing, facilities, and other industries</td>
              </tr>
              <tr>
                <td>Setup</td>
                <td className="fxc-col">Self-serve signup, live the same day — no sales call required</td>
                <td>Self-serve signup with a free tier available; fire-specific checklists and procedures need to be built by you</td>
              </tr>
              <tr>
                <td>Pricing model</td>
                <td className="fxc-col">Flat per-site plans from £19/month</td>
                <td>Per-user, per-month — reported around $20–$25/user/month depending on the source, plus a free tier</td>
              </tr>
              <tr>
                <td>Minimum team size</td>
                <td className="fxc-col">None — works for a solo operator</td>
                <td>None published — cost scales with the number of users added, not asset count</td>
              </tr>
              <tr>
                <td>Multi-site tracking</td>
                <td className="fxc-col">Built in on every plan</td>
                <td>Yes — Global Reporting and Global Procedures give cross-site visibility (vendor marketing)</td>
              </tr>
              <tr>
                <td>Mobile inspections</td>
                <td className="fxc-col">Included, offline-capable</td>
                <td>Included — mobile work orders and inspection checklists</td>
              </tr>
              <tr>
                <td>QR/barcode tagging</td>
                <td className="fxc-col">Included as standard on every extinguisher record</td>
                <td>Available for general assets; not fire-extinguisher-specific out of the box</td>
              </tr>
              <tr>
                <td>Compliance reporting</td>
                <td className="fxc-col">One-click reports mapped directly to BS 5306-3 / BS 5839-1 / BS 5266-1 / IS 291</td>
                <td>Global compliance dashboards flag missed inspections and non-compliance trends; no fire-code-specific report template confirmed — reviewers say fire-specific workflows require manual setup</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="compare-source">
          MaintainX figures sourced from{' '}
          <a href="https://www.getmaintainx.com/blog/safety-compliance-at-scale" target="_blank" rel="noopener noreferrer">MaintainX&apos;s own safety &amp; compliance pages</a>,{' '}
          third-party listings (Capterra, Software Advice) and the Infraspeak review (October 2026, pricing
          cross-checked against G2 as of June 2026), as of November 2026. Published per-user pricing varies
          by source ($20–$25/user/month) — confirm current terms directly with MaintainX before relying on them.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Why teams switch to FireXCheck</h2>
        <p>
          <strong>You don&apos;t want to build a fire-compliance workflow from scratch.</strong> MaintainX
          gives you the building blocks — work orders, checklists, procedures — but mapping those to
          BS 5306-3 or IS 291 intervals and documentation is on you. FireXCheck ships with that already done.
        </p>
        <p>
          <strong>You want cost that scales with assets, not headcount.</strong> MaintainX bills per user;
          if you&apos;ve got a small team managing a large extinguisher estate, a per-site FireXCheck plan
          is usually the cheaper, simpler model.
        </p>
        <p>
          <strong>You need a report that&apos;s already shaped like an audit answer.</strong> FireXCheck&apos;s
          reports are mapped directly to the standard your account is set to, ready the moment a fire
          marshal or auditor asks for them — not a generic maintenance log you reformat under pressure.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Where MaintainX makes sense</h2>
        <p>
          To be fair: if your team is already running general maintenance — production equipment, HVAC,
          facilities work orders — across a manufacturing site or multi-site estate, MaintainX&apos;s
          breadth, free tier, and established CMMS feature set are a genuine advantage FireXCheck doesn&apos;t
          try to match. Plenty of teams run MaintainX for everything else and FireXCheck specifically for
          fire extinguisher (and wider fire safety) compliance, where a dedicated, standards-mapped tool is
          worth having alongside a general CMMS rather than instead of one.
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
