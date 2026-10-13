import { ImageResponse } from "next/og";
import { profile, projects } from "@/lib/data";

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/** Per-project share card: project name, tagline, top metric, brand. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug) ?? projects[0];
  const metric = project.metrics?.[0];
  const status = project.status === "in-progress" ? "In progress" : project.status === "completed" ? "Completed" : "Live";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(70% 90% at 90% 0%, rgba(242,107,58,0.28), #0c0c0b 70%)",
          color: "#f2f1ec",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 5, textTransform: "uppercase" }}>
            Arandia<span style={{ color: "#f26b3a" }}>.</span>dev
            <span style={{ color: "#9c9b93", marginLeft: 18 }}>/ Case study</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#9c9b93",
            }}
          >
            {status}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 34, fontStyle: "italic", color: "#f26b3a" }}>{project.tagline}</div>
          <div
            style={{
              display: "flex",
              marginTop: 10,
              fontSize: project.name.length > 30 ? 62 : 92,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -3,
              maxWidth: 1000,
            }}
          >
            {project.name}
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 24, color: "#9c9b93" }}>{project.role}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {metric ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#f26b3a", letterSpacing: -2 }}>{metric.value}</div>
              <div style={{ display: "flex", fontSize: 22, color: "#9c9b93" }}>{metric.label}</div>
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: 24, color: "#9c9b93" }}>{project.tags.join(" · ")}</div>
          )}
          <div style={{ display: "flex", fontSize: 24, color: "#f2f1ec" }}>{profile.name}</div>
        </div>
      </div>
    ),
    size,
  );
}
