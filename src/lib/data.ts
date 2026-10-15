export const profile = {
  name: "Matthew Caramillo Arandia",
  role: "Full-Stack Developer",
  /** Hero line under the name; the accent part is set in italic. */
  headline: "I build web and mobile systems",
  headlineAccent: "for real clients.",
  location: "Dasmariñas, Cavite, Philippines",
  /** Full availability sentence — used for screen readers, the social preview image and Matte. */
  greeting: "Open to internships, part-time and freelance work now, and full-time roles from 2027 (remote OK)",
  /** Short version for the hero badge — one clear line, kept short enough for phones. */
  availability: "Part-time now · Full-time 2027",
  /** Work arrangement — shown by the assistant and in the hero badge. */
  workArrangement: "Open to remote work (based in the Philippines, GMT+8)",
  /**
   * Extra facts for the AI assistant (Matte). Add answers to questions you get
   * often — e.g. languages spoken, notice period, preferred stack.
   */
  assistantFaq: [
    { q: "Salary / rate expectations", a: "Open to discussion — best discussed directly with Matthew." },
    { q: "Languages spoken", a: "English and Filipino." },
    { q: "Start date", a: "Available now — can start immediately." },
    { q: "Schedule", a: "Part-time while finishing his BSIT (class of 2027); full-time after graduation." },
    { q: "Work arrangement", a: "Open to remote work; based in Dasmariñas, Cavite, Philippines (GMT+8)." },
    { q: "Preferred tech stack", a: "No strict preference — he adapts to the team's stack. Most experienced with React/Next.js, TypeScript, Python (FastAPI) and PostgreSQL/Supabase." },
    { q: "Graduation", a: "BSIT, Major in Mobile and Web Applications, National University Dasmariñas — expected 2027." },
  ],
  /** ISO date — age is computed from it, so it never goes stale. */
  birthDate: "2005-04-07",
  email: "mattarandia.07@gmail.com",
  avatar: "/assets/avatar/1X1-arandia.jpg",
  avatarCutout: "/assets/avatar/avatar-no-bg.png",
  resumeUrl: "/assets/resume/RESUME_ARANDIA.pdf",
  /** Typewriter proof lines under the hero headline — real results only. */
  taglines: [
    "Cut RMA processing from 8 to 3 min.",
    "Building SahariPay for PH landlords.",
    "Shipped KALINGA for Bridges of Hope.",
    "Web and mobile, database to screen.",
  ],
  bio: "I design and build full-stack products — mobile, web, and everything behind them — with a focus on clean architecture and interfaces that feel effortless.",
  /** Phrases in `bio` set in italic accent where the bio is shown large. */
  bioEmphasis: ["clean architecture", "effortless"],
  /** About strip. Values below 1000 count up; years stay put. */
  stats: [
    { label: "Faster RMA processing", value: "62%" },
    { label: "Client projects", value: "2" },
    { label: "BSIT Class of", value: "2027" },
  ],
  /** What he's working on right now — each row links to its case study when there is one. */
  currently: [
    {
      label: "Building",
      title: "SahariPay",
      detail: "Rental management & payments · Next.js + Expo",
      href: "/work/sahari-pay",
    },
    {
      label: "Freelancing",
      title: "RMA automation for Infineon",
      detail: "Delivery Note processing, 8 → 3 min",
      href: "/work/infineon",
    },
    {
      label: "Studying",
      title: "BSIT, Mobile & Web Applications",
      detail: "National University Dasmariñas · Dean's List",
    },
  ],
  /** How he works — each with a one-line proof from his projects. */
  traits: [
    { name: "Problem Solver", detail: "Turns manual, paper or spreadsheet workflows into systems." },
    { name: "Fast Learner", detail: "Picks up each project's stack — FastAPI, Expo, Supabase." },
    { name: "Detail-Oriented", detail: "Validation, edge cases and regression checks before shipping." },
    { name: "Team Player", detail: "Built KALINGA and SignA2Z with capstone teams." },
  ],
};

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  /** Institution crest, shown beside the entry. */
  logo?: string;
  description?: string;
  highlights?: string[];
}

export const education: EducationEntry[] = [
  {
    institution: "National University Dasmariñas",
    degree: "Bachelor of Science in Information Technology, Major in Mobile and Web Applications",
    period: "2023 — 2027",
    logo: "/assets/icons/NU.png",
    description:
      "Focused on web and mobile application development — with hands-on experience building full-stack, database-driven systems for real clients and organizations.",
    highlights: ["Dean's List"],
  },
];

export const socials = [
  { label: "GitHub", href: "https://github.com/Mattoinks", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mattoinks", icon: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/maaatttsuuu/", icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/maaatttsuuu", icon: "facebook" },
  { label: "Email", href: "mailto:mattarandia.07@gmail.com", icon: "mail" },
] as const;

export type SkillGroupId = "languages" | "frontend" | "backend" | "devops" | "tools";

export interface SkillItem {
  name: string;
  icon: string;
}

export const skillGroups: { id: SkillGroupId; label: string; items: SkillItem[] }[] = [
  {
    id: "languages",
    label: "Programming Languages",
    items: [
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Java", icon: "java" },
      { name: "Python", icon: "python" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend & Mobile",
    items: [
      { name: "Next.js", icon: "nextjs" },
      { name: "Flutter", icon: "flutter" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "HTML5", icon: "html5" },
      { name: "CSS3", icon: "css3" },
    ],
  },
  {
    id: "backend",
    label: "Backend & Databases",
    items: [
      { name: "SQL", icon: "database" },
      { name: "Normalization", icon: "normalize" },
      { name: "CRUD Operations", icon: "crud" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
      { name: "Oracle", icon: "oracle" },
      { name: "Supabase", icon: "supabase" },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Tools",
    items: [
      { name: "Git", icon: "git" },
      { name: "Vercel", icon: "vercel" },
      { name: "Netlify", icon: "netlify" },
    ],
  },
  {
    id: "tools",
    label: "Tools & Platforms",
    items: [
      { name: "GitHub", icon: "github" },
      { name: "Render", icon: "render" },
      { name: "Figma", icon: "figma" },
      { name: "Notion", icon: "notion" },
    ],
  },
];

export interface Certification {
  name: string;
  issuer: string;
  score: number;
  maxScore: number;
  validThru: string;
  credentialId: string;
  pdfUrl: string;
}

export const certifications: Certification[] = [
  {
    name: "HTML and CSS",
    issuer: "Information Technology Specialist · Certiport",
    score: 912,
    maxScore: 1000,
    validThru: "June 2031",
    credentialId: "90090006",
    pdfUrl: "/assets/images/certifications/HTML%26CSS.pdf",
  },
  {
    name: "Databases",
    issuer: "Information Technology Specialist · Certiport",
    score: 866,
    maxScore: 1000,
    validThru: "September 2030",
    credentialId: "90090006",
    pdfUrl: "/assets/images/certifications/DATABASES.pdf",
  },
];

export interface Capability {
  number: string;
  caption: string;
  icon: "code" | "smartphone";
  description: string;
  tags: string[];
}

export const capabilities: Capability[] = [
  {
    number: "01",
    caption: "Web & Systems Development",
    icon: "code",
    description:
      "Building and testing full-stack web systems — from database schema to deployed UI — with a focus on reliability and practical problem-solving.",
    tags: [
      "Web Development",
      "System Design",
      "Database Management",
      "API Development",
      "Next.js",
      "PostgreSQL",
      "Git",
    ],
  },
  {
    number: "02",
    caption: "Mobile App Development",
    icon: "smartphone",
    description:
      "Extending the same products to mobile — shared logic, consistent design language, and APIs that serve both web and app clients.",
    tags: [
      "Mobile UI",
      "Cross-Platform Apps",
      "API Integration",
      "Responsive Design",
      "State Management",
      "App Deployment",
    ],
  },
];

export interface ProjectArchitecture {
  database: string;
  workflow: string;
  logic: string;
}

export interface ProjectShot {
  src: string;
  alt: string;
  /** "mobile" shots render in a phone frame on the project page. */
  kind: "desktop" | "mobile";
}

export interface ProjectMetric {
  /** Big figure, e.g. "8 → 3 min". */
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  role: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  codeUrl?: string;
  thumbnail?: string;
  /** Extra screenshots for the project page, after the thumbnail. */
  gallery?: ProjectShot[];
  status: "production" | "completed" | "in-progress" | "archived";
  /** Measured outcomes, shown as stat tiles on the work row and case study. */
  metrics?: ProjectMetric[];
  architecture?: ProjectArchitecture;
}

export const projects: Project[] = [
  {
    slug: "infineon",
    name: "RMA Masterfile Automation and Management System",
    tagline: "Infineon",
    role: "Freelance Full-Stack Developer · Infineon Technologies, Singapore",
    description:
      "A centralized RMA Masterfile Automation System, developed as a freelance project for Infineon Technologies, Singapore, to streamline Delivery Note processing, automate PDF data extraction, and centralize RMA records and lot breakdowns into an organized Excel masterfile. Implements data validation, duplicate detection, and automated record management, along with role-based portals for internal staff and requesters. Built with React, FastAPI, and Supabase PostgreSQL for centralized data management, with Excel export retained for reporting and external use.",
    tags: ["Website"],
    thumbnail: "/assets/images/projects/infineon/cover.png",
    gallery: [
      {
        src: "/assets/images/projects/infineon/upload.png",
        alt: "RMA system — uploading Delivery Note PDFs for extraction and validation",
        kind: "desktop",
      },
    ],
    status: "in-progress",
    metrics: [
      { value: "8 → 3 min", label: "Processing time per Delivery Note" },
      { value: "62%", label: "Faster DN processing" },
    ],
    architecture: {
      database:
        "Supabase PostgreSQL is the single source of truth for RMA records and their lot breakdowns, replacing scattered spreadsheets. Excel export is kept for reporting and for teams outside the system.",
      workflow:
        "A Delivery Note PDF is uploaded → its data is extracted automatically → the system validates it and checks for duplicates → the RMA record and lot breakdown are saved → the organized masterfile can be exported to Excel. Internal staff and requesters each work in their own role-based portal.",
      logic:
        "React frontend with a FastAPI backend. Validation rules and duplicate detection catch bad or repeated entries before they reach the masterfile, and automated record management removes the manual copy-paste — cutting processing from about 8 minutes to about 3 minutes per Delivery Note.",
    },
  },
  {
    slug: "kalinga",
    name: "KALINGA",
    tagline: "Clinical & rehabilitation management system",
    role: "Full-Stack Developer · Capstone Project",
    description:
      "Kalinga is a role-based, responsive web application designed for Bridges of Hope Imus to streamline facility management and resident recovery tracking by replacing manual, paper-based procedures with a centralized PostgreSQL and ReactJS platform. Built with four dedicated workspaces for Guardians, Nurses, Program Staff, and Administrators, the system unifies admission and discharge request workflows, care documentation, recovery ladder progress monitoring, and visitation scheduling into a single secure ecosystem. By providing role-specific access control, real-time updates, and comprehensive operational dashboards, Kalinga improves administrative efficiency, record reliability, and communication among care providers and resident families.",
    tags: ["Mobile", "Web"],
    liveUrl: "https://bridgesofhope-delta.vercel.app/",
    codeUrl: "https://github.com/dwightangelodecena-cloud/-BridgesOfHope---Backup.git",
    thumbnail: "/assets/images/projects/kalinga/cover.png",
    gallery: [
      {
        src: "/assets/images/projects/kalinga/mobile-guardian-consent.png",
        alt: "KALINGA on mobile — guardian account consent flow",
        kind: "mobile",
      },
      {
        src: "/assets/images/projects/kalinga/mobile-services.png",
        alt: "KALINGA on mobile — care packages with admission and monthly fees",
        kind: "mobile",
      },
      {
        src: "/assets/images/projects/kalinga/mobile-temporary.png",
        alt: "KALINGA on mobile — guardian requesting a temporary discharge",
        kind: "mobile",
      },
    ],
    status: "completed",
    architecture: {
      database:
        "A centralized PostgreSQL database replaces paper records: residents at the center, linked to admission and discharge requests, care documentation, recovery-ladder progress and visitation schedules, with role-based accounts for Guardians, Nurses, Program Staff and Administrators.",
      workflow:
        "Guardians submit admission, discharge and visitation requests → staff review and act on them → Nurses and Program Staff record care notes and recovery-ladder progress → Administrators oversee everything from operational dashboards, with real-time updates keeping families and care providers in sync.",
      logic:
        "Four dedicated workspaces, each with role-specific access control, so every user sees only what their role needs. Built with ReactJS on PostgreSQL as a responsive app that works on desktop and mobile.",
    },
  },
  {
    slug: "sahari-pay",
    name: "SAHARI PAY",
    tagline: "Rental property management & payments",
    role: "Full-Stack Developer · Solo Client Project",
    description:
      "SahariPay is a cloud-based rental property management and payment platform built for Philippine landlords and tenants. A Next.js dashboard for property admins and a React Native (Expo) app for tenants share a single Supabase backend, digitizing the whole tenancy lifecycle — tenant onboarding and ID verification, leases with automatic move-in billing, recurring monthly rent invoices, payments via GCash, bank transfer or Palawan with admin verification, maintenance requests, tenant–landlord messaging, viewing and lease-signing appointments, and push notifications. It replaces the usual mix of spreadsheets, chat apps and cash handling, with database triggers, scheduled jobs and Row Level Security keeping billing automatic and every record access-controlled.",
    tags: ["Mobile", "Web"],
    codeUrl: "https://github.com/Mattoinks/sahari-pay.git",
    thumbnail: "/assets/images/projects/sahari-pay/cover.png",
    gallery: [
      {
        src: "/assets/images/projects/sahari-pay/mobile-home.png",
        alt: "SahariPay tenant app — home screen with amount due, lease details and quick actions",
        kind: "mobile",
      },
      {
        src: "/assets/images/projects/sahari-pay/mobile-payment.png",
        alt: "SahariPay tenant app — submitting a payment with method, transaction code and proof screenshot",
        kind: "mobile",
      },
      {
        src: "/assets/images/projects/sahari-pay/mobile-chat.png",
        alt: "SahariPay tenant app — message thread with the landlord",
        kind: "mobile",
      },
      {
        src: "/assets/images/projects/sahari-pay/mobile-maintenance.png",
        alt: "SahariPay tenant app — filing a maintenance request by category with an optional photo",
        kind: "mobile",
      },
    ],
    status: "in-progress",
    architecture: {
      database:
        "One Supabase PostgreSQL database — 20 tables and 10 enumerated types covering properties, units, leases, itemized invoices, payment submissions, deposit settlements, maintenance, messaging, appointments and notifications. Row Level Security is enabled on every table, driven by two helper functions (is_admin and is_approved), and changes to billing, leases and requests are recorded in a before/after audit log.",
      workflow:
        "A tenant signs up in the app and waits for admin approval (or is invited and approved up front) → creating a lease generates the move-in invoice for advance rent and deposit → a daily scheduled job bills rent on each lease's billing day and reminds tenants 3 days before it's due → the tenant pays by GCash, bank transfer or Palawan and uploads proof → the admin approves or rejects it from a live verification queue → the invoice's paid amount and status update automatically and the tenant gets a push notification.",
      logic:
        "Logic that must never be skipped lives in the database: triggers recalculate invoice totals and status, fan announcements out to tenants, write the audit log and send Expo push notifications, while pg_cron runs recurring billing. Row Level Security is the real authorization boundary, so an unapproved tenant can't submit a payment, message or request even if the app is bypassed. A shared package gives both apps the same TypeScript types and Zod validation, and Supabase Realtime keeps the dashboard and app in sync without polling.",
    },
  },
  {
    slug: "signa2z",
    name: "SIGNA2Z",
    tagline: "Real-time ASL alphabet translation",
    role: "Documentation, Quality Assurance & Testing",
    description:
      "SignA2Z is a computer vision-powered application built to break communication barriers between Deaf and hearing individuals by translating American Sign Language (ASL) alphabet signs into text in real time. It runs on both an Android app and a web dashboard, with secure Google sign-in, translation history, and beginner ASL learning modules with text and video tutorials. The project deliberately focused on the alphabet and simple phrases, running on everyday devices without specialized hardware.",
    tags: ["Mobile", "Web", "Computer Vision"],
    codeUrl: "https://github.com/KManipis/SignA2ZRepository.git",
    thumbnail: "/assets/images/projects/signa2z/cover.png",
    status: "completed",
    architecture: {
      database:
        "User accounts through secure Google sign-in, each with a saved translation history, plus content for the ASL learning modules (text and video tutorials).",
      workflow:
        "The camera captures a hand sign → a computer-vision model recognizes the ASL letter → the result appears as text in real time on the Android app or web dashboard → translations are saved to the user's history.",
      logic:
        "Scope was deliberately kept to the ASL alphabet and simple phrases so it runs on everyday devices without specialized hardware. Matthew's role covered documentation, quality assurance and testing of the recognition and app flows.",
    },
  },
];

export interface ExperienceEntry {
  role: string;
  org: string;
  /** e.g. "Freelance · Remote" */
  type: string;
  /** "Ongoing" or a completed label — no invented dates. */
  period: string;
  summary: string;
  points: string[];
  /** Links to the case study. */
  project?: string;
}

export const experience: ExperienceEntry[] = [
  {
    role: "Freelance Full-Stack Developer",
    org: "Infineon Technologies · Singapore",
    type: "Freelance · Remote",
    period: "Ongoing",
    summary: "Building an RMA masterfile automation system that replaces manual Delivery Note processing.",
    points: [
      "Cut processing from ~8 to ~3 minutes per Delivery Note",
      "Automated PDF data extraction, validation and duplicate detection",
      "React + FastAPI + Supabase PostgreSQL, with role-based portals",
    ],
    project: "infineon",
  },
  {
    role: "Full-Stack Developer",
    org: "SAHARI PAY",
    type: "Client project · Solo",
    period: "Ongoing",
    summary: "Building a rental property management and payment platform for Philippine landlords and tenants, end-to-end.",
    points: [
      "Sole developer across the Next.js admin dashboard, Expo tenant app and Supabase backend",
      "Automated billing: move-in invoices, daily recurring rent and due-date reminders",
      "Payment verification, maintenance, messaging and push notifications, secured with Row Level Security",
    ],
    project: "sahari-pay",
  },
  {
    role: "Full-Stack Developer",
    org: "KALINGA · Bridges of Hope Imus",
    type: "Capstone · National University Dasmariñas",
    period: "Completed",
    summary: "Clinical and rehabilitation management system replacing paper-based procedures.",
    points: [
      "Four role-based workspaces for Guardians, Nurses, Program Staff and Admins",
      "Admissions, care documentation, recovery tracking and visitation in one system",
    ],
    project: "kalinga",
  },
  {
    role: "Documentation, QA & Testing",
    org: "SIGNA2Z",
    type: "Team project",
    period: "Completed",
    summary: "Real-time ASL alphabet translation app for Android and web.",
    points: ["Owned documentation, quality assurance and testing of the recognition and app flows"],
    project: "signa2z",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  /** e.g. "Professor, National University" or "Client, Infineon" */
  title: string;
}

/** Real quotes only — the section stays hidden until at least one is added. */
export const testimonials: Testimonial[] = [];
