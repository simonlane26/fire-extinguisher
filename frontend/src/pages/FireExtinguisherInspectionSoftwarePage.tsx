import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ_DATA = [
  {
    q: 'What does fire extinguisher inspection software actually do?',
    a: 'It replaces the paper logbook or spreadsheet you use today with a digital system for scheduling, performing, and recording fire extinguisher inspections — each unit gets a QR tag, inspectors scan it and complete a short checklist from their phone, and the result is saved instantly with a timestamp, inspector name, and condition.',
  },
  {
    q: 'Can I keep using my existing paper tags alongside the software?',
    a: "Yes. FireXCheck doesn't replace your physical tags — it digitizes what happens after you look at one. Most teams keep their paper tag on the extinguisher and add a QR sticker next to it; the paper tag is for the room, the QR code is for the record.",
  },
  {
    q: 'Is fire extinguisher inspection software required by law?',
    a: 'No specific software is mandated, but BS 5306-3 in the UK (and IS 291 in Ireland) require a documented monthly visual check plus an annual maintenance inspection by a competent person. Software doesn’t create that legal requirement — it just makes the record provable instead of relying on handwriting that can fade, get lost, or never get filled in.',
  },
];

export default function FireExtinguisherInspectionSoftwarePage() {
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
        <Link className="compare-back" to="/">← Back to Home</Link>
        <div className="eyebrow">Inspection Software</div>
        <h1>Fire Extinguisher Inspection Software</h1>
        <p className="lede">
          Replace the clipboard and the paper logbook with digital fire extinguisher inspections you
          can actually prove happened. Scan a tag, complete the check, and the record is saved before
          you&apos;ve left the room.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>The problem with paper inspection logs</h2>
        <p>
          Most fire extinguisher inspection programs still run on some combination of a wall-mounted
          paper tag, a clipboard, and a spreadsheet someone updates &quot;when they get a minute.&quot;
          It works until it doesn&apos;t: a tag gets painted over, a clipboard goes missing between
          sites, or an inspector&apos;s handwriting is the only record that a unit was ever checked.
        </p>
        <p>
          None of that holds up well when an auditor, fire marshal, or insurer asks you to prove a
          specific extinguisher was inspected on a specific date. And none of it scales — a facilities
          manager with 40 extinguishers across three buildings is already juggling more paper than one
          person can reliably track.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>How FireXCheck&apos;s inspection software works</h2>
        <ul className="price-list" style={{ maxWidth: 640 }}>
          <li>Scan the QR tag on the extinguisher with your phone&apos;s camera — no separate scanner to buy or lose</li>
          <li>Work through a short inspection checklist on-site, no paper or signal required</li>
          <li>Record condition, inspector name, date, and notes in one submission</li>
          <li>FireXCheck automatically calculates and sets the next due date</li>
          <li>The record syncs the moment you&apos;re back online — nothing to re-key later</li>
        </ul>
        <img
          src="/images/landing/qr-scan.png"
          alt="Scanning a fire extinguisher QR tag with a phone"
          style={{ maxWidth: 280, display: 'block', margin: '8px 0 20px', borderRadius: 8 }}
        />
        <p>
          It&apos;s deliberately the same motion as checking a paper tag — look at the extinguisher,
          note what you see — except the record can&apos;t get lost, and nobody has to retype it into
          a spreadsheet that evening.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Digital inspection logs that hold up in an audit</h2>
        <p>
          Every inspection logged through FireXCheck is timestamped, attributed to the inspector who
          performed it, and stored against that exact extinguisher&apos;s history — permanently, not
          until someone loses the clipboard. When an auditor or fire marshal asks for proof, you
          export a clean PDF or CSV report by site, date range, or equipment status, mapped directly
          to BS 5306-3 and BS 5839-1 in the UK or IS 291 in Ireland, depending on which standard your
          account is set to.
        </p>
        <p>
          That&apos;s the real difference between a digital log and a paper one: a paper log can prove
          an inspection happened only if nobody has misplaced it since. A digital log just produces the
          record on demand.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Built for single sites and inspection companies alike</h2>
        <p>
          If you manage one building, FireXCheck gives you a simple way to stop relying on a wall tag
          and a memory. If you&apos;re a fire safety inspection company or a facilities team managing
          extinguishers across dozens of client sites, the same workflow scales — one dashboard, filterable
          by site, building, or inspector, so nothing falls through the cracks just because it&apos;s
          not the building you&apos;re standing in today.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>Start logging inspections properly</h2>
          <p>No sales call required. Start a free trial and log your first inspection in minutes.</p>
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
            <Link to="/fire-extinguisher-tracking-software">Fire Extinguisher Tracking Software</Link>
            <Link to="/fire-extinguisher-compliance-software">Fire Extinguisher Compliance Software</Link>
            <Link to="/fire-extinguisher-management-system">Fire Extinguisher Management System</Link>
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
