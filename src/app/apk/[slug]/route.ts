import { projects } from "@/lib/data";

/*
  Short, stable download link for a project's Android build: /apk/kalinga.
  The QR code points here instead of at the file host, so the code stays
  simple to scan and keeps working if the APK moves (Drive → GitHub → Play).
*/

export function generateStaticParams() {
  return projects.filter((p) => p.android).map((p) => ({ slug: p.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const android = projects.find((p) => p.slug === slug)?.android;
  if (!android) return new Response("Not found", { status: 404 });
  return Response.redirect(android.playStoreUrl ?? android.apkUrl, 307);
}
