export const profile = {
  name: "Matthew Caramillo Arandia",
  role: "Full-Stack Developer & IT Professional",
  headline: "Engineering Scalable Systems & Immersive Digital Experiences",
  location: "Remote / Philippines",
  greeting: "Available for select engagements",
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
  stats: [
    { label: "Projects", value: "3" },
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
  description?: string;
  highlights?: string[];
}

export const education: EducationEntry[] = [
  {
    institution: "National University Dasmariñas",
    degree: "Bachelor of Science in Information Technology, Major in Mobile and Web Applications",
    period: "2023 — 2027",
    description:
      "Focused on software testing, web development, and digital systems — with hands-on experience building database-driven systems and RFID/QR-based solutions.",
    highlights: ["Dean's List", "Best Capstone Paper and System"],
  },
];

export const techStack = [
  "TypeScript",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Redis",
  "Docker",
  "AWS",
  "GraphQL",
  "Python",
  "Kubernetes",
];

export const socials = [
  { label: "GitHub", href: "https://github.com/Mattoinks", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/", icon: "linkedin" },
  { label: "X / Twitter", href: "https://x.com/", icon: "twitter" },
  { label: "Email", href: "mailto:mattarandia.07@gmail.com", icon: "mail" },
] as const;

export type SkillGroupId = "frontend" | "backend" | "devops";

export interface SkillItem {
  name: string;
  icon: string;
}

export const skillGroups: { id: SkillGroupId; label: string; items: SkillItem[] }[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      { name: "Next.js", icon: "nextjs" },
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
    ],
  },
  {
    id: "devops",
    label: "DevOps & Tools",
    items: [
      { name: "Git", icon: "git" },
      { name: "Vercel", icon: "vercel" },
      { name: "Wireshark", icon: "wireshark" },
      { name: "Active Directory", icon: "activedirectory" },
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

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  codeUrl?: string;
  thumbnail?: string;
  status: "production" | "in-progress" | "archived";
  architecture?: ProjectArchitecture;
}

export const projects: Project[] = [
  {
    slug: "kalinga",
    name: "KALINGA",
    tagline: "Clinical & rehabilitation management system",
    description:
      "A clinical and rehabilitation management system for tracking patients, sessions, and care workflows across a mobile and web platform.",
    tags: ["Mobile", "Web"],
    codeUrl: "https://github.com/dwightangelodecena-cloud/-BridgesOfHope---Backup.git",
    thumbnail: "/assets/images/projects/KALINGA.png",
    status: "in-progress",
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
    slug: "infineon",
    name: "Infineon",
    tagline: "Website",
    description: "Full description coming soon.",
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
];
