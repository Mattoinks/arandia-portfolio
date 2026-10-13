import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { WorkGallery } from "@/components/sections/work-gallery";
import { Experience } from "@/components/sections/experience";
import { Testimonials } from "@/components/sections/testimonials";
import { MarqueeBand } from "@/components/sections/marquee-band";
import { Certifications } from "@/components/sections/certifications";
import { Education } from "@/components/sections/education";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <Skills />
        <WorkGallery />
        <Experience />
        <MarqueeBand />
        <Certifications />
        <Education />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
