export const profile = {
  name: "Matthew Caramillo Arandia",
  role: "Full-Stack Developer & IT Professional",
  headline: "Engineering Scalable Systems & Immersive Digital Experiences",
  location: "Dasmariñas, Cavite, Philippines",
  /** Full availability sentence — used for screen readers and the social preview image. */
  greeting: "Open to internships, freelance, full-time roles & collaborations",
  /** Short statuses the hero badge cycles through. */
  availability: [
    "Open to internships",
    "Available for freelance",
    "Open to full-time roles",
    "Open to collaborations",
  ],
  email: "mattarandia.07@gmail.com",
  avatar: "/assets/avatar/1X1-arandia.jpg",
  avatarCutout: "/assets/avatar/avatar-no-bg.png",
  resumeUrl: "/assets/resume/RESUME_ARANDIA.pdf",
  taglines: [
    "I build systems that scale.",
    "I design APIs that don't break.",
    "I ship products end-to-end.",
    "I turn architecture into velocity.",
  ],
  bio: "I design and build full-stack products — mobile, web, and everything behind them — with a focus on clean architecture and interfaces that feel effortless.",
  /** Phrases in `bio` set in italic accent where the bio is shown large. */
  bioEmphasis: ["clean architecture", "effortless"],
  stats: [
    { label: "Projects", value: "4" },
    { label: "Certificates", value: "2" },
    { label: "BSIT Graduated", value: "2027" },
  ],
  currently: [
    { icon: "code", label: "Building", detail: "Web & mobile products" },
    { icon: "flask", label: "Exploring", detail: "System design & testing" },
    { icon: "rocket", label: "Learning", detail: "Full-stack engineering" },
  ],
  traits: ["Problem Solver", "Fast Learner", "Detail-Oriented", "Team Player"],
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
      "Focused on software testing, web development, and digital systems — with hands-on experience building database-driven systems and RFID/QR-based solutions.",
    highlights: ["Dean's List", "Best Capstone Paper and System"],
  },
];

export const socials = [
  { label: "GitHub", href: "https://github.com/Mattoinks", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mattoinks", icon: "linkedin" },
  { label: "X / Twitter", href: "https://x.com/", icon: "twitter" },
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
    codeUrl: "https://github.com/Mattoinks/Masterfile-Automation-System.git",
    thumbnail: "/assets/images/projects/INFINEON.png",
    status: "in-progress",
    architecture: {
      database: "Details coming soon — data structure pending write-up.",
      workflow: "Details coming soon — automation workflow pending write-up.",
      logic: "Details coming soon — core logic pending write-up.",
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
    thumbnail: "/assets/images/projects/KALINGA.png",
    gallery: [
      {
        src: "/assets/images/projects/KALINGAMOB.png",
        alt: "KALINGA on mobile — guardian account consent flow",
        kind: "mobile",
      },
    ],
    status: "completed",
    architecture: {
      database: "Details coming soon — ER structure and schema pending write-up.",
      workflow: "Details coming soon — patient/session data flow pending write-up.",
      logic: "Details coming soon — core business logic pending write-up.",
    },
  },
  {
    slug: "sahari-pay",
    name: "SAHARI PAY",
    tagline: "Mobile & web platform",
    role: "Full-Stack Developer · Solo Client Project",
    description: "Full description coming soon.",
    tags: ["Mobile", "Web"],
    codeUrl: "https://github.com/Mattoinks/sahari-pay.git",
    status: "in-progress",
    architecture: {
      database: "Details coming soon — schema and data model pending write-up.",
      workflow: "Details coming soon — transaction and payment flow pending write-up.",
      logic: "Details coming soon — core business logic pending write-up.",
    },
  },
  {
    slug: "signa2z",
    name: "SIGNA2Z",
    tagline: "Real-time ASL alphabet translation",
    role: "Documentation, Quality Assurance & Testing",
    description:
      "SignA2Z is a computer vision-powered application designed to break communication barriers between Deaf and hearing individuals by providing real-time American Sign Language (ASL) alphabet translation into text. The system features both Android mobile and web dashboards integrated with a secure Google API login, translation history retrieval, and basic ASL learning modules with text and video tutorials. Scheduled for prototype completion by December 2025, the project targets at least 90% recognition accuracy and sub-second processing speeds while keeping its scope strictly focused on the alphabet and simple phrases without requiring specialized hardware or commercial app store deployment.",
    tags: ["Mobile", "Web", "Computer Vision"],
    codeUrl: "https://github.com/KManipis/SignA2ZRepository.git",
    thumbnail: "/assets/images/projects/SIGNA2Z.png",
    status: "completed",
    architecture: {
      database: "Details coming soon — schema for accounts, translation history, and learning modules pending write-up.",
      workflow: "Details coming soon — real-time ASL recognition and translation pipeline pending write-up.",
      logic: "Details coming soon — recognition accuracy and processing logic pending write-up.",
    },
  },
];
