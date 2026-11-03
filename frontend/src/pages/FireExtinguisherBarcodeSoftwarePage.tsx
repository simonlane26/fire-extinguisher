import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ_DATA = [
  {
    q: 'Do I need a dedicated barcode scanner for fire extinguisher inspections?',
    a: 'No. Inspectors use their phone’s own camera to scan the QR code on each extinguisher — there’s no proprietary scanner to buy, charge, or lose. You print and apply the tags once; everything after that runs through the FireXCheck app or browser.',
  },
  {
    q: 'QR code or barcode — which does FireXCheck use?',
    a: 'FireXCheck uses QR codes rather than traditional 1D barcodes. QR codes hold more data, scan reliably at an angle or from further away, and read fine with any modern phone camera — no line-of-sight barcode scanner required.',
  },
  {
    q: 'What happens if a QR tag is damaged or missing?',
    a: 'You can look the extinguisher up manually from the register and reprint its tag — the record isn’t lost just because the physical sticker is. Reprinting the tag re-links the same ongoing inspection history, it doesn’t start a new one.',
  },
];

export default function FireExtinguisherBarcodeSoftwarePage() {
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
        <div className="eyebrow">Barcode Inspection Software</div>
        <h1>Fire Extinguisher Barcode Inspection Software</h1>
        <p className="lede">
          Scan a QR tag with the phone already in your pocket, log what you found, and the record is
          saved — no proprietary scanner, no extra hardware, no line to wait in at the equipment store.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Why barcode-based inspection beats a paper tag</h2>
        <p>
          A handwritten paper tag can only tell you what the last inspector wrote, if you can still
          read it. A barcode or QR-tagged extinguisher links that physical unit to a digital record
          that can&apos;t fade, smudge, or get swapped onto the wrong extinguisher by mistake. Scan the
          code and you&apos;re looking at that exact unit&apos;s full history — not a guess based on
          which wall it&apos;s hanging on.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>How FireXCheck&apos;s QR scanning works</h2>
        <img
          src="/images/landing/qr-scan.png"
          alt="Scanning a fire extinguisher QR code tag"
          style={{ maxWidth: 280, display: 'block', margin: '4px 0 20px', borderRadius: 8 }}
        />
        <ul className="price-list" style={{ maxWidth: 640 }}>
          <li>Every extinguisher gets a unique QR tag — included as standard, no extra module to buy</li>
          <li>Inspectors scan it with any phone camera, no dedicated barcode scanner required</li>
          <li>Scanning opens that exact extinguisher&apos;s record instantly — no searching by location or ID</li>
          <li>Complete the inspection checklist on the spot and the result syncs to the record</li>
          <li>Lost or damaged tags can be reprinted without breaking the unit&apos;s inspection history</li>
        </ul>
      </div>

      <div className="wrap compare-section">
        <h2>QR code vs traditional barcode</h2>
        <p>
          FireXCheck uses QR codes rather than 1D barcodes, deliberately. QR codes hold more
          information, tolerate damage and odd angles better, and — most importantly — read fine with
          an ordinary phone camera at normal scanning distance. A traditional barcode scanner is one
          more piece of hardware an inspector has to carry, charge, and eventually replace; a phone
          camera is something they already have on them.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Built for teams scanning dozens or thousands of units</h2>
        <p>
          Whether you&apos;re tagging 20 extinguishers in one office or several hundred across a
          multi-site estate, the scanning workflow doesn&apos;t change — print tags in bulk, apply
          them once, and every inspection from then on starts with a scan instead of a search.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>Tag your first extinguisher today</h2>
          <p>No sales call required. Start a free trial and print your first QR tags in minutes.</p>
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
            <Link to="/fire-extinguisher-inspection-software">Fire Extinguisher Inspection Software</Link>
            <Link to="/fire-extinguisher-tracking-software">Fire Extinguisher Tracking Software</Link>
            <Link to="/fire-extinguisher-compliance-software">Fire Extinguisher Compliance Software</Link>
            <Link to="/fire-extinguisher-management-system">Fire Extinguisher Management System</Link>
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
