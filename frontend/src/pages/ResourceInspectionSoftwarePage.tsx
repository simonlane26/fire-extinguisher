import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ_DATA = [
  {
    q: 'Is fire extinguisher inspection software required by law?',
    a: 'No specific software is mandated, but BS 5306-3 (and IS 291 in Ireland) require documented monthly checks and an annual maintenance inspection by a competent person — software just makes that record provable and repeatable instead of relying on a paper log that can go missing.',
  },
  {
    q: 'Can I use this for other fire safety equipment too?',
    a: 'Many teams start with extinguishers and expand to fire alarms, emergency lighting, and PAT testing as their compliance program matures — FireXCheck covers all four under one account.',
  },
];

export default function ResourceInspectionSoftwarePage() {
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
        <Link className="compare-back" to="/">← Back to Home</Link>
        <div className="eyebrow">Resources</div>
        <h1>What Is Fire Extinguisher Inspection Software? (And Who Actually Needs It)</h1>
        <p className="lede">
          If you&apos;re responsible for keeping fire extinguishers compliant — across one building or a
          hundred — you already know the paper-and-clipboard routine doesn&apos;t scale. Fire
          extinguisher inspection software is the category of tools built to fix that.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>The short answer</h2>
        <p>
          Fire extinguisher inspection software replaces manual logbooks and spreadsheets with a
          digital system for scheduling, performing, and documenting fire extinguisher inspections. It
          typically includes mobile inspection checklists, QR/barcode tagging per unit, automated
          compliance reminders for the monthly and annual inspection cycle, and centralized reporting
          you can hand to a fire marshal or auditor without digging through binders.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Why this category exists</h2>
        <p>
          Fire extinguishers aren&apos;t &quot;set and forget.&quot; In the UK, BS 5306-3 (the British
          Standard for portable extinguisher maintenance) calls for a monthly visual check plus a
          documented annual service by a competent person, with longer 5- or 10-year extended-service
          cycles depending on the extinguisher type. IS 291 sets the same annual cadence in Ireland,
          with its own 3-year discharge-test cycle layered on top. Multi-site facilities can have
          hundreds of units scattered across buildings, floors, and vendors — miss one tag, lose one
          paper form, and you&apos;re exposed to a failed audit or, worse, equipment that doesn&apos;t
          work when it matters. Software exists because spreadsheets don&apos;t send alerts,
          don&apos;t scale past a handful of locations, and don&apos;t hold up well when an inspector
          asks &quot;prove this was checked in March.&quot;
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>What to look for</h2>
        <ul className="price-list" style={{ maxWidth: 640 }}>
          <li><strong>Mobile-first inspections</strong> — techs or facilities staff should be able to scan a tag and complete a checklist from a phone, no paper involved.</li>
          <li><strong>Automated compliance scheduling</strong> — monthly/annual cycles tracked per unit, not per spreadsheet tab.</li>
          <li><strong>Audit-ready reporting</strong> — exportable, timestamped records you can produce instantly.</li>
          <li><strong>Multi-site visibility</strong> — one dashboard across all locations, not one spreadsheet per building.</li>
          <li><strong>Low setup friction</strong> — you shouldn&apos;t need a sales call and a six-week onboarding to tag your first extinguisher.</li>
        </ul>
      </div>

      <div className="wrap compare-section">
        <h2>Where FireXCheck fits</h2>
        <p>
          FireXCheck is built specifically for fire safety inspection companies and facilities teams
          who want the compliance tracking without the enterprise bloat. It&apos;s a focused
          alternative in a category where tools like Inspect Point, BuildingReports, and ServiceTrade
          have dominated — FireXCheck is built for teams who want to get set up and inspecting in
          days, not weeks, at a price that makes sense for small-to-mid size portfolios.
        </p>
        <p>
          If you&apos;re evaluating fire extinguisher inspection software and want something simple
          enough to actually get adopted by your team, start a free trial — no sales call required to
          see it in action.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>See it yourself</h2>
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
            <Link to="/compare">Compare · How FireXCheck stacks up</Link>
            <Link to="/faq">FAQ</Link>
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
