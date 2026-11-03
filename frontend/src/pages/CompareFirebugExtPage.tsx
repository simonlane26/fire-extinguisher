import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ = [
  {
    q: 'What is Firebug EXT?',
    a: 'Firebug EXT is a barcode-based inspection system for fire extinguishers and other safety devices, made by General Data Company (Cincinnati, Ohio, US) and positioned as the modernized successor to their older Firebug RM product. Inspectors scan a barcode on each device using a dedicated Android handheld or tablet running the Firebug EXT app.',
  },
  {
    q: 'Do I need special hardware for Firebug EXT or FireXCheck?',
    a: 'Firebug EXT is built around a dedicated Android handheld or tablet running its own app. FireXCheck uses the camera on any phone or tablet you already have — no proprietary device to buy, issue, or replace.',
  },
  {
    q: 'Is Firebug EXT priced publicly?',
    a: 'No — we couldn’t find a published price for Firebug EXT. Third-party directory listings route to a “Get Pricing” or demo-request form rather than showing a figure, so you’d need to contact General Data directly for current terms.',
  },
];

export default function CompareFirebugExtPage() {
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
        <h1>FireXCheck vs Firebug EXT: Phone-Based or Dedicated Handheld Fire Extinguisher Inspection?</h1>
        <p className="lede">
          Firebug EXT is a long-running barcode inspection system from General Data, built around a
          dedicated handheld device. Here&apos;s how it compares to FireXCheck&apos;s phone-based, UK/Irish
          standards-mapped approach.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>The short version</h2>
        <p>
          Firebug EXT is a barcode-based system for inspecting fire extinguishers and other safety devices,
          made by General Data Company in Cincinnati, Ohio. Inspectors use a dedicated Android handheld or
          tablet running the Firebug EXT app to scan each asset&apos;s barcode and record results, with a
          web-hosted option and 9 standard reports exportable as PDF or Excel. It&apos;s the modernized
          successor to General Data&apos;s older Firebug RM product.
        </p>
        <p>
          FireXCheck covers the same core job — scan, inspect, record, report — but runs on any phone
          or tablet you already own, with no dedicated hardware to buy or manage, and maps its compliance
          reporting specifically to BS 5306-3, BS 5839-1, BS 5266-1 and IS 291 for UK and Irish teams.
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
                <th>Firebug EXT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Built for</td>
                <td className="fxc-col">Fire extinguisher inspection &amp; compliance tracking (BS 5306-3, BS 5839-1, BS 5266-1, IS 291)</td>
                <td>Barcode-based inspection of fire extinguishers and other safety devices via a dedicated handheld app</td>
              </tr>
              <tr>
                <td>Setup</td>
                <td className="fxc-col">Self-serve signup, live the same day — no sales call required</td>
                <td>No public self-serve signup found — listings route to a demo request or &quot;Get Pricing&quot; form with General Data</td>
              </tr>
              <tr>
                <td>Pricing model</td>
                <td className="fxc-col">Flat per-site plans from £19/month, published openly</td>
                <td>Not published — quote-based via General Data</td>
              </tr>
              <tr>
                <td>Hardware</td>
                <td className="fxc-col">Any phone or tablet with a camera — nothing extra to buy</td>
                <td>Requires an Android handheld or tablet running the Firebug EXT app</td>
              </tr>
              <tr>
                <td>Multi-site tracking</td>
                <td className="fxc-col">Built in on every plan</td>
                <td>Not confirmed in available vendor material — ask General Data directly</td>
              </tr>
              <tr>
                <td>QR/barcode tagging</td>
                <td className="fxc-col">Included as standard, scanned with your phone&apos;s camera</td>
                <td>Included — barcode scanning is core to the product, via the dedicated handheld</td>
              </tr>
              <tr>
                <td>Compliance reporting</td>
                <td className="fxc-col">One-click reports mapped directly to BS 5306-3 / BS 5839-1 / BS 5266-1 / IS 291</td>
                <td>9 standard reports, exportable as PDF or Excel; alignment to a specific standard (e.g. NFPA vs BS 5306) not confirmed in available material</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="compare-source">
          Firebug EXT details sourced from{' '}
          <a href="https://www.general-data.com/sites/default/files/knowledge_base/Firebug_EXT_Sales_Brochure.pdf" target="_blank" rel="noopener noreferrer">General Data&apos;s own Firebug EXT sales brochure</a>{' '}
          and product pages, plus third-party directory listings (SoftwareSuggest, SaaSCounter), as of
          November 2026. No published pricing was found during research — General Data is a US (Ohio)
          vendor, so standards alignment for a UK/Irish team should be confirmed directly with them before
          relying on this comparison.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Why teams switch to FireXCheck</h2>
        <p>
          <strong>You don&apos;t want to buy, charge, or replace dedicated handhelds.</strong> Firebug EXT
          is built around its own Android device running its own app. FireXCheck runs in a browser or on
          any phone your inspectors already carry.
        </p>
        <p>
          <strong>You want pricing you can see before you talk to anyone.</strong> FireXCheck publishes
          its plans and pricing openly; Firebug EXT requires a demo or quote request to find out what it costs.
        </p>
        <p>
          <strong>You need reports mapped to BS 5306-3 or IS 291, not a generic report set.</strong>
          FireXCheck&apos;s reporting is built specifically around UK and Irish fire extinguisher standards —
          not a general set of exportable reports you adapt yourself.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Where Firebug EXT makes sense</h2>
        <p>
          To be fair: Firebug EXT has been around for years as a dedicated barcode inspection system, and a
          team already standardized on Android handhelds — with an existing relationship with General
          Data — may find a purpose-built device workflow genuinely useful, particularly for large US
          portfolios already inspecting other safety devices alongside extinguishers. FireXCheck is built
          for teams who&apos;d rather use the phones they already have and get UK/Irish standards-mapped
          reporting without procuring dedicated hardware.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>See it yourself</h2>
          <p>Start a free trial and log your first inspection in under 10 minutes — on the phone you already have.</p>
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
