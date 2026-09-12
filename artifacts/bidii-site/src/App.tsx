import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import financeScreenshot from '@assets/Screenshot_(106)_1787081748997.png';
import bidiiLogo from '@assets/logo_1787082290625.png';
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
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
  { title: 'Diary', copy: 'Send assignments to the right learners. Track who submitted, who needs a nudge, and keep the learning conversation flowing.', icon: BookOpen, tone: 'gold-card', screen: 'Assignment tracker', detail: '24 of 28 students submitted on time' },
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
  type LegalSection = { heading: string; body?: string; items?: string[]; sub?: { clause: string; text: string }[] };
  type LegalDoc = { title: string; subtitle: string; effectiveDate: string; intro: string; sections: LegalSection[] };

  const content: LegalDoc = ({
    terms: {
      title: 'Terms of Service',
      subtitle: 'Cloud-Based School Management System — Trillionaire Designs Ltd.',
      effectiveDate: 'Effective Date: 9 September 2026 · Governing Law: Republic of Kenya',
      intro: 'These Terms of Service ("Terms") govern access to and use of Bidii, a cloud-based School Management System owned and operated by Trillionaire Designs Ltd. ("Bidii," "we," "our," or "us"). By creating an account, subscribing to, or otherwise using Bidii, the subscribing School and its authorised Users agree to be bound by these Terms. These Terms should be read together with the Bidii Privacy Policy and the Bidii Conditions & Acceptable Use Policy, both of which are incorporated by reference.',
      sections: [
        { heading: '1. Definitions', items: ['"Platform" means the Bidii School Management System, including its web application, mobile interfaces, and APIs.', '"School" means the institution subscribing to Bidii.', '"Administrator" means the person authorised by the School to manage the Platform.', '"User" means any authorised Principal, Teacher, Parent, Student, or Staff member accessing the Platform.', '"Subscription" means the paid plan selected by the School.', '"Business Day" means Monday to Friday, excluding Kenyan public holidays.', '"Confidential Information" means non-public information disclosed by one party to the other in connection with these Terms.', '"SLA" means the Bidii Service Level Agreement entered into between Bidii and a School, where applicable.', '"Order Form" means the document or online order confirming a School\'s Subscription, pricing, and term.'] },
        { heading: '2. Eligibility and Acceptance', sub: [{ clause: '2.1', text: 'Only authorised representatives of a School may register a School account.' }, { clause: '2.2', text: 'By registering, the representative confirms they have authority to legally bind their institution to these Terms.' }] },
        { heading: '3. Services', body: 'Bidii provides school management services including:', items: ['Student Management', 'Staff Management', 'Parent Management', 'Academic Management', 'AI Timetable Generation', 'Attendance Management', 'Assessment and Examination Management', 'Student Discipline Records', 'Student Achievement Records', 'Library Management', 'School Communication', 'Reports and Analytics'] },
        { heading: '4. User Accounts', body: 'The School Administrator is responsible for creating and managing user accounts, assigning appropriate permissions, ensuring login credentials remain confidential, and immediately disabling access for users who leave the institution. Users are responsible for maintaining the confidentiality of their passwords. Detailed rules on roles, permissions, and acceptable conduct are set out in the Bidii Conditions & Acceptable Use Policy.' },
        { heading: '5. Subscription and Payments', sub: [{ clause: '5.1', text: 'Schools agree to pay all subscription fees according to their selected pricing plan, quotation, or Order Form.' }, { clause: '5.2', text: 'Unless otherwise agreed in writing, subscription fees are non-refundable.' }, { clause: '5.3', text: 'If payment remains outstanding fifteen (15) days after the due date, Bidii may issue a written reminder. If payment is not received within a further fifteen (15) days, Bidii may suspend certain features or restrict account access, provided Bidii gives at least seven (7) days\' written notice before doing so.' }, { clause: '5.4', text: 'Continued non-payment may result in eventual termination of the Subscription after reasonable notice.' }, { clause: '5.5', text: 'Suspension for non-payment does not relieve the School of its obligation to pay outstanding fees.' }, { clause: '5.6', text: 'Unless otherwise stated in an Order Form, subscription fees are exclusive of VAT and any other applicable taxes or levies.' }] },
        { heading: '6. Data Ownership and Data Protection', sub: [{ clause: '6.1', text: 'The School retains full ownership of all student, staff, parent, academic, and institutional data entered into Bidii. Bidii does not claim ownership of School data.' }, { clause: '6.2', text: 'Bidii\'s collection, use, protection, and disclosure of Personal Data, the parties\' respective roles as Data Controller and Data Processor, breach notification commitments, data retention, and data subject rights are set out in full in the Bidii Privacy Policy, which forms part of these Terms.' }] },
        { heading: '7. Availability', body: 'We aim for high service availability but do not guarantee uninterrupted access. Maintenance, upgrades, internet failures, or events beyond our control may temporarily affect availability.' },
        { heading: '8. Backups', body: 'Bidii performs routine backups. However, Schools are encouraged to retain copies of important reports and records.' },
        { heading: '9. AI Features', body: 'AI-generated outputs, including timetables, summaries, analytics, and recommendations, are provided to assist Schools. The School remains responsible for reviewing and approving all AI-generated decisions before implementation.' },
        { heading: '10. Third-Party Services', body: 'Some Platform features may integrate with third-party services. Their use may also be subject to those providers\' own terms and privacy policies.' },
        { heading: '11. Intellectual Property', body: 'Bidii, its software, logos, branding, AI systems, databases, and documentation remain the exclusive property of Trillionaire Designs Ltd. No ownership rights are transferred to Schools or Users.' },
        { heading: '12. Suspension and Termination', sub: [{ clause: '12.1', text: 'We may suspend or terminate access if these Terms or the Conditions & Acceptable Use Policy are violated; subscription payments remain outstanding; the Platform is used unlawfully; or continued access threatens the security or stability of the Platform.' }, { clause: '12.2', text: 'Except in circumstances involving serious security, legal, or safety concerns, Bidii shall provide the School with reasonable notice and an opportunity to remedy a breach before termination.' }, { clause: '12.3', text: 'A School may terminate its Subscription by providing thirty (30) days\' written notice to Bidii, or as otherwise set out in its applicable SLA or Order Form.' }] },
        { heading: '13. Effect of Termination', sub: [{ clause: '13.1', text: 'Upon termination, the School\'s right to access the Platform shall end on the agreed termination date.' }, { clause: '13.2', text: 'Bidii shall, upon the School\'s written request made within thirty (30) days of termination, provide the School with an export of the School\'s data in a commonly used, machine-readable format at no additional cost.' }, { clause: '13.3', text: 'Bidii shall securely delete or anonymise the School\'s data within ninety (90) days following the data export, save where retention is required by applicable law.' }, { clause: '13.4', text: 'Any unpaid fees properly due up to the termination date shall remain payable.' }] },
        { heading: '14. Limitation of Liability', sub: [{ clause: '14.1', text: 'To the maximum extent permitted by law, Bidii shall not be liable for indirect, incidental, consequential, or special damages arising from use of the Platform.' }, { clause: '14.2', text: 'Bidii\'s total aggregate liability to a School shall not exceed the subscription fees paid by the School during the twelve (12) months preceding the claim.' }, { clause: '14.3', text: 'Nothing in these Terms excludes or limits liability where such exclusion or limitation is prohibited by applicable law.' }] },
        { heading: '15. Indemnification', sub: [{ clause: '15.1', text: 'If a School or its Users misuse Bidii or breach these Terms, and this causes Bidii to face legal claims, damages, or costs, the School agrees to indemnify Bidii for those costs where allowed by law.' }, { clause: '15.2', text: 'Bidii shall indemnify and hold the School harmless from third-party claims arising directly from Bidii\'s breach of its data protection obligations or from any claim that the Platform infringes a third party\'s intellectual property rights.' }] },
        { heading: '16. Confidentiality', sub: [{ clause: '16.1', text: 'Each party shall keep confidential all Confidential Information received from the other party and shall not disclose it to any third party, except where required by law or with the prior written consent of the disclosing party.' }, { clause: '16.2', text: 'This clause shall survive termination of these Terms for a period of three (3) years.' }] },
        { heading: '17. Force Majeure', body: 'Neither party shall be considered in breach of these Terms where performance is prevented or materially delayed by circumstances beyond its reasonable control, including natural disasters, major infrastructure failures, government action, war, civil unrest, widespread internet failures, or cyber incidents affecting critical infrastructure.' },
        { heading: '18. Governing Law and Dispute Resolution', sub: [{ clause: '18.1', text: 'These Terms shall be governed by and interpreted in accordance with the laws of the Republic of Kenya.' }, { clause: '18.2', text: 'The parties shall first attempt to resolve any dispute through good-faith negotiation.' }, { clause: '18.3', text: 'If a dispute cannot be resolved through negotiation within thirty (30) days, it shall be referred to arbitration in Nairobi, Kenya, in accordance with the Arbitration Act, 1995 of Kenya.' }] },
        { heading: '19. Contact', body: 'Trillionaire Designs Ltd. · Email: bidiisoftwares.1.ke@gmail.com · Phone: 0182319029 · Website: bidiischools.co.ke' },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Data Protection & Privacy Notice — Trillionaire Designs Ltd.',
      effectiveDate: 'Effective Date: 9 September 2026 · Governing Law: Republic of Kenya',
      intro: 'This Privacy Policy explains how Trillionaire Designs Ltd. ("Bidii") collects, uses, discloses, and protects Personal Data processed through the Bidii School Management System. This Policy reflects Bidii\'s obligations under the Data Protection Act, 2019 of Kenya (the "DPA"), the Data Protection (General) Regulations, 2021, and Bidii\'s internal Incident Response and Personal Data Breach Management Procedure.',
      sections: [
        { heading: '1. Definitions', items: ['"Personal Data" means any information relating to an identified or identifiable natural person, as defined under the DPA.', '"Data Controller" means the party that determines the purpose and means of processing Personal Data. In respect of Personal Data submitted to the Platform, the School is the Data Controller.', '"Data Processor" means the party that processes Personal Data on behalf of a Data Controller. Bidii acts as Data Processor for School data submitted to the Platform.', '"Personal Data Breach" means a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, Personal Data.', '"ODPC" means the Office of the Data Protection Commissioner of Kenya.', '"Sub-processor" means a third party engaged by Bidii to support the Platform which processes Personal Data on Bidii\'s instructions.'] },
        { heading: '2. Scope and Roles', sub: [{ clause: '2.1', text: 'This Policy applies to Personal Data processed through all Platform modules including Student Management, Staff Management, Academic Management, Attendance, Assessments, Discipline Records, Library Management, School Communication, and Reports and Analytics.' }, { clause: '2.2', text: 'The School is the Data Controller in respect of Personal Data it submits to the Platform. Bidii acts as a Data Processor, processing such Personal Data solely on the School\'s documented instructions and for the purpose of providing the Platform.' }, { clause: '2.3', text: 'Bidii processes Personal Data only for the purpose of providing the Platform, and does not sell Personal Data or use it for purposes unrelated to providing the Platform.' }] },
        { heading: '3. Personal Data We Process', body: 'Depending on the modules a School subscribes to, the Platform may process:', items: ['Identity and contact details — name, date of birth, admission or staff number, address, phone number, email address, photograph.', 'Academic records — grades, assessment results, attendance, timetables, discipline and achievement records.', 'Family and guardianship information — parent/guardian names, contact details, relationship to student.', 'Staff records — employment details, role and permissions, contact information.', 'Communications — messages sent and received through the Platform\'s School Communication features.', 'Technical and usage data — login activity, device and access information, generated for security and audit purposes.'] },
        { heading: '4. Children\'s Data', sub: [{ clause: '4.1', text: 'Because Schools process information relating to minors, the School confirms it has obtained all permissions and legal authority necessary to process student information before submitting it to the Platform.' }, { clause: '4.2', text: 'Bidii applies heightened care to student Personal Data and shall not use it for any purpose other than providing the Platform — including marketing or advertising — without the School\'s prior written consent.' }] },
        { heading: '5. How We Use Personal Data', body: 'Personal Data submitted to the Platform is used only to:', items: ['Provide, operate, and maintain the school-management features the School has subscribed to.', 'Generate AI-assisted outputs (timetables, summaries, analytics) for the School\'s review and approval.', 'Maintain the security, integrity, and availability of the Platform.', 'Perform routine backups and, where necessary, restore data.', 'Comply with legal obligations and meet notification duties described in this Policy.', 'Communicate with the School Administrator about the Subscription and the Platform.'] },
        { heading: '6. Sub-processors and Disclosure', sub: [{ clause: '6.1', text: 'Bidii may engage third-party Sub-processors (such as cloud hosting providers) to support the Platform, provided such Sub-processors are bound by data protection obligations no less protective than those in this Policy. Bidii remains responsible for its Sub-processors\' compliance.' }, { clause: '6.2', text: 'Where a Sub-processor is located outside Kenya, Bidii shall ensure that any transfer of Personal Data complies with the cross-border transfer requirements of the DPA.' }, { clause: '6.3', text: 'Bidii does not disclose Personal Data to third parties for their own marketing purposes, and will only disclose Personal Data beyond its Sub-processors where required by law, requested by a competent authority, or authorised in writing by the School.' }] },
        { heading: '7. Data Security', body: 'Bidii implements reasonable technical and organisational measures to protect Personal Data against unauthorised access, loss, misuse, alteration, or disclosure, including encryption in transit, access controls based on user role, routine backups, and regular security reviews.' },
        { heading: '8. Personal Data Breach Notification', sub: [{ clause: '8.1', text: 'Notification to the School — In the event of a Personal Data Breach, Bidii shall notify the affected School without undue delay, and in any event within seventy-two (72) hours of becoming aware of the breach.' }, { clause: '8.2', text: 'Notification to the ODPC — Where a breach is likely to result in risk to the rights and freedoms of a Data Subject, Bidii shall notify the ODPC within seventy-two (72) hours of becoming aware of the breach.' }, { clause: '8.3', text: 'Notification to Data Subjects — Where a breach is likely to result in high risk to Data Subjects, Bidii shall, in consultation with the affected School, support the School in notifying the affected Data Subjects without undue delay.' }, { clause: '8.4', text: 'Sub-processor Incidents — Where an incident originates with a third-party Sub-processor, the Sub-processor is contractually required to notify Bidii without undue delay, and Bidii responds as though it had occurred within its own systems.' }] },
        { heading: '9. Data Retention and Deletion', sub: [{ clause: '9.1', text: 'Bidii retains Personal Data for as long as the School\'s Subscription is active and Personal Data is necessary to provide the Platform.' }, { clause: '9.2', text: 'Upon the School\'s written request made within thirty (30) days of termination, Bidii shall provide the School with an export of its data in a commonly used, machine-readable format at no additional cost.' }, { clause: '9.3', text: 'Bidii shall securely delete or anonymise the School\'s data within ninety (90) days following the data export, save where retention is required by applicable law.' }, { clause: '9.4', text: 'Records relating to a Personal Data Breach are retained for a minimum of five (5) years, or longer where required by applicable law.' }] },
        { heading: '10. Data Subject Rights', body: 'Subject to the DPA, Data Subjects (including Students, Parents/Guardians, and Staff) may exercise the following rights:', items: ['The right to be informed of the use to which their Personal Data is to be put.', 'The right to access their Personal Data in the custody of the School or Bidii.', 'The right to object to the processing of all or part of their Personal Data.', 'The right to correction of false or misleading data.', 'The right to deletion of false or misleading data about them.', 'The right to data portability, where applicable.', 'The right to lodge a complaint with the ODPC (www.odpc.go.ke).'] },
        { heading: '11. Changes to This Policy', body: 'We may update this Policy from time to time. For material changes, we shall provide at least thirty (30) days\' notice via email or in-app notification before the changes take effect. Continued use of the Platform after updates take effect constitutes acceptance of the revised Policy.' },
        { heading: '12. Contact', body: 'Trillionaire Designs Ltd. · Data Protection Contact: bidiisoftwares.1.ke@gmail.com · Phone: 0182319029 · Website: bidiischools.co.ke · Office of the Data Protection Commissioner (Kenya): www.odpc.go.ke' },
      ],
    },
    conditions: {
      title: 'Conditions & Acceptable Use',
      subtitle: 'Rules Governing Use of the Bidii Platform — Trillionaire Designs Ltd.',
      effectiveDate: 'Effective Date: 7 September 2026 · Governing Law: Republic of Kenya',
      intro: 'This Conditions & Acceptable Use Policy sets out the roles, permissions, and conduct rules that apply to everyone who accesses the Bidii School Management System, operated by Trillionaire Designs Ltd. It applies to every Principal, Teacher, Parent, Student, Administrative Staff member, and any other authorised User. This Policy forms part of, and should be read together with, the Bidii Terms of Service and the Bidii Privacy Policy.',
      sections: [
        { heading: '1. Who This Policy Applies To', body: 'This Policy applies to every "User" — any authorised Principal, Teacher, Parent, Student, or Staff member accessing the Platform — and to the School Administrator responsible for managing User accounts on behalf of a subscribing School.' },
        { heading: '2. Roles and Permissions', sub: [{ clause: '2.1', text: 'Access to the Platform is granted according to user roles including Principal, Teacher, Parent, and Administrative Staff.' }, { clause: '2.2', text: 'Users may only access information authorised for their role. Attempting to access restricted information — including another User\'s account, another student\'s records, or administrative functions outside a User\'s assigned role — is prohibited.' }] },
        { heading: '3. Account and Credential Responsibilities', body: 'The School Administrator is responsible for creating and managing user accounts, assigning appropriate permissions, ensuring login credentials remain confidential, and immediately disabling access for Users who leave the institution. Every User is responsible for maintaining the confidentiality of their own password, not sharing credentials with any unauthorised person, and promptly reporting any suspected unauthorised access to their account.' },
        { heading: '4. Acceptable Use', body: 'Users must use Bidii responsibly and lawfully. Users must not:', items: ['Attempt to gain unauthorised access to the Platform or another user\'s account.', 'Share login credentials with unauthorised persons.', 'Upload or distribute viruses, malware, ransomware, or any other malicious software.', 'Attempt to hack, damage, disable, overload, or interfere with the normal operation or security of the Platform.', 'Reverse engineer, copy, or modify the Platform without written permission.', 'Use the Platform for fraudulent, illegal, or harmful activities.', 'Upload content that infringes the rights of others or contains harmful code.'] },
        { heading: '5. Content and Communication Standards', body: 'Content uploaded to, or communicated through, the Platform must not be unlawful, defamatory, harassing, or discriminatory; must not infringe the intellectual property or privacy rights of any person; and must be appropriate to a school environment involving minors.' },
        { heading: '6. Responsible Use of AI Features', body: 'AI-generated outputs, including timetables, summaries, analytics, and recommendations, are provided to assist Schools and Users. Users must review AI-generated outputs before relying on them, and the School remains responsible for reviewing and approving all AI-generated decisions before implementation.' },
        { heading: '7. Monitoring', body: 'Bidii may monitor use of the Platform to the extent reasonably necessary to maintain security, investigate suspected violations of this Policy, and meet legal obligations, consistent with the Bidii Privacy Policy.' },
        { heading: '8. Reporting Violations and Security Concerns', body: 'Any User who becomes aware of a suspected violation of this Policy, or a suspected security incident (including suspected unauthorised access or a suspected Personal Data Breach), must report it immediately to their School Administrator or to Bidii. Users must not attempt to independently investigate, conceal, or resolve a suspected security incident, and should preserve rather than delete potentially relevant information pending guidance.' },
        { heading: '9. Consequences of Violation', sub: [{ clause: '9.1', text: 'Bidii may suspend or terminate a User\'s or a School\'s access where this Policy is violated, where the Platform is used unlawfully, or where continued access threatens the security or stability of the Platform.' }, { clause: '9.2', text: 'Except in circumstances involving serious security, legal, or safety concerns, Bidii shall provide reasonable notice and an opportunity to remedy a violation before suspending or terminating access.' }, { clause: '9.3', text: 'A School may be held liable for damages, recovery costs, or legal claims resulting from a violation of this Policy by its Users, to the extent permitted by law.' }] },
        { heading: '10. Changes to This Policy', body: 'We may update this Policy from time to time. For material changes, we shall provide at least thirty (30) days\' notice via email or in-app notification before the changes take effect. Continued use of the Platform after updates take effect constitutes acceptance of the revised Policy.' },
        { heading: '11. Contact', body: 'Trillionaire Designs Ltd. · Email: bidiisoftwares.1.ke@gmail.com · Phone: 0182319029 · Website: bidiischools.co.ke' },
      ],
    },
  } as Record<string, LegalDoc>)[kind];

  return (
    <div className="modal-backdrop" role="presentation" onClick={close}>
      <div className="modal modal-legal" role="dialog" aria-modal="true" aria-labelledby="legal-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Close legal content" data-testid="button-close-legal"><X size={17} /></button>
        <div className="eyebrow">{content.subtitle}</div>
        <div className="legal-date mono" style={{ fontSize: '.75rem', color: '#68707c', margin: '4px 0 18px' }}>{content.effectiveDate}</div>
        <h2 id="legal-title">{content.title}</h2>
        <p className="legal-intro">{content.intro}</p>
        {content.sections.map((section) => (
          <div key={section.heading} style={{ marginTop: 24 }}>
            <h3 style={{ fontFamily: 'var(--app-font-serif)', margin: '0 0 8px', fontSize: '1.1rem' }}>{section.heading}</h3>
            {section.body && <p style={{ marginTop: 0 }}>{section.body}</p>}
            {section.items && (
              <ul style={{ paddingLeft: '1.3em', margin: '6px 0 0' }}>
                {section.items.map((item) => <li key={item} style={{ marginBottom: 5, fontSize: '.88rem', lineHeight: 1.5 }}>{item}</li>)}
              </ul>
            )}
            {section.sub && section.sub.map(({ clause, text }) => (
              <p key={clause} style={{ margin: '6px 0 0', fontSize: '.88rem', lineHeight: 1.55 }}><strong>{clause}</strong>&nbsp;&nbsp;{text}</p>
            ))}
          </div>
        ))}
        <button className="button-primary" onClick={close} style={{ marginTop: 28 }} data-testid="button-close-legal-bottom">Close</button>
      </div>
    </div>
  );
}’s permissions.'],
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
    window.location.href = 'mailto:bidiisoftwares.1.ke@gmail.com?subject=Book%20a%20Bidii%20demo';
  };
  return (
    <div className="modal-backdrop" role="presentation" onClick={close}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="demo-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Close demo form" data-testid="button-close-demo"><X size={17} /></button>
        <div className="eyebrow">A calm first step</div>
        <h2 id="demo-title">Let’s look at your school together.</h2>
        <p>Tell us a little about your school. We’ll reply with a practical walkthrough, not a hard sell.</p>
        {sent ? (
          <div className="success-box" data-testid="status-demo-sent">Your email app should open now. If it doesn’t, write to bidiisoftwares.1.ke@gmail.com.</div>
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
    const second = Math.max(Math.min(enrollment - 300, 500), 0) * 150;
    const third = Math.max(enrollment - 800, 0) * 130;
    return first + second + third;
  }, [enrollment]);
  const cadencePrice = cadence === 'annual' ? termTotal * 3 * 0.9 : cadence === 'monthly' ? termTotal / 3 : termTotal;
  const cadenceLabel = cadence === 'monthly' ? 'per month' : cadence === 'termly' ? 'per term' : 'per year · 10% off';
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
              <div className="nav-brand-group">
                <Brand />
                <a className="nav-login nav-login-mobile" href="https://app.bidiischools.co.ke" target="_blank" rel="noopener noreferrer" aria-label="Log in"><LockKeyhole size={12} strokeWidth={2} />Log in</a>
              </div>
              <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
                <a href="#product" onClick={() => setMobileOpen(false)} data-testid="link-product">Product</a>
                <a href="#how" onClick={() => setMobileOpen(false)} data-testid="link-how-it-works">How it works</a>
                <a href="#pricing" onClick={() => setMobileOpen(false)} data-testid="link-pricing">Pricing</a>
                <a href="#security" onClick={() => setMobileOpen(false)} data-testid="link-security">Trust</a>
                <a className="nav-login nav-login-desktop" href="https://app.bidiischools.co.ke" target="_blank" rel="noopener noreferrer" data-testid="link-nav-login"><LockKeyhole size={14} strokeWidth={2} />Log in</a>
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
                  [Users, 'People', 'Students, staff & parents'], [GraduationCap, 'Academics', 'CBC, CBE & 8-4-4'], [ClipboardCheck, 'Attendance', 'Today and over time'], [CreditCard, 'Finance', 'Fees & collection'], [PanelTop, 'Boarding', 'Beds, movement & care'], [BookOpen, 'Diary', 'Assignments & submissions'], [Library, 'Library', 'Borrowing & demand'], [HeartHandshake, 'Development', 'Discipline & achievements'], [MessageSquare, 'Communication', 'The right message'],
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
                <div><div className="eyebrow">Graduated estimate</div><div className="price-number" data-testid="text-price-estimate">{formatKes(cadencePrice)}<small> {cadenceLabel}</small></div><p className="price-context">For {enrollment.toLocaleString('en-KE')} learners · full system included</p><div className="slider-row"><label htmlFor="enrollment"><span>How many learners?</span><strong>{enrollment.toLocaleString('en-KE')}</strong></label><input id="enrollment" type="range" min="20" max="1500" step="5" value={enrollment} onChange={(event) => setEnrollment(Number(event.target.value))} data-testid="input-enrollment" /></div><p className="muted" style={{ fontSize: '.78rem', marginTop: 16 }}>Every school gets the standard KES 180 rate on its first 300 learners. The volume discount applies automatically on additional learners — no cliffs, no penalty for growing.</p></div>
                <div className="price-list"><div><span>Standard · learners 1–300</span><b>KES 180 / learner / term</b></div><div><span>Volume · learners 301–800</span><b>KES 150 / learner / term</b></div><div><span>Volume · learners 800+</span><b>KES 130 / learner / term</b></div><div><span>One-time onboarding · up to 300</span><b>KES 5,000</b></div><div><span>One-time onboarding · 301–800</span><b>KES 7,500</b></div><div><span>One-time onboarding · 801+</span><b>KES 9,000</b></div><div><span>Extra messaging beyond included 3 SMS</span><b>From KES 1,000 / 1,000 messages</b></div><p className="muted" style={{ fontSize: '.72rem', lineHeight: 1.45, margin: '3px 0 0' }}>Every plan includes the full system: Library, Soma AI, Boarding & Accommodation, and 3 SMS per student per term. School groups of 3+ campuses receive an automatic 10% discount across every campus.</p><button className="button-primary" style={{ marginTop: 15 }} onClick={() => setModal('demo')} data-testid="button-pricing-quote">Get a school quote <ArrowRight size={16} /></button></div>
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
              <div><h4>Good to know</h4><button onClick={() => setModal('terms')} data-testid="button-footer-terms">Terms of service</button><button onClick={() => setModal('privacy')} data-testid="button-footer-privacy">Privacy policy</button><button onClick={() => setModal('conditions')} data-testid="button-footer-conditions">Conditions & acceptable use</button><a href="mailto:bidiisoftwares.1.ke@gmail.com" data-testid="link-footer-email"><Mail size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />bidiisoftwares.1.ke@gmail.com</a><a href="tel:0182319029" data-testid="link-footer-phone"><Phone size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />0182319029</a></div>
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