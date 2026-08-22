import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LandingPage.css';

gsap.registerPlugin(ScrollTrigger);

const STD_DATA = [
  {
    code: '5306',
    title: 'Portable extinguishers',
    desc: 'Every unit logged against the standard that governs its inspection interval and condition criteria.',
  },
  {
    code: '5839',
    title: 'Fire alarm systems',
    desc: 'Weekly, quarterly and annual test logs, recorded exactly as the standard requires.',
  },
  {
    code: '5266',
    title: 'Emergency lighting',
    desc: 'Daily, monthly, annual and 3-yearly luminaire testing, tracked automatically.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  const goToSignup = () => navigate('/signup');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) root.classList.add('reduced-motion');

    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const q = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel);
      const qa = <T extends HTMLElement = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));

      function typeText(el: HTMLElement | null, text: string, speed: number) {
        if (!el) return;
        if (reducedMotion) {
          el.textContent = text;
          return;
        }
        let i = 0;
        el.textContent = '';
        const iv = setInterval(() => {
          el.textContent += text[i];
          i++;
          if (i >= text.length) clearInterval(iv);
        }, speed);
        cleanupFns.push(() => clearInterval(iv));
      }

      /* ---------- Hero intro timeline ---------- */
      const gaugeCaption = q('[data-el="gaugeCaption"]');
      const assetIdEl = q('[data-el="assetId"]');
      const stampEl = q('[data-el="stamp"]');
      const needleEl = q('[data-el="needle"]');
      const tagPanel = q('[data-el="tagPanel"]');
      const qrBoxEl = q('[data-el="qrBox"]');

      if (reducedMotion) {
        if (assetIdEl) assetIdEl.textContent = 'FEP-001';
        if (gaugeCaption) gaugeCaption.textContent = 'PRESSURE · CHARGED';
        if (stampEl) stampEl.style.opacity = '1';
        qa('.tag-row').forEach((r) => (r.style.opacity = '1'));
        if (qrBoxEl) qrBoxEl.style.opacity = '1';
      } else {
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl
          .from('.h1-line', { yPercent: 110, duration: 0.9, stagger: 0.12 })
          .from(
            '.hero-sub, .hero-actions, .trust-line, .std-row',
            { opacity: 0, y: 14, duration: 0.6, stagger: 0.08 },
            '-=0.5',
          )
          .from(tagPanel, { opacity: 0, y: 24, scale: 0.97, duration: 0.7 }, '-=0.6')
          .add(() => {
            typeText(assetIdEl, 'FEP-001', 70);
          }, '-=0.2')
          .fromTo(
            needleEl,
            { attr: { x2: 37, y2: 81 } },
            {
              attr: { x2: 80, y2: 41 },
              duration: 1.1,
              ease: 'power2.inOut',
              onComplete: () => {
                if (gaugeCaption) gaugeCaption.textContent = 'PRESSURE · CHARGED';
              },
            },
            '+=0.3',
          )
          .fromTo(
            stampEl,
            { opacity: 0, y: -40, rotate: -24, scale: 1.4 },
            { opacity: 1, y: 0, rotate: -6, scale: 1, duration: 0.5, ease: 'back.out(1.8)' },
            '-=0.3',
          )
          .to('.tag-row', { opacity: 1, duration: 0.4, stagger: 0.1 }, '-=0.1')
          .fromTo(qrBoxEl, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 }, '-=0.1');
      }

      /* ---------- Tag cursor tilt ---------- */
      if (!reducedMotion) {
        const heroEl = q('.hero');
        if (heroEl && tagPanel) {
          const onMove = (e: MouseEvent) => {
            const r = tagPanel.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(tagPanel, { rotateY: px * 6, rotateX: -py * 6, duration: 0.5, ease: 'power2.out' });
          };
          const onLeave = () => {
            gsap.to(tagPanel, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
          };
          heroEl.addEventListener('mousemove', onMove);
          heroEl.addEventListener('mouseleave', onLeave);
          cleanupFns.push(() => {
            heroEl.removeEventListener('mousemove', onMove);
            heroEl.removeEventListener('mouseleave', onLeave);
          });
        }
      }

      /* ---------- Magnetic buttons ---------- */
      if (!reducedMotion) {
        qa('.magnetic').forEach((btn) => {
          const onMove = (e: MouseEvent) => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            const max = 3;
            const dx = Math.max(-max, Math.min(max, x * 0.08));
            const dy = Math.max(-max, Math.min(max, y * 0.2));
            gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
          };
          const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' });
          btn.addEventListener('mousemove', onMove);
          btn.addEventListener('mouseleave', onLeave);
          cleanupFns.push(() => {
            btn.removeEventListener('mousemove', onMove);
            btn.removeEventListener('mouseleave', onLeave);
          });
        });
      }

      /* ---------- Pinned scroll story ---------- */
      const stepItems = qa('.step-item');
      const stagePanels = qa('.stage-panel');
      let enteredStage = -1;

      function resetStage(idx: number) {
        const panel = stagePanels[idx];
        if (idx === 0) {
          const line = panel.querySelector('[data-el="scanline"]');
          const result = panel.querySelector('[data-el="scanresult"]');
          gsap.set(line, { y: 0 });
          gsap.set(result, { opacity: 0 });
        } else if (idx === 1) {
          panel.querySelectorAll('.check-item').forEach((c) => c.classList.remove('done'));
          gsap.set(panel.querySelector('[data-el="inspectpass"]'), { opacity: 0 });
        } else if (idx === 2) {
          gsap.set(panel.querySelectorAll('.record-row'), { opacity: 0 });
        } else if (idx === 3) {
          const count = panel.querySelector('[data-el="assurecount"]');
          if (count) count.textContent = '0';
          gsap.set(panel.querySelectorAll('.site-row'), { opacity: 0 });
        }
      }

      function playStage(idx: number) {
        const panel = stagePanels[idx];
        if (idx === 0) {
          const line = panel.querySelector('[data-el="scanline"]');
          const result = panel.querySelector('[data-el="scanresult"]');
          gsap.to(line, { y: 180, duration: 1.1, ease: 'power1.inOut', repeat: 0 });
          gsap.to(result, { opacity: 1, duration: 0.4, delay: 1.0 });
        } else if (idx === 1) {
          const items = panel.querySelectorAll('.check-item');
          items.forEach((it, i) => {
            gsap.delayedCall(0.15 * i, () => it.classList.add('done'));
          });
          gsap.to(panel.querySelector('[data-el="inspectpass"]'), {
            opacity: 1,
            duration: 0.4,
            delay: 0.15 * items.length + 0.2,
          });
        } else if (idx === 2) {
          gsap.to(panel.querySelectorAll('.record-row'), { opacity: 1, duration: 0.4, stagger: 0.18 });
        } else if (idx === 3) {
          const countEl = panel.querySelector<HTMLElement>('[data-el="assurecount"]');
          const obj = { v: 0 };
          gsap.to(obj, {
            v: 247,
            duration: 1.1,
            ease: 'power2.out',
            onUpdate: () => {
              if (countEl) countEl.textContent = String(Math.round(obj.v));
            },
          });
          gsap.to(panel.querySelectorAll('.site-row'), { opacity: 1, duration: 0.4, stagger: 0.15, delay: 0.9 });
        }
      }

      function enterStage(idx: number) {
        if (idx === enteredStage) return;
        stepItems.forEach((el, i) => el.classList.toggle('active', i === idx));
        stagePanels.forEach((el, i) => {
          if (i === idx) {
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
            if (!reducedMotion) {
              resetStage(i);
              playStage(i);
            }
          } else {
            el.style.opacity = reducedMotion ? '1' : '0';
            el.style.pointerEvents = 'none';
          }
        });
        enteredStage = idx;
      }

      if (reducedMotion) {
        stepItems.forEach((el) => el.classList.add('active'));
        stagePanels.forEach((el) => {
          el.style.opacity = '1';
        });
        qa('.check-item').forEach((c) => c.classList.add('done'));
        const inspectPass = q('[data-el="inspectpass"]');
        if (inspectPass) inspectPass.style.opacity = '1';
        qa('.record-row').forEach((r) => (r.style.opacity = '1'));
        const assureCount = q('[data-el="assurecount"]');
        if (assureCount) assureCount.textContent = '247';
        qa('.site-row').forEach((r) => (r.style.opacity = '1'));
      } else {
        ScrollTrigger.create({
          trigger: q('.story'),
          start: 'top top',
          end: '+=3200',
          pin: q('.story-pin'),
          scrub: 1,
          onUpdate: (self) => {
            const idx = Math.min(3, Math.floor(self.progress * 4));
            enterStage(idx);
          },
        });
      }

      /* ---------- Standards giant-number morph ---------- */
      const giantNum = q('[data-el="giantNum"]');
      const stdDots = qa('.std-dot');
      let lastStdStage = 0;

      if (!reducedMotion) {
        ScrollTrigger.create({
          trigger: q('.standards2'),
          start: 'top top',
          end: '+=2400',
          pin: q('.standards2-pin'),
          scrub: 1,
          onUpdate: (self) => {
            const stage = Math.min(2, Math.floor(self.progress * 3));
            if (stage !== lastStdStage || lastStdStage === undefined) {
              lastStdStage = stage;
              if (giantNum) giantNum.textContent = STD_DATA[stage].code;
              qa('.std-card').forEach((c, i) => c.classList.toggle('active', i === stage));
              stdDots.forEach((d, i) => d.classList.toggle('active', i === stage));
            }
          },
        });
      }

      /* ---------- Horizontal module scroll ---------- */
      if (!reducedMotion) {
        gsap.to(q('[data-el="modulesTrack"]'), {
          xPercent: -75,
          ease: 'none',
          scrollTrigger: {
            trigger: q('.modules2'),
            start: 'top top',
            end: '+=2800',
            scrub: 1,
            pin: q('.modules2-pin'),
          },
        });
      }

      /* ---------- Stat count-up ---------- */
      qa('.stat').forEach((stat) => {
        const numEl = stat.querySelector<HTMLElement>('.num');
        if (!numEl) return;
        const target = +(numEl.dataset.value || '0');
        const prefix = numEl.dataset.prefix || '';
        const suffix = numEl.dataset.suffix || '';
        if (reducedMotion) {
          numEl.textContent = prefix + target + suffix;
          return;
        }
        ScrollTrigger.create({
          trigger: stat,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const obj = { v: 0 };
            gsap.to(obj, {
              v: target,
              duration: 1.2,
              ease: 'power2.out',
              onUpdate: () => {
                numEl.textContent = prefix + Math.round(obj.v) + suffix;
              },
            });
          },
        });
      });

      /* ---------- Generic reveal-on-scroll ---------- */
      const revealEls = qa('.reveal');
      if (reducedMotion) {
        revealEls.forEach((el) => el.classList.add('is-visible'));
      } else {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 },
        );
        revealEls.forEach((el) => io.observe(el));
        cleanupFns.push(() => io.disconnect());
      }
    }, root);

    return () => {
      cleanupFns.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <div className="fxc-landing" ref={rootRef}>
      <header>
        <div className="wrap header-inner">
          <div className="logo">
            <img src="/images/landing/firexcheck-logo.png" alt="FirexCheck" />
          </div>
          <nav>
            <a className="nav-link" href="#modules2">Features</a>
            <a className="nav-link" href="#pricing">Pricing</a>
            <a className="nav-link" href="#about">About</a>
            <button type="button" className="signin" onClick={goToSignup}>Sign In</button>
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
          </nav>
        </div>
      </header>

      <section className="hero" id="hero">
        <div>
          <div className="eyebrow">BS 5306-3 · Live Asset Register</div>
          <h1>
            <span className="line-mask"><span className="h1-line">Know the status of every extinguisher.</span></span>
            <span className="line-mask"><span className="h1-line">Before it&apos;s ever asked for.</span></span>
          </h1>
          <p className="hero-sub">FirexCheck replaces paper tags and spreadsheets with a live compliance register — QR-tagged assets, scheduled inspections, and audit-ready reports across every site you manage.</p>
          <div className="hero-actions">
            <button type="button" className="btn-primary magnetic" onClick={goToSignup}>Start Free Trial</button>
            <button type="button" className="btn-outline magnetic" onClick={goToSignup}>Book a Demo</button>
          </div>
          <div className="trust-line">No credit card required · 14-day free trial</div>
          <div className="std-row">
            <span className="std-badge">BS 5306</span>
            <span className="std-badge">BS 5839-1</span>
            <span className="std-badge">BS 5266-1</span>
          </div>
        </div>

        <div className="tag-stage">
          <div className="tag-panel" data-el="tagPanel">
            <div className="tag-hole"></div>
            <div className="tag-band">
              <div className="t1">FIRE EXTINGUISHER</div>
              <div className="t2">INSPECTION RECORD — DIGITAL</div>
            </div>
            <div className="tag-body">
              <div className="tag-id-row">
                <div>
                  <div className="lbl">Extinguisher No.</div>
                  <div className="val" data-el="assetId"></div>
                </div>
                <div className="stamp" data-el="stamp">PASSED</div>
              </div>

              <div className="gauge-wrap">
                <svg width="170" height="100" viewBox="0 0 180 105">
                  <path d="M15,95 A75,75 0 0,1 22,63.3" fill="none" stroke="#B8121F" strokeWidth="9" strokeLinecap="round" />
                  <path d="M22,63.3 A75,75 0 0,1 158,63.3" fill="none" stroke="#1E7A4C" strokeWidth="9" />
                  <path d="M158,63.3 A75,75 0 0,1 165,95" fill="none" stroke="#B8121F" strokeWidth="9" strokeLinecap="round" />
                  <circle cx="90" cy="95" r="5" fill="#1C1B18" />
                  <line data-el="needle" x1="90" y1="95" x2="37" y2="81" stroke="#1C1B18" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="gauge-caption" data-el="gaugeCaption">PRESSURE · CHECKING</div>
              </div>

              <div className="tag-rows">
                <div className="tag-row"><span className="label">Location</span><span className="val">Warehouse B — L1</span></div>
                <div className="tag-row"><span className="label">Last inspected</span><span className="val">14 Aug 2026</span></div>
                <div className="tag-row"><span className="label">Next due</span><span className="val">14 Nov 2026</span></div>
              </div>

              <div className="tag-qr-row">
                <svg className="qr-box" data-el="qrBox" viewBox="0 0 66 66" fill="none">
                  <rect width="66" height="66" fill="white" />
                  <rect x="4" y="4" width="16" height="16" fill="#1C1B18" />
                  <rect x="8" y="8" width="8" height="8" fill="white" />
                  <rect x="46" y="4" width="16" height="16" fill="#1C1B18" />
                  <rect x="50" y="8" width="8" height="8" fill="white" />
                  <rect x="4" y="46" width="16" height="16" fill="#1C1B18" />
                  <rect x="8" y="50" width="8" height="8" fill="white" />
                  <rect x="26" y="4" width="4" height="4" fill="#1C1B18" />
                  <rect x="34" y="4" width="4" height="4" fill="#1C1B18" />
                  <rect x="26" y="12" width="4" height="4" fill="#1C1B18" />
                  <rect x="26" y="26" width="4" height="4" fill="#1C1B18" />
                  <rect x="34" y="26" width="4" height="4" fill="#1C1B18" />
                  <rect x="42" y="26" width="4" height="4" fill="#1C1B18" />
                  <rect x="26" y="34" width="4" height="4" fill="#1C1B18" />
                  <rect x="46" y="34" width="4" height="4" fill="#1C1B18" />
                  <rect x="34" y="42" width="4" height="4" fill="#1C1B18" />
                  <rect x="26" y="46" width="4" height="4" fill="#1C1B18" />
                  <rect x="46" y="46" width="4" height="4" fill="#1C1B18" />
                  <rect x="54" y="46" width="4" height="4" fill="#1C1B18" />
                  <rect x="26" y="54" width="4" height="4" fill="#1C1B18" />
                  <rect x="42" y="54" width="4" height="4" fill="#1C1B18" />
                </svg>
                <div className="scan-hint">Scan on-site to open the live record</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="story" id="story">
        <div className="story-pin">
          <div className="wrap story-grid">
            <div className="story-steps">
              <div className="story-eyebrow">Scroll to see it work</div>
              <ul>
                <li className="step-item" data-step="0"><span className="step-num">01</span><span className="step-copy"><span className="step-label">Scan</span><p>Point a phone at the tag. The asset resolves instantly.</p></span></li>
                <li className="step-item" data-step="1"><span className="step-num">02</span><span className="step-copy"><span className="step-label">Inspect</span><p>Work through the checklist on-site — no paper, no delay.</p></span></li>
                <li className="step-item" data-step="2"><span className="step-num">03</span><span className="step-copy"><span className="step-label">Record</span><p>Photo, engineer, timestamp and signature saved automatically.</p></span></li>
                <li className="step-item" data-step="3"><span className="step-num">04</span><span className="step-copy"><span className="step-label">Assure</span><p>Every asset, every site, rolled up into one live register.</p></span></li>
              </ul>
            </div>

            <div className="story-visual">
              <div className="stage-panel" data-stage="0">
                <div className="stage-card">
                  <div className="phone-frame">
                    <div className="phone-qr">
                      <img src="/images/landing/qr-scan.png" alt="QR code" />
                    </div>
                    <div className="scan-line" data-el="scanline"></div>
                  </div>
                  <div className="scan-result" data-el="scanresult">Asset recognised<strong>FEP-001</strong></div>
                </div>
              </div>

              <div className="stage-panel" data-stage="1">
                <div className="stage-card">
                  <div className="check-list">
                    <div className="check-item"><span className="check-mark">✓</span><span className="lbl">Pressure</span></div>
                    <div className="check-item"><span className="check-mark">✓</span><span className="lbl">Pin &amp; seal</span></div>
                    <div className="check-item"><span className="check-mark">✓</span><span className="lbl">Hose</span></div>
                    <div className="check-item"><span className="check-mark">✓</span><span className="lbl">Body condition</span></div>
                    <div className="check-item"><span className="check-mark">✓</span><span className="lbl">Signage</span></div>
                  </div>
                  <div className="inspect-pass" data-el="inspectpass">PASS</div>
                </div>
              </div>

              <div className="stage-panel" data-stage="2">
                <div className="stage-card">
                  <div className="record-row"><span className="label">Photo</span><span className="value">Attached</span></div>
                  <div className="record-row"><span className="label">Engineer</span><span className="value">S. Lane</span></div>
                  <div className="record-row"><span className="label">Timestamp</span><span className="value">14 Aug 2026, 09:42</span></div>
                  <div className="record-row"><span className="label">Location</span><span className="value">Warehouse B — L1</span></div>
                  <div className="record-row"><span className="label">Signature</span><span className="value">Captured</span></div>
                </div>
              </div>

              <div className="stage-panel" data-stage="3">
                <div className="stage-card">
                  <div className="assure-count" data-el="assurecount">0</div>
                  <div className="assure-lbl">assets in this register</div>
                  <div>
                    <div className="site-row"><span className="name">Site 01 — Warehouse B</span><span className="pct">98%</span></div>
                    <div className="site-row"><span className="name">Site 02 — Building 153</span><span className="pct">94%</span></div>
                    <div className="site-row"><span className="name">Site 03 — Building 165</span><span className="pct">100%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="standards2" id="standards2">
        <div className="standards2-pin">
          <div className="giant-num" data-el="giantNum">5306</div>
          <div className="standards2-content">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Built around the standard</div>
            <h2>Not a generic checklist.</h2>
            <div className="std-cards">
              {STD_DATA.map((std, i) => (
                <div className={`std-card${i === 0 ? ' active' : ''}`} data-idx={i} key={std.code}>
                  <div className="std-code">BS {std.code}</div>
                  <div className="std-title">{std.title}</div>
                  <p className="std-desc">{std.desc}</p>
                </div>
              ))}
            </div>
            <div className="std-dots">
              {STD_DATA.map((std, i) => (
                <div className={`std-dot${i === 0 ? ' active' : ''}`} key={std.code}></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="modules2" id="modules2">
        <div className="modules2-pin">
          <div className="wrap modules2-head">
            <div className="eyebrow">Coverage</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 600 }}>One register. Every asset.</h2>
          </div>
          <div className="modules2-track" data-el="modulesTrack">
            <div className="module-panel">
              <img className="module-icon is-photo" src="/images/landing/extinguisher.jpg" alt="Fire extinguisher" />
              <div className="mnum">01</div>
              <h3>Extinguishers</h3>
              <div className="mstd">BS 5306</div>
              <p>QR-tagged asset register with service history, condition, and compliance status for every unit.</p>
            </div>
            <div className="module-panel">
              <img className="module-icon" src="/images/landing/fire-alarm.png" alt="Fire alarm" />
              <div className="mnum">02</div>
              <h3>Fire Alarms</h3>
              <div className="mstd">BS 5839-1</div>
              <p>Digital logbook for inspections, faults, engineer visits, and weekly/quarterly/annual records.</p>
            </div>
            <div className="module-panel">
              <img className="module-icon is-wide" src="/images/landing/emergency-lighting.png" alt="Emergency lighting" />
              <div className="mnum">03</div>
              <h3>Emergency Lighting</h3>
              <div className="mstd">BS 5266-1</div>
              <p>Luminaire register with daily, monthly, annual, and 3-yearly test logs and compliance tracking.</p>
            </div>
            <div className="module-panel">
              <img className="module-icon is-wide" src="/images/landing/pat-testing.png" alt="PAT testing" />
              <div className="mnum">04</div>
              <h3>PAT Testing</h3>
              <div className="mstd">IET COP</div>
              <p>Portable appliance register with full test logs, pass/fail records, and PDF report generation.</p>
            </div>
          </div>
          <div className="also-included">
            <span>Inspection scheduling</span>
            <span>Compliance reporting</span>
            <span>Multi-site management</span>
            <span>Photo capture &amp; defects</span>
            <span>Team collaboration</span>
          </div>
        </div>
      </section>

      <div className="wrap addon-section">
        <div className="eyebrow">Add-on modules</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 600, marginBottom: '8px' }}>Extend the register as your sites grow</h2>
        <p style={{ color: 'var(--ink-muted)', fontSize: '14px' }}>Add specialist modules to your plan — each priced and built to meet its own standard.</p>
        <div className="module-row">
          <div className="module-tag reveal"><div className="module-std">BS 5839-1</div><h4>Fire Alarm Logbook</h4><div className="module-price">+£12<span>/mo excl. VAT</span></div></div>
          <div className="module-tag reveal"><div className="module-std">BS 5266-1</div><h4>Emergency Lighting</h4><div className="module-price">+£12<span>/mo excl. VAT</span></div></div>
          <div className="module-tag reveal"><div className="module-std">IET COP</div><h4>PAT Testing</h4><div className="module-price">+£15<span>/mo excl. VAT</span></div></div>
        </div>
      </div>

      <div className="stat-strip">
        <div className="wrap stat-row">
          <div className="stat reveal"><div className="num" data-value="70" data-prefix="—" data-suffix="%">—0%</div><div className="lbl">Admin time removed with automated scheduling</div></div>
          <div className="stat reveal"><div className="num" data-value="3">0</div><div className="lbl">British Standards covered end-to-end</div></div>
          <div className="stat reveal"><div className="num" data-value="0">0</div><div className="lbl">Paper tags required on-site</div></div>
          <div className="stat reveal"><div className="num" data-value="100" data-suffix="%">0%</div><div className="lbl">Inspections completed from a phone</div></div>
        </div>
      </div>

      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Built For</div>
          <h2>Fire safety professionals, not generalists</h2>
        </div>
        <div className="persona-row">
          <div className="persona reveal"><div className="pnum">01</div><h4>Facilities Managers</h4><p>Manage fire safety compliance across all your buildings and asset types with ease.</p></div>
          <div className="persona reveal"><div className="pnum">02</div><h4>Fire Safety Contractors</h4><p>Streamline inspections, generate client reports, and provide a better service.</p></div>
          <div className="persona reveal"><div className="pnum">03</div><h4>Compliance Teams</h4><p>Maintain audit-ready records across extinguishers, alarms, lighting, and PAT — never miss a deadline.</p></div>
        </div>
      </div>

      <div className="wrap" id="pricing">
        <div className="section-head reveal">
          <div className="eyebrow">Pricing</div>
          <h2>Simple, transparent pricing</h2>
          <p>Choose the plan that fits your estate. All plans include a 14-day free trial.</p>
        </div>
        <div className="pricing-row">
          <div className="price-card reveal">
            <div className="price-tag"></div><h3>Starter</h3><div className="desc">Perfect for small businesses</div>
            <div className="price-num">£19<span>/month</span></div>
            <ul className="price-list"><li>Up to 50 extinguishers</li><li>3 users</li><li>QR code generation</li><li>Email reminders</li><li>Basic reports</li></ul>
            <button type="button" className="btn-outline magnetic" style={{ textAlign: 'center' }} onClick={goToSignup}>Start Free Trial</button>
          </div>
          <div className="price-card featured reveal">
            <div className="price-tag">Most deployed</div><h3>Professional</h3><div className="desc">For growing organizations</div>
            <div className="price-num">£49<span>/month</span></div>
            <ul className="price-list"><li>Up to 250 extinguishers</li><li>10 users</li><li>Advanced analytics</li><li>Custom branding</li><li>PDF/CSV exports</li><li>Priority email support</li></ul>
            <button type="button" className="btn-primary magnetic" style={{ textAlign: 'center' }} onClick={goToSignup}>Start Free Trial</button>
          </div>
          <div className="price-card reveal">
            <div className="price-tag"></div><h3>Business</h3><div className="desc">For large enterprises</div>
            <div className="price-num">£99<span>/month</span></div>
            <ul className="price-list"><li>Up to 1,000 extinguishers</li><li>Unlimited users</li><li>API access</li><li>Custom domain</li><li>Priority support</li><li>Dedicated account manager</li></ul>
            <button type="button" className="btn-outline magnetic" style={{ textAlign: 'center' }} onClick={goToSignup}>Book a Demo</button>
          </div>
        </div>
      </div>

      <footer id="about">
        <div className="wrap">
          <div className="footer-inner reveal">
            <div>
              <div className="footer-title">Get the register set up</div>
              <div className="footer-sub">Talk to us about your sites, asset counts, and which modules you need — we&apos;ll set up your first register together.</div>
            </div>
            <button type="button" className="footer-cta" onClick={goToSignup}>Book a demo →</button>
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
