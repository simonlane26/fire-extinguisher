import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ComparePage.css';

const FAQ_DATA = [
  {
    q: 'Can I read BS 5306-3 for free?',
    a: 'Not the official text — BS 5306-3:2017 is copyrighted and sold by BSI (the British Standards Institution), typically for well over £100. What you can get for free is a practical summary of what it actually requires you to do, which is what most facilities managers and compliance officers are really looking for.',
  },
  {
    q: 'Is BS 5306-3 the same as the law?',
    a: 'No. BS 5306-3 is a code of practice, not legislation. The actual legal duty to keep firefighting equipment in efficient working order comes from the Regulatory Reform (Fire Safety) Order 2005 in England and Wales (and equivalent legislation in Scotland and Northern Ireland). BS 5306-3 is simply the recognized, industry-standard way of demonstrating that duty has been met — which is why insurers, fire risk assessors, and enforcing authorities treat it as the practical benchmark.',
  },
  {
    q: 'Does BS 5306-3 apply in Ireland?',
    a: 'No — the Republic of Ireland uses IS 291 instead, which sets a similar annual maintenance cycle but a different discharge-testing schedule. If you manage sites in both the UK and Ireland, you need to track each extinguisher against the correct standard for its location.',
  },
];

export default function BlogBs5306Page() {
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
        <Link className="compare-back" to="/blog">← Back to Blog</Link>
        <div className="eyebrow">Standards</div>
        <h1>What Is BS 5306-3? UK Fire Extinguisher Maintenance Standard Explained</h1>
        <p className="lede">
          If you&apos;re responsible for fire extinguishers anywhere in the UK, BS 5306-3 is the
          standard your maintenance schedule is almost certainly supposed to follow. Here&apos;s what
          it actually requires — without having to buy the document yourself.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>The short answer</h2>
        <p>
          BS 5306-3:2017 is the British Standard code of practice for the commissioning and
          maintenance of portable fire extinguishers. It sets out how often extinguishers should be
          checked, who&apos;s qualified to check them, and what each type of check should actually
          cover — from a quick monthly glance to a full annual service by a competent person.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Is BS 5306-3 free, or do I have to pay for it?</h2>
        <p>
          You have to pay for it if you want the official text — BSI (the British Standards
          Institution) owns the copyright and sells it as a standalone document. Most people searching
          for &quot;BS 5306-3 free&quot; aren&apos;t actually after the legal document itself, though —
          they want to know what it requires them to do. That part is genuinely free, and it&apos;s
          what the rest of this guide covers.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>What BS 5306-3 actually requires</h2>
        <p>There are three tiers of check, and they apply differently depending on who&apos;s doing them:</p>
        <ul className="price-list" style={{ maxWidth: 680 }}>
          <li><strong>Monthly visual check</strong> — done by any trained member of staff, no certification needed. Confirm the extinguisher is in its correct location, visible, unobstructed, undamaged, the pressure gauge (if fitted) reads in the operable range, and the safety pin and tamper seal are intact.</li>
          <li><strong>Annual maintenance (basic service)</strong> — carried out by a competent person, typically a BAFE-registered or manufacturer-trained engineer. A full mechanical check of every extinguisher, every 12 months, regardless of type.</li>
          <li><strong>Extended service / overhaul</strong> — a deeper check at longer intervals: water, foam, and most powder extinguishers every 5 years; CO2 and clean-agent extinguishers go straight to a 10-year overhaul instead of a 5-year extended service, and some sealed-for-life powder units follow the same 10-year cycle.</li>
        </ul>
      </div>

      <div className="wrap compare-section">
        <h2>Is BS 5306-3 a legal requirement?</h2>
        <p>
          Not directly. BS 5306-3 is a code of practice, not statute — nobody can prosecute you purely
          for not following a British Standard. The actual legal duty comes from the Regulatory Reform
          (Fire Safety) Order 2005 in England and Wales (and equivalent fire safety legislation in
          Scotland and Northern Ireland), which requires the &quot;responsible person&quot; for a
          premises to ensure firefighting equipment is maintained in efficient working order.
        </p>
        <p>
          BS 5306-3 is simply the recognized, practical way almost everyone — fire risk assessors,
          insurers, enforcing authorities — expects that legal duty to be demonstrated. In practice,
          following it is as close to mandatory as a non-statutory document gets.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Staying on top of it without reading the standard yourself</h2>
        <p>
          You don&apos;t need to own a copy of BS 5306-3 to stay compliant with it — you need a system
          that applies the correct intervals for you. FireXCheck sets your account to BS 5306-3 (or IS
          291 if you&apos;re in Ireland) once, then calculates every unit&apos;s next due date
          automatically, flags anything overdue, and produces a clean, exportable record the moment
          someone asks to see it.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>Stop guessing at intervals</h2>
          <p>No sales call required. Start a free trial and get the correct schedule applied automatically.</p>
          <div className="compare-cta-actions">
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
            <Link className="btn-outline magnetic" to="/fire-extinguisher-compliance-software">See Compliance Software</Link>
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
            <Link to="/blog/fire-extinguisher-inspection-checklist">Blog · Fire Extinguisher Inspection Checklist</Link>
            <Link to="/blog/how-often-fire-extinguishers-serviced-uk">Blog · How Often Do Extinguishers Need Servicing?</Link>
            <Link to="/blog/fire-safety-compliance-monitoring">Blog · Fire Safety Compliance Monitoring</Link>
            <Link to="/resources/what-is-fire-extinguisher-inspection-software">Resources · What Is Fire Extinguisher Inspection Software?</Link>
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
            '@type': 'Article',
            headline: 'What Is BS 5306-3? UK Fire Extinguisher Maintenance Standard Explained',
            datePublished: '2026-11-03',
            author: { '@type': 'Organization', name: 'FireXCheck' },
          }),
        }}
      />
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
