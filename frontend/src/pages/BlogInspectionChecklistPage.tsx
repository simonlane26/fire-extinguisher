import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestComplianceChecklist } from '../lib/api';
import './LandingPage.css';
import './ComparePage.css';

const FAQ_DATA = [
  {
    q: 'Who can carry out a monthly fire extinguisher check?',
    a: 'Anyone trained to recognize the basics — it doesn’t require a certified engineer. Many businesses assign it to a nominated fire warden or facilities team member. The annual maintenance service is the one that needs a competent, typically BAFE-registered, engineer.',
  },
  {
    q: 'What should I do if a check fails?',
    a: 'Take the extinguisher out of service, tag it clearly as unusable, arrange for a replacement or repair, and log the failure with a date and reason — don’t just make a mental note. If you’re using FireXCheck, marking a unit “Out of Service” does this automatically and keeps it visible on the dashboard until it’s resolved.',
  },
  {
    q: 'Is this checklist a substitute for the annual service?',
    a: 'No — this is the monthly visual check only. It doesn’t replace the annual maintenance inspection by a competent person, which covers mechanical components this checklist can’t assess.',
  },
];

export default function BlogInspectionChecklistPage() {
  const navigate = useNavigate();
  const goToSignup = () => navigate('/signup');

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      await requestComplianceChecklist(email);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Something went wrong. Please try again.');
    }
  };

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
        <div className="eyebrow">Free Template</div>
        <h1>Fire Extinguisher Inspection Checklist (Free Template)</h1>
        <p className="lede">
          The monthly visual check, laid out as a checklist you can use today — no sign-up required
          to read it. Print it, or skip the paper entirely and run it from a phone.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>What a monthly check actually covers</h2>
        <p>
          A monthly fire extinguisher check under BS 5306-3 is a quick visual inspection — it
          doesn&apos;t require a certified engineer, just someone who knows what to look for. Here&apos;s
          the full list.
        </p>
        <ul className="price-list" style={{ maxWidth: 680 }}>
          <li>Extinguisher is in its designated location and clearly visible</li>
          <li>Access to the extinguisher is not blocked or obstructed</li>
          <li>Operating instructions are legible and facing outward</li>
          <li>Safety pin and tamper seal are both intact and unbroken</li>
          <li>Pressure gauge (if fitted) reads in the operable/green zone</li>
          <li>No visible damage, dents, corrosion, or signs of leakage on the body</li>
          <li>Hose and nozzle (if fitted) are clear, undamaged, and free of blockages</li>
          <li>Weight feels consistent with a full charge (no obvious loss of contents)</li>
          <li>The last service label is present, legible, and shows an in-date next service</li>
          <li>Signage identifying the extinguisher and its type is visible nearby</li>
        </ul>
        <p>
          If anything on this list fails, take the extinguisher out of service and arrange a
          replacement or repair — don&apos;t leave a failed unit in place assuming someone else will
          notice.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>How often to run through it</h2>
        <p>
          This checklist is for the monthly visual check. It&apos;s separate from — and doesn&apos;t
          replace — the annual maintenance service carried out by a competent person, or the 5- or
          10-year extended service/overhaul cycle that applies depending on extinguisher type. See{' '}
          <Link to="/blog/how-often-fire-extinguishers-serviced-uk">how often fire extinguishers need servicing in the UK</Link>{' '}
          for the full schedule.
        </p>
      </div>

      <div className="wrap compare-section">
        <h2>Want this as a printable checklist, emailed to you?</h2>
        {status === 'success' ? (
          <div className="checklist-success">Check your inbox — your checklist is on its way.</div>
        ) : (
          <form className="checklist-capture" onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
            <input
              type="email"
              className="checklist-capture-input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              required
              disabled={status === 'submitting'}
            />
            <button type="submit" className="btn-primary checklist-capture-btn" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Send Me the Checklist'}
            </button>
          </form>
        )}
        {status === 'error' && <div className="checklist-error">{error}</div>}
      </div>

      <div className="wrap compare-section">
        <h2>Or skip the paper entirely</h2>
        <p>
          A printed checklist is better than nothing, but it still has to be filed somewhere an
          auditor can find it later. FireXCheck turns this exact checklist into a mobile form —
          scan the extinguisher&apos;s QR tag, work through the same checks, and the result is saved
          automatically with a timestamp and your name attached, no paper to lose.
        </p>
      </div>

      <div className="compare-cta-band">
        <div className="wrap">
          <h2>Try the digital version</h2>
          <p>No sales call required. Start a free trial and log your first check in minutes.</p>
          <div className="compare-cta-actions">
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
            <Link className="btn-outline magnetic" to="/fire-extinguisher-inspection-software">See Inspection Software</Link>
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
            <Link to="/blog/what-is-bs-5306">Blog · What Is BS 5306-3?</Link>
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
            headline: 'Fire Extinguisher Inspection Checklist (Free Template)',
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
