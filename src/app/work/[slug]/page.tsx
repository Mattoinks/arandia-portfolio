import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectHeader } from "@/components/project/project-header";
import { ProjectDetail } from "@/components/project/project-detail";
import { Footer } from "@/components/footer";
import { projects } from "@/lib/data";

// Only the projects in data.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const description = project.description.length > 160 ? `${project.description.slice(0, 157)}…` : project.description;
  return {
    title: project.name,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.name} — ${project.tagline}`,
      description,
      url: `/work/${project.slug}`,
      images: project.thumbnail ? [{ url: project.thumbnail }] : undefined,
    },
  };
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const total = projects.length;
  const project = projects[index];
  const prev = projects[(index - 1 + total) % total];
  const next = projects[(index + 1) % total];

  return (
    <>
      <ProjectHeader />
      <main id="main-content" className="flex-1">
        <ProjectDetail project={project} index={index} total={total} prev={prev} next={next} />
      </main>
      <Footer />
    </>
  );
}
