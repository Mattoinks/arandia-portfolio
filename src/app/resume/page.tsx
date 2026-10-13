import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, Mail, MapPin } from "lucide-react";
import { ProjectHeader } from "@/components/project/project-header";
import { PrintButton } from "@/components/resume/print-button";
import { certifications, education, experience, profile, projects, skillGroups, socials } from "@/lib/data";

export const metadata: Metadata = {
  title: "Resume",
  description: `${profile.name} — ${profile.role}. Experience, projects, education, certifications and skills.`,
  alternates: { canonical: "/resume" },
};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground print:mb-2 print:text-black">
      {children}
      <span className="h-px flex-1 bg-border print:bg-neutral-300" aria-hidden />
    </h2>
  );
}

export default function ResumePage() {
  const links = socials.filter((s) => s.icon === "github" || s.icon === "linkedin");

  return (
    <>
      <ProjectHeader backHref="/" backLabel="Portfolio" />
      <main id="main-content" className="flex-1">
        <article className="mx-auto max-w-4xl px-6 pb-20 pt-28 sm:px-10 sm:pt-32 print:max-w-none print:p-0 print:text-black">
          {/* Header */}
          <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between print:border-neutral-300 print:pb-4">
            <div>
              <h1 className="font-heading text-4xl font-medium tracking-[-0.045em] sm:text-5xl print:text-3xl">{profile.name}</h1>
              <p className="mt-2 font-serif text-xl italic text-primary print:text-base print:text-neutral-700">{profile.role}</p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground print:text-xs print:text-neutral-700">
                <li className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden /> {profile.location} · Remote-friendly
                </li>
                <li>
                  <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    <Mail className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden /> {profile.email}
                  </a>
                </li>
                {links.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-foreground">
                      {s.href.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex shrink-0 gap-2 print:hidden">
              <PrintButton />
              <a
                href={profile.resumeUrl}
                download
                className="press inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-[0.8125rem] font-medium text-background"
              >
                <ArrowDownToLine className="h-4 w-4" strokeWidth={1.75} /> PDF
              </a>
            </div>
          </header>

          <div className="mt-10 space-y-12 print:mt-5 print:space-y-5">
            <section>
              <Heading>Summary</Heading>
              <p className="max-w-3xl text-pretty text-lg leading-relaxed text-foreground/90 print:text-sm">
                {profile.bio} {profile.greeting}.
              </p>
            </section>

            <section>
              <Heading>Experience</Heading>
              <div className="space-y-7 print:space-y-3">
                {experience.map((e) => (
                  <div key={e.org} className="grid gap-1 sm:grid-cols-4 sm:gap-6 print:break-inside-avoid">
                    <p className="font-mono text-xs text-muted-foreground print:text-[10px]">
                      {e.period}
                      <span className="block">{e.type}</span>
                    </p>
                    <div className="sm:col-span-3">
                      <h3 className="font-medium print:text-sm">
                        {e.role} · <span className="text-muted-foreground print:text-neutral-700">{e.org}</span>
                      </h3>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem] text-muted-foreground marker:text-primary print:text-xs print:text-neutral-800">
                        {e.points.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <Heading>Projects</Heading>
              <div className="grid gap-4 sm:grid-cols-2 print:gap-2">
                {projects.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/work/${p.slug}`}
                    className="group rounded-2xl border border-border p-5 transition-colors hover:border-foreground/25 print:break-inside-avoid print:rounded-none print:border-0 print:p-0"
                  >
                    <p className="flex items-center justify-between gap-3 font-medium print:text-sm">
                      {p.name}
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-px group-hover:translate-x-px print:hidden" strokeWidth={1.75} />
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground print:text-xs print:text-neutral-700">
                      {p.tagline} · {p.role}
                    </p>
                    {p.metrics?.[0] && (
                      <p className="mt-2 text-sm text-primary print:text-xs">
                        {p.metrics[0].value} — {p.metrics[0].label.toLowerCase()}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <Heading>Education</Heading>
              {education.map((e) => (
                <div key={e.institution} className="grid gap-1 sm:grid-cols-4 sm:gap-6">
                  <p className="font-mono text-xs text-muted-foreground print:text-[10px]">{e.period}</p>
                  <div className="sm:col-span-3">
                    <h3 className="font-medium print:text-sm">{e.institution}</h3>
                    <p className="text-[0.9375rem] text-muted-foreground print:text-xs print:text-neutral-800">{e.degree}</p>
                    {e.highlights && <p className="mt-1 text-sm text-primary print:text-xs">{e.highlights.join(" · ")}</p>}
                  </div>
                </div>
              ))}
            </section>

            <section>
              <Heading>Certifications</Heading>
              <ul className="space-y-2">
                {certifications.map((c) => (
                  <li key={c.name} className="flex flex-wrap items-baseline justify-between gap-2 text-[0.9375rem] print:text-xs">
                    <span>
                      <span className="font-medium">{c.name}</span> <span className="text-muted-foreground print:text-neutral-700">— {c.issuer}</span>
                    </span>
                    <span className="font-mono text-xs text-muted-foreground tabular">
                      {c.score}/{c.maxScore} · valid to {c.validThru}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <Heading>Skills</Heading>
              <dl className="space-y-2.5">
                {skillGroups.map((g) => (
                  <div key={g.id} className="grid gap-1 sm:grid-cols-4 sm:gap-6">
                    <dt className="text-sm text-muted-foreground print:text-xs">{g.label}</dt>
                    <dd className="text-[0.9375rem] sm:col-span-3 print:text-xs">{g.items.map((i) => i.name).join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </article>
      </main>
    </>
  );
}
