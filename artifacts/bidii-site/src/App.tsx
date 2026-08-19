import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import financeScreenshot from '@assets/Screenshot_(106)_1787081748997.png';
import bidiiLogo from '@assets/logo_1787082290625.png';
import {
  ArrowDownRight,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock3,
  CreditCard,
  GraduationCap,
  HeartHandshake,
  Laptop,
  Library,
  LockKeyhole,
  Mail,
  Menu,
  MessageSquare,
  Network,
  PanelTop,
  Phone,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  WalletCards,
  X,
} from 'lucide-react';

// Update this single value when the Trillionaire Designs website URL is confirmed.
const TRILLIONAIRE_DESIGNS_URL = 'https://trillionairedesigns.com';

type ModalKind = 'demo' | 'terms' | 'privacy' | 'conditions' | null;
type Cadence = 'monthly' | 'termly' | 'annual';

const features: Array<{
  title: string;
  copy: string;
  icon: LucideIcon;
  tone: string;
  screen: string;
  detail: string;
  image?: string;
}> = [
  { title: 'Attendance', copy: 'Mark the class in seconds. See patterns before they become a problem.', icon: ClipboardCheck, tone: 'tall', screen: 'Attendance intelligence', detail: 'Who is away, and how often?' },
  { title: 'Finance', copy: 'Know what is paid, what is waiting, and what needs a kind follow-up.', icon: WalletCards, tone: 'gold-card', screen: 'Terms & billing', detail: 'A real Bidii screen · add more finance views here', image: financeScreenshot },
  { title: 'Boarding', copy: 'Every dorm, bed, transfer and inspection in one calm view.', icon: PanelTop, tone: 'dark-card', screen: 'Boarding map', detail: '438 of 460 beds allocated' },
  { title: 'Library', copy: 'Scan, lend, return, and learn what your students actually read.', icon: Library, tone: '', screen: 'Circulation desk', detail: '18 books due today' },
  { title: 'Communication', copy: 'One message. The right people. A record of what happened.', icon: MessageSquare, tone: '', screen: 'Parent notice', detail: 'Form 2 trip • 96% delivered' },
  { title: 'Discipline & achievements', copy: 'Keep the whole learner story: context, action, follow-up and bright spots.', icon: HeartHandshake, tone: 'dark-card', screen: 'Learner timeline', detail: 'A fuller picture of Akinyi' },
];

const faqs = [
  ['What is Bidii?', 'Bidii is an AI-powered school management platform that connects student records, CBC academics, attendance, finance, library, boarding, communication, discipline, achievements and school intelligence in one system.'],
  ['Is Bidii built for Kenyan schools?', 'Yes. Bidii is designed around Kenyan school operations and the country’s transition toward competency-based education.'],
  ['Does Bidii support CBC and 8-4-4?', 'Yes. The academic experience supports Learning Area, Strand and Sub-Strand, with EE, ME, AE and BE performance levels. It can also support 8-4-4 and CBE workflows.'],
  ['What can Bidii AI do?', 'Bidii AI can help with timetable generation, school analysis, report remarks, discipline summaries, communication drafts and natural-language questions through Soma.'],
  ['Can Soma access everything?', 'No. Soma works within the information the user is authorized to access. Powerful answers still follow school permissions.'],
  ['Can we import existing data?', 'Yes. Bidii supports structured bulk imports, including information already living in school records and Excel sheets.'],
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useMemo(() => ({ current: null as HTMLDivElement | null }), []);
  const visible = useInView(ref, { once: true, margin: '-70px' });
  return (
    <motion.div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.72, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ScreenshotPlaceholder({ label, title, detail, dark = false, image }: { label: string; title: string; detail: string; dark?: boolean; image?: string }) {
  return (
    <div className={`module-shot ${dark ? 'module-shot-dark' : ''}`} data-testid={`screenshot-placeholder-${label.toLowerCase().replaceAll(' ', '-')}`}>
      <div className="module-shot-bar">
        <span className="mono">Product view · screenshot space</span>
        <span className="shot-dots"><i /><i /><i /></span>
      </div>
      {image ? (
        <div className="module-shot-image-wrap">
          <img className="module-shot-image" src={image} alt={`${label} Bidii school management product screen`} width="640" height="360" loading="lazy" />
          <div className="module-shot-caption">{detail}</div>
        </div>
      ) : (
        <div className="module-shot-content">
          <div className="shot-mini-label">{label}</div>
          <strong>{title}</strong>
          <div className="shot-chart">
            <span /><span /><span /><span /><span /><span />
          </div>
          <small>{detail}</small>
        </div>
      )}
    </div>
  );
}

function Brand() {
  return (
    <a className="brand" href="#top" data-testid="link-brand">
      <span className="brand-mark brand-logo-wrap"><img className="brand-logo" src={bidiiLogo} alt="BidiiKE school management logo" width="100" height="100" /></span>
      <span>bidii</span>
    </a>
  );
}

function ProductCard({ item, index }: { item: typeof features[number]; index: number }) {
  const Icon = item.icon;
  return (
    <Reveal delay={index * 0.06} className={`feature-card ${item.tone}`}>
      <div>
        <Icon className="feature-icon" size={24} strokeWidth={1.7} />
        <h3>{item.title}</h3>
        <p>{item.copy}</p>
      </div>
      <ScreenshotPlaceholder label={item.title} title={item.screen} detail={item.detail} dark={item.tone === 'dark-card'} image={item.image} />
    </Reveal>
  );
}

function LegalModal({ kind, close }: { kind: Exclude<ModalKind, 'demo' | null>; close: () => void }) {
  const content = {
    terms: {
      title: 'Terms of service',
      intro: 'A plain-language outline of the agreement between Bidii and a school using the service.',
      sections: [
        ['Using Bidii', 'A school may use Bidii for its own administration and learning operations. Each account should belong to the person and school it represents.'],
        ['Your information', 'Your school keeps ownership of its records. You may export information in full and should keep appropriate permission for the records you add.'],
        ['Responsible use', 'Keep passwords private, use role-based access carefully, and do not use Bidii to make a decision that should be made by a responsible school professional.'],
        ['Service changes', 'We may improve the service over time. Prices are reviewed once a year, never mid-term, and any add-on is opt-in.'],
      ],
    },
    privacy: {
      title: 'Privacy policy',
      intro: 'Bidii is built around a simple idea: school information should be useful, protected and handled with care.',
      sections: [
        ['What we handle', 'We handle information a school chooses to put into Bidii, such as learner, staff, academic, attendance and operational records.'],
        ['Why we handle it', 'We use it to provide the school service, produce requested insights and keep the platform safe. We do not treat Soma as a reason to open records beyond a user’s permissions.'],
        ['Who can see it', 'Access follows responsibility. Staff, parents and other users only see the information the school has chosen to share with them.'],
        ['Your choices', 'Schools can request clarification, correction or export of their information. Talk to us if a record needs attention.'],
      ],
    },
    conditions: {
      title: 'Conditions & acceptable use',
      intro: 'The guardrails that help a connected school system stay helpful for everyone.',
      sections: [
        ['School responsibility', 'The school decides its roles, permissions, retention choices and the people responsible for decisions.'],
        ['AI responsibility', 'Soma can summarize, draft and find patterns. It assists understanding; school staff remain responsible for decisions and actions.'],
        ['Sensitive records', 'Discipline and other sensitive records should only be added and viewed by authorized people, with care for the learner’s dignity.'],
        ['Fair access', 'Do not try to bypass permissions, interfere with another school’s information or use Bidii to harm a person.'],
      ],
    },
  }[kind];

  return (
    <div className="modal-backdrop" role="presentation" onClick={close}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="legal-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Close legal content" data-testid="button-close-legal"><X size={17} /></button>
        <div className="eyebrow">Bidii · {kind}</div>
        <h2 id="legal-title">{content.title}</h2>
        <p>{content.intro}</p>
        {content.sections.map(([heading, text]) => (
          <div key={heading}>
            <h3 style={{ fontFamily: 'var(--app-font-serif)', margin: '22px 0 4px' }}>{heading}</h3>
            <p style={{ marginTop: 0 }}>{text}</p>
          </div>
        ))}
        <button className="button-primary" onClick={close} data-testid="button-close-legal-bottom">Close</button>
      </div>
    </div>
  );
}

function DemoModal({ close }: { close: () => void }) {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    window.location.href = 'mailto:hello@bidii.school?subject=Book%20a%20Bidii%20demo';
  };
  return (
    <div className="modal-backdrop" role="presentation" onClick={close}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="demo-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Close demo form" data-testid="button-close-demo"><X size={17} /></button>
        <div className="eyebrow">A calm first step</div>
        <h2 id="demo-title">Let’s look at your school together.</h2>
        <p>Tell us a little about your school. We’ll reply with a practical walkthrough, not a hard sell.</p>
        {sent ? (
          <div className="success-box" data-testid="status-demo-sent">Your email app should open now. If it doesn’t, write to hello@bidii.school.</div>
        ) : (
          <form className="demo-form" onSubmit={submit}>
            <label>School name<input required name="school" placeholder="e.g. Mwangaza Academy" data-testid="input-school-name" /></label>
            <label>Your name<input required name="name" placeholder="e.g. Wanjiku Njoroge" data-testid="input-contact-name" /></label>
            <label>Work email<input required type="email" name="email" placeholder="you@school.ac.ke" data-testid="input-contact-email" /></label>
            <label>What would you like to understand?<textarea name="note" placeholder="Academics, fees, boarding..." data-testid="input-demo-note" /></label>
            <button className="button-primary" type="submit" data-testid="button-submit-demo">Book my demo <ArrowRight size={16} /></button>
          </form>
        )}
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [cadence, setCadence] = useState<Cadence>('termly');
  const [enrollment, setEnrollment] = useState(300);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 4200);
    return () => window.clearTimeout(timer);
  }, []);

  const termTotal = useMemo(() => {
    const first = Math.min(enrollment, 300) * 180;
    const second = Math.max(Math.min(enrollment - 300, 500), 0) * 130;
    const third = Math.max(enrollment - 800, 0) * 100;
    return first + second + third;
  }, [enrollment]);
  const cadencePrice = cadence === 'monthly' ? (termTotal * 3) / 12 : cadence === 'termly' ? termTotal * .92 : termTotal * 3 * .82;
  const cadenceLabel = cadence === 'monthly' ? 'per month' : cadence === 'termly' ? 'per term · 8% off' : 'per year · 18% off';
  const formatKes = (amount: number) => `KES ${Math.round(amount).toLocaleString('en-KE')}`;

  const navigate = (id: string) => {
    setMobileOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <div className={`preloader ${loading ? '' : 'done'}`} aria-hidden={!loading}>
        <div className="loader-grid" aria-hidden="true" />
        <div className="loader-stage">
          <div className="loader-watch" aria-label="Bidii is starting the school system">
            <div className="watch-face">
              <span className="watch-tick tick-1" /><span className="watch-tick tick-2" /><span className="watch-tick tick-3" /><span className="watch-tick tick-4" />
              <span className="watch-hand watch-hour" /><span className="watch-hand watch-minute" /><span className="watch-center" />
              <div className="watch-logo"><img src={bidiiLogo} alt="" width="100" height="100" /></div>
            </div>
          </div>
          <div className="loader-motto">Smart schools. Simple future.</div>
          <div className="loader-note mono"><span>BIDII</span> · Preparing your school system</div>
        </div>
        <a className="loader-credit" href={TRILLIONAIRE_DESIGNS_URL} target="_blank" rel="noopener noreferrer">Powered by Trillionaire Designs</a>
      </div>
      <div className="site-shell" id="top">
        <header className="nav-wrap">
          <div className="container">
            <nav className="nav" aria-label="Main navigation">
              <Brand />
              <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
                <a href="#product" onClick={() => setMobileOpen(false)} data-testid="link-product">Product</a>
                <a href="#how" onClick={() => setMobileOpen(false)} data-testid="link-how-it-works">How it works</a>
                <a href="#pricing" onClick={() => setMobileOpen(false)} data-testid="link-pricing">Pricing</a>
                <a href="#security" onClick={() => setMobileOpen(false)} data-testid="link-security">Trust</a>
                <button className="nav-demo" onClick={() => { setMobileOpen(false); setModal('demo'); }} data-testid="button-nav-demo">Book a demo</button>
              </div>
              <button className="menu-button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} data-testid="button-mobile-menu">
                {mobileOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </nav>
          </div>
        </header>

        <main>
          <section className="hero" aria-labelledby="hero-title">
            <div className="container">
              <div className="hero-grid">
                <Reveal>
                  <div className="eyebrow">Kenya’s AI-powered school management system</div>
                  <h1 id="hero-title">School management, <em>made simple.</em></h1>
                  <p className="hero-copy">Bidii brings people, learning, money and the everyday school day together in one school management system — so leaders can see clearly and teachers have more time for learners.</p>
                  <div className="hero-actions">
                    <button className="button-primary" onClick={() => setModal('demo')} data-testid="button-hero-demo">Book a demo <ArrowRight size={17} /></button>
                    <button className="button-secondary" onClick={() => navigate('product')} data-testid="button-hero-action">See Bidii in action <ArrowDownRight size={17} /></button>
                  </div>
                  <div className="hero-foot">Built for modern Kenyan schools · ready for the CBC era</div>
                </Reveal>
                <Reveal className="hero-art" delay={.15}>
                  <div className="art-orbit"><span className="orbit-dot" /></div>
                  <div className="dashboard-card">
                    <div className="dash-top"><div><div className="mono" style={{ color: '#2e796d' }}>Principal view</div><div className="dash-title">Good morning, Ms. Achieng</div></div><div className="dash-date">Tue · 14 May</div></div>
                    <div className="dash-grid">
                      <div className="dash-stat"><small>Enrolled learners</small><strong>1,248</strong></div>
                      <div className="dash-stat"><small>Today’s attendance</small><strong>94.7%</strong></div>
                      <div className="dash-stat"><small>Fees collected</small><strong>72%</strong></div>
                      <div className="dash-stat"><small>Library returns</small><strong>18</strong></div>
                    </div>
                    <div className="dash-chart"><div className="chart-label"><span>Learning progress</span><span>Term 2</span></div><div className="chart-bars"><span style={{ height: '48%' }} /><span style={{ height: '61%' }} /><span style={{ height: '55%' }} /><span style={{ height: '76%' }} /><span style={{ height: '69%' }} /><span style={{ height: '88%' }} /></div></div>
                  </div>
                  <div className="floating-note"><div className="note-head"><Sparkles size={14} /> Soma says</div><p>“Class 6 attendance is up 4.2% this month.”</p><small>Based on records you can access</small></div>
                </Reveal>
              </div>
              <div className="hero-rail" aria-label="Bidii highlights">
                <div><b>One connected record</b>for every learner’s journey.</div>
                <div><b>AI where it helps</b>with the heavy school work.</div>
                <div><b>Permissions built in</b>so the right people see the right things.</div>
                <div><b>Made for Kenya</b>and the way schools really work.</div>
              </div>
            </div>
          </section>

          <div className="marquee" aria-label="Bidii principles">
            <div className="marquee-track">{['CBC-ready', 'AI-assisted', 'School-wide intelligence', 'One connected system', 'Built for perseverance', 'CBC-ready', 'AI-assisted', 'School-wide intelligence', 'One connected system', 'Built for perseverance'].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div>
          </div>

          <section className="section intro" id="product">
            <div className="container">
              <div className="intro-grid">
                <Reveal><div className="section-label eyebrow">A smarter school day</div><div className="book-ribbon"><div><b>For the principal</b><span>See what needs your attention today.</span></div><div><b>For the teacher</b><span>Less administration. More time for learners.</span></div><div><b>For the parent</b><span>Stay close to the school’s chosen updates.</span></div></div></Reveal>
                <Reveal delay={.1}><h2>School life is a lot of pages. <em>Bidii helps you read the story.</em></h2><p className="section-copy">A learner is more than a mark, an absence or a fee balance. Bidii connects the information around that journey, so authorized staff can understand the bigger picture.</p></Reveal>
              </div>
            </div>
          </section>

          <section className="section how" id="how">
            <div className="container">
              <Reveal><div className="how-head"><div><div className="section-label eyebrow">How it works</div><h2 className="section-title">Three simple moves.</h2></div><p className="section-copy">No treasure hunt through folders. Bidii turns school information into a clear next step.</p></div></Reveal>
              <div className="steps">
                {[
                  ['01', 'Bring it together', 'Students, classes, learning, fees, attendance and records live in one connected school space.'],
                  ['02', 'Ask and understand', 'Dashboards and Soma help you notice patterns without needing to be a data expert.'],
                  ['03', 'Do the next right thing', 'Plan, follow up, communicate and support learners with the context in front of you.'],
                ].map(([number, title, copy], index) => <Reveal key={number} delay={index * .08} className="step"><span className="step-number">{number}</span><h3>{title}</h3><p>{copy}</p></Reveal>)}
              </div>
            </div>
          </section>

          <section className="section connected">
            <div className="container">
              <Reveal><div className="connected-intro"><div><div className="section-label eyebrow">The connected school</div><h2 className="section-title">The complete school management system for Kenya.</h2></div><p className="section-copy">Instead of moving information between systems, keep the people and the records close together. Every view is shaped by the work someone is responsible for.</p></div></Reveal>
              <Reveal delay={.12}><div className="connected-map">
                {[
                  [Users, 'People', 'Students, staff & parents'], [GraduationCap, 'Academics', 'CBC, CBE & 8-4-4'], [ClipboardCheck, 'Attendance', 'Today and over time'], [CreditCard, 'Finance', 'Fees & collection'], [PanelTop, 'Boarding', 'Beds, movement & care'], [Library, 'Library', 'Borrowing & demand'], [HeartHandshake, 'Development', 'Discipline & achievements'], [MessageSquare, 'Communication', 'The right message'],
                ].map(([Icon, title, detail], index) => {
                  const NodeIcon = Icon as LucideIcon;
                  return <div className="map-node" key={title as string} data-testid={`node-module-${index}`}><NodeIcon className="node-icon" size={22} /><strong>{title as string}</strong><small>{detail as string}</small></div>;
                })}
              </div></Reveal>
            </div>
          </section>

          <section className="section ai-section" id="ai">
            <div className="container">
              <div className="ai-grid">
                <Reveal><div className="section-label eyebrow">Meet Soma</div><h2 className="section-title">Ask your school. Get the answer.</h2><p className="section-copy">Soma is the intelligence inside Bidii. Ask in everyday language and get useful answers from the information you are allowed to see.</p><div className="ai-points">{[['Build', 'Timetables around real constraints.'], ['Analyze', 'Find patterns worth acting on.'], ['Create', 'Draft remarks and notices faster.'], ['Summarize', 'Make long records easier to understand.']].map(([title, copy]) => <div className="ai-point" key={title}><b>{title}</b><span>{copy}</span></div>)}</div></Reveal>
                <Reveal delay={.12}><div className="ai-panel"><div className="ai-panel-top"><span className="mono"><span className="soma-dot" /> Soma AI</span><span className="mono">Authorized view</span></div><div className="ai-query">Which classes have the lowest attendance this month?</div><div className="ai-answer"><div className="answer-mark">S</div><div className="answer-body"><p>Form 1 West is at 88.4%, followed by Form 2 East at 90.1%. Both have a higher Monday absence pattern than the rest of the school.</p><small>Want to see the attendance records?</small></div></div><ScreenshotPlaceholder label="Soma answer" title="Questions become useful next steps" detail="AI assists understanding. People stay in charge." /></div></Reveal>
              </div>
            </div>
          </section>

          <section className="section cbc" id="academics">
            <div className="container">
              <div className="cbc-grid">
                <Reveal><div className="cbc-diagram"><div className="cbc-circle circle-one">Learning area<small>where we learn</small></div><div className="cbc-circle circle-two">Strand<small>what we explore</small></div><div className="cbc-circle circle-three">Sub-strand<small>the small step</small></div></div></Reveal>
                <Reveal delay={.1}><div className="section-label eyebrow">Built for the CBC era</div><h2 className="section-title">More than digital record keeping.</h2><p className="section-copy">Capture, organize and understand learner progress across the CBC structure. One assessment tells you where a learner is. Progress tells you where they’re going.</p><div className="levels"><div className="level ee"><strong>EE</strong>Exceeds</div><div className="level me"><strong>ME</strong>Meets</div><div className="level ae"><strong>AE</strong>Approaches</div><div className="level be"><strong>BE</strong>Below</div></div><div style={{ marginTop: 22 }}><ScreenshotPlaceholder label="CBC intelligence" title="Progress across periods" detail="Less spreadsheet work. Better academic decisions." /></div></Reveal>
              </div>
            </div>
          </section>

          <section className="section feature-zone" id="modules">
            <div className="container">
              <Reveal><div className="feature-head"><div><div className="section-label eyebrow">The everyday work</div><h2 className="section-title">The details that make a school day move.</h2></div><p className="section-copy">Every module has a job. Together, they help your school keep its promises to learners and families.</p></div></Reveal>
              <div className="feature-list">{features.map((feature, index) => <ProductCard item={feature} index={index} key={feature.title} />)}</div>
            </div>
          </section>

          <section className="section leader" id="leaders">
            <div className="container">
              <div className="leader-grid">
                <Reveal><div className="section-label eyebrow">For school leaders</div><h2 className="section-title">See the bigger picture. Lead with confidence.</h2><p className="section-copy">Bidii turns everyday school data into information leadership can act on — from learner progress to outstanding balances, dorm attention and school-wide patterns.</p><div className="leader-note">The dashboard should answer one question: <em>what needs my attention today?</em></div></Reveal>
                <Reveal delay={.12}><div className="leader-questions">{['What changed?', 'Who needs attention?', 'Where is progress improving?', 'Which class needs support?', 'Where is money outstanding?', 'Where are learners succeeding?'].map((question, index) => <div className="leader-q" key={question}><span>0{index + 1}</span>{question}</div>)}</div><div style={{ marginTop: 20 }}><ScreenshotPlaceholder label="Principal dashboard" title="The whole school at a glance" detail="Live enrollment, attendance, discipline and library snapshots" dark /></div></Reveal>
              </div>
            </div>
          </section>

          <section className="section pricing" id="pricing">
            <div className="container">
              <Reveal><div className="pricing-head"><div><div className="section-label eyebrow">Pricing that grows gently</div><h2 className="section-title">Built around your school year, not ours.</h2></div><div className="pricing-toggle" role="tablist" aria-label="Payment cadence">{(['monthly', 'termly', 'annual'] as Cadence[]).map((option) => <button key={option} className={cadence === option ? 'active' : ''} onClick={() => setCadence(option)} role="tab" aria-selected={cadence === option} data-testid={`button-cadence-${option}`}>{option === 'annual' ? 'Annual' : option[0].toUpperCase() + option.slice(1)}</button>)}</div></div></Reveal>
              <Reveal delay={.1}><div className="pricing-card">
                <div><div className="eyebrow">Graduated estimate</div><div className="price-number" data-testid="text-price-estimate">{formatKes(cadencePrice)}<small> {cadenceLabel}</small></div><p className="price-context">For {enrollment.toLocaleString('en-KE')} learners · prices shown before add-ons</p><div className="slider-row"><label htmlFor="enrollment"><span>How many learners?</span><strong>{enrollment.toLocaleString('en-KE')}</strong></label><input id="enrollment" type="range" min="20" max="1500" step="5" value={enrollment} onChange={(event) => setEnrollment(Number(event.target.value))} data-testid="input-enrollment" /></div><p className="muted" style={{ fontSize: '.78rem', marginTop: 16 }}>Every school gets the Foundation rate for its first 300 learners. Your first term is free, with setup, migration and training covered by the one-time setup fee.</p></div>
                <div className="price-list"><div><span>Foundation · learners 1–300</span><b>KES 180 / learner / term</b></div><div><span>Growth · learners 301–800</span><b>KES 130 / learner / term</b></div><div><span>All-In · learners 800+</span><b>KES 100 / learner / term</b></div><div><span>One-time setup</span><b>KES 9,000</b></div><div><span>Low-fee & rural setup</span><b>From KES 4,000</b></div><div><span>Optional boarding</span><b>KES 50 / boarder / term</b></div><div><span>Optional library QR & offline</span><b>KES 30 / learner / term</b></div><div><span>Soma AI add-on</span><b>KES 5,000 / month</b></div><p className="muted" style={{ fontSize: '.72rem', lineHeight: 1.45, margin: '3px 0 0' }}>Library is included in Growth and All-In. Boarding and Soma are included in All-In. SMS, WhatsApp and email credits start at KES 1,000 per 1,000 messages.</p><button className="button-primary" style={{ marginTop: 15 }} onClick={() => setModal('demo')} data-testid="button-pricing-quote">Get a school quote <ArrowRight size={16} /></button></div>
              </div></Reveal>
              <div className="pricing-foot"><Reveal className="promise" delay={.08}><b>First term free</b><span>Full features. No card required. No strings attached.</span></Reveal><Reveal className="promise" delay={.16}><b>Always yours</b><span>Export your school data in full, any time, free of charge.</span></Reveal><Reveal className="promise" delay={.24}><b>No hidden fees</b><span>Add-ons are opt-in and priced before you say yes.</span></Reveal></div>
            </div>
          </section>

          <section className="section compatibility" id="compatibility">
            <div className="container">
              <div className="compat-grid">
                <Reveal><div className="devices" aria-label="Bidii works on phone, tablet and computer"><div className="device device-phone"><div className="device-screen"><span className="mono">Bidii</span><div className="mini-lines"><i /><i /><i /></div></div></div><div className="device device-tablet"><div className="device-screen"><span className="mono">School day</span><div className="mini-lines"><i /><i /><i /></div></div></div><div className="device device-laptop"><div className="device-screen"><span className="mono">Principal view</span><div className="mini-lines"><i /><i /><i /></div></div></div></div></Reveal>
                <Reveal delay={.1}><div className="section-label eyebrow">Where school happens</div><h2 className="section-title">One book. Every screen.</h2><p className="section-copy">Move from the staff room to the classroom to home without losing the thread. Bidii is designed for Android, iOS and PC.</p><div className="platform-list"><div className="platform-item"><Smartphone size={21} /> Android & iOS <small>for teachers, parents and teams on the move</small></div><div className="platform-item"><Laptop size={21} /> PC web app <small>for deep work, reporting and leadership</small></div><div className="platform-item"><QrCode size={21} /> Offline-friendly library <small>keep essential circulation moving when connectivity is unreliable</small></div></div></Reveal>
              </div>
            </div>
          </section>

          <section className="section security" id="security">
            <div className="container">
              <div className="security-grid">
                <Reveal><div className="section-label eyebrow">Trust & security</div><h2 className="section-title">Powerful school intelligence needs responsible access.</h2><p className="section-copy">Access follows responsibility. People see the information appropriate to their work, and schools stay in control of sensitive records.</p><ScreenshotPlaceholder label="Access controls" title="Every role sees its right view" detail="Teachers, bursars, librarians and principals work with the context they need." /></Reveal>
                <Reveal delay={.1}><div className="security-list">{[['Role-based access', 'People see what their role requires.', Users], ['School-level separation', 'Your school’s records stay your school’s.', Network], ['Controlled AI visibility', 'Soma only answers from authorized information.', Sparkles], ['Accountable activity', 'An audit trail keeps important changes visible.', Clock3], ['Secure authentication', 'Simple, responsible access for every account.', LockKeyhole], ['Sensitive records', 'Discipline and history stay carefully protected.', ShieldCheck]].map(([title, copy, Icon]) => { const SecurityIcon = Icon as LucideIcon; return <div className="security-row" key={title as string}><SecurityIcon size={22} /><div><b>{title as string}</b><span>{copy as string}</span></div></div>; })}</div></Reveal>
              </div>
              <Reveal className="migration"><div><h3>You don’t have to start from zero.</h3><p>Bring structured information from your existing records and Excel sheets. We help with migration and staff training.</p></div><button className="button-secondary" onClick={() => setModal('demo')} data-testid="button-migration-demo">Talk about migration <ArrowRight size={16} /></button></Reveal>
            </div>
          </section>

          <section className="section faq" id="faq">
            <div className="container">
              <Reveal><div className="section-label eyebrow">Questions, answered simply</div><h2 className="section-title">No small print hiding in the bushes.</h2></Reveal>
              <div className="faq-grid">{faqs.map(([question, answer], index) => <div className="faq-item" key={question}><button className="faq-button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index} data-testid={`button-faq-${index}`}><span>{question}</span>{openFaq === index ? <ChevronUp size={19} /> : <ChevronDown size={19} />}</button>{openFaq === index && <div className="faq-answer" data-testid={`text-faq-answer-${index}`}>{answer}</div>}</div>)}</div>
            </div>
          </section>

          <section className="section final-cta" id="demo">
            <div className="container">
              <Reveal><div className="section-label eyebrow">Ready for a better way to run your school?</div><h2 className="section-title">Give your school a system that can keep up.</h2><p className="section-copy">Manage your school. Understand your learners. Let AI do the heavy work.</p><button className="button-primary" onClick={() => setModal('demo')} data-testid="button-final-demo">Book a Bidii demo <ArrowRight size={17} /></button></Reveal>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div><Brand /><p className="footer-copy">The AI-powered operating system for the modern Kenyan school.<br /><br />Built for schools. Built for the CBC era. Built for better decisions.</p><button onClick={() => setModal('demo')} data-testid="button-footer-demo">Book a demo <ArrowRight size={14} /></button><a className="trillionaire-credit" href={TRILLIONAIRE_DESIGNS_URL} target="_blank" rel="noopener noreferrer" data-testid="link-trillionaire-designs">Powered by Trillionaire Designs</a></div>
              <div><h4>Explore</h4><a href="#product" data-testid="link-footer-product">Product</a><a href="#academics" data-testid="link-footer-academics">CBC intelligence</a><a href="#ai" data-testid="link-footer-ai">Soma AI</a><a href="#pricing" data-testid="link-footer-pricing">Pricing</a><a href="#compatibility" data-testid="link-footer-compatibility">Compatibility</a></div>
              <div><h4>Good to know</h4><button onClick={() => setModal('terms')} data-testid="button-footer-terms">Terms of service</button><button onClick={() => setModal('privacy')} data-testid="button-footer-privacy">Privacy policy</button><button onClick={() => setModal('conditions')} data-testid="button-footer-conditions">Conditions & acceptable use</button><a href="mailto:hello@bidii.school" data-testid="link-footer-email"><Mail size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />hello@bidii.school</a><a href="tel:+254700000000" data-testid="link-footer-phone"><Phone size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />+254 700 000 000</a></div>
            </div>
            <div className="footer-bottom"><span>© 2025 Bidii. Made with effort in Kenya.</span><span className="mono">Manage · Understand · Persevere</span></div>
          </div>
        </footer>
      </div>
      {modal === 'demo' && <DemoModal close={() => setModal(null)} />}
      {modal === 'terms' && <LegalModal kind="terms" close={() => setModal(null)} />}
      {modal === 'privacy' && <LegalModal kind="privacy" close={() => setModal(null)} />}
      {modal === 'conditions' && <LegalModal kind="conditions" close={() => setModal(null)} />}
    </>
  );
}

export default App;