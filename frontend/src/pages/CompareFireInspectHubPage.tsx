import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ = [
  {
    q: 'Is FireXCheck a replacement for Fire Inspect Hub?',
    a: 'For UK and Irish fire extinguisher compliance, yes — FireXCheck is built around BS 5306-3, BS 5839-1, BS 5266-1 and IS 291 from the ground up. Fire Inspect Hub appears to be built around NFPA standards (NFPA 10, 25, 72 and others) for the US fire protection contractor market, so if that’s your regulatory environment, it may be the better-aligned tool.',
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

export default function CompareFireInspectHubPage() {
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
        <h1>FireXCheck vs Fire Inspect Hub: Which Fire Extinguisher Inspection Software Fits Your Team?</h1>
        <p className="lede">
          Fire Inspect Hub is a mobile-first inspection tool built for fire protection contractors working to
          NFPA standards. Here&apos;s an honest comparison for teams whose compliance requirement is BS 5306-3
          or IS 291, not NFPA.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>The short version</h2>
        <p>
          Fire Inspect Hub, from GoCrewIT, is positioned for fire protection contractors performing
          inspections under NFPA 10, NFPA 25, NFPA 72 and several other US-centric codes — it can scan an
          extinguisher&apos;s existing label and generate its own printable QR labels, and tracks deficiencies
          and failed inspections across visits. FireXCheck is built around BS 5306-3 (extinguishers), BS
          5839-1 (fire alarms), BS 5266-1 (emergency lighting) and IS 291 (the Irish equivalent) — the
          standards that actually apply in the UK and Ireland.
        </p>
        <p>
          We couldn&apos;t find an independent vendor website or user reviews for Fire Inspect Hub beyond
          software-aggregator listings (Capterra, GetApp, Software Advice) — treat the specifics below as
          sourced from those listings, not firsthand verification, and confirm directly with GoCrewIT before
          relying on them.
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
                <th>Fire Inspect Hub</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Built for</td>
                <td className="fxc-col">Fire extinguisher inspection &amp; compliance tracking (BS 5306-3, BS 5839-1, BS 5266-1, IS 291)</td>
                <td>Fire protection contractor inspections under NFPA 10, 25, 72, 96, 17A, 101 and 855 (per listing)</td>
              </tr>
              <tr>
                <td>Region / standards fit</td>
                <td className="fxc-col">UK &amp; Ireland (BS / IS standards)</td>
                <td>US (NFPA standards) — not aligned to BS 5306-3 or IS 291</td>
              </tr>
              <tr>
                <td>Setup</td>
                <td className="fxc-col">Self-serve signup, live the same day — no sales call required</td>
                <td>No independently confirmed self-serve signup found; listings don&apos;t show a public free-trial flow</td>
              </tr>
              <tr>
                <td>Pricing model</td>
                <td className="fxc-col">Flat per-site plans from £19/month, published openly</td>
                <td>Third-party listings show roughly $69–79 per user/month — not published on a vendor pricing page we could verify</td>
              </tr>
              <tr>
                <td>QR/barcode tagging</td>
                <td className="fxc-col">Included as standard on every extinguisher record</td>
                <td>Can scan an existing label and print its own QR labels, with no vendor lock-in to proprietary tags, per listing</td>
              </tr>
              <tr>
                <td>Multi-site tracking</td>
                <td className="fxc-col">Built in on every plan</td>
                <td>Includes a customer/building-owner portal and deficiency tracking across visits, per listing</td>
              </tr>
              <tr>
                <td>Mobile inspections</td>
                <td className="fxc-col">Included, offline-capable</td>
                <td>Mobile-first on Android, iPhone and iPad, per listing</td>
              </tr>
              <tr>
                <td>Compliance reporting</td>
                <td className="fxc-col">One-click reports mapped directly to BS 5306-3 / BS 5839-1 / BS 5266-1 / IS 291</td>
                <td>Inspection and deficiency tracking mapped to NFPA codes, per listing</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="compare-source">
          Fire Inspect Hub figures sourced from third-party listings —{' '}
          <a href="https://www.capterra.com/p/10037388/Fire-Inspect-Hub/" target="_blank" rel="noopener noreferrer">Capterra</a>,{' '}
          <a href="https://www.getapp.com/real-estate-property-software/a/fire-inspect-hub/" target="_blank" rel="noopener noreferrer">GetApp</a>, and{' '}
          <a href="https://www.softwareadvice.com.au/software/538727/Fire-Inspect-Hub" target="_blank" rel="noopener noreferrer">Software Advice</a>{' '}
          — as of November 2026. We found no independent vendor site or user reviews to cross-check these
          details; confirm current features, standards coverage and pricing directly with GoCrewIT before
          relying on them.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Why teams switch to FireXCheck</h2>
        <p>
          <strong>You need the right standard, not an adjacent one.</strong> Fire Inspect Hub is modelled
          around NFPA codes. If your extinguishers, alarms or emergency lighting are inspected against BS
          5306-3, BS 5839-1, BS 5266-1 or IS 291, you need software built around those standards from the
          start — not one you&apos;re hoping maps across cleanly.
        </p>
        <p>
          <strong>You want to be live today, not after a demo.</strong> FireXCheck has no sales-call gate
          and openly published pricing — add a site, add your extinguishers, start logging inspections.
        </p>
        <p>
          <strong>You want pricing you can see before you talk to anyone.</strong> FireXCheck publishes flat
          per-site pricing from £19/month; Fire Inspect Hub&apos;s pricing, per third-party listings, runs
          considerably higher per user and isn&apos;t published on a vendor page we could verify.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Where Fire Inspect Hub makes sense</h2>
        <p>
          To be fair: if you&apos;re a fire protection contractor operating in the US under NFPA 10, 25, 72
          or the other codes it lists, a tool built specifically around those standards — with deficiency
          tracking and a customer portal aimed at that workflow — may fit your business better than a
          BS/IS-based platform ever could. FireXCheck is purpose-built for UK and Irish extinguisher
          compliance; we don&apos;t support NFPA inspection workflows.
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
