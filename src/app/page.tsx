import { db } from "@/lib/db";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterLinks from "@/components/FooterLinks";

// Always render on request, never statically at build time
export const dynamic = "force-dynamic";

// ─── CUSTOMIZE YOUR INFO HERE ───────────────────────────────────────────────
const PORTFOLIO_CONFIG = {
  name: "Maksym Vereshchahin",
  // Your core tech skills shown in About section
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Tailwind CSS",
    "Prisma",
    "Docker",
  ],
};
// ────────────────────────────────────────────────────────────────────────────

async function getPageData() {
  const [projects, settings] = await Promise.all([
    db.project
      .findMany({ where: { visible: true }, orderBy: { order: "asc" } })
      .then((ps) => ps.map((p) => ({ ...p, skills: JSON.parse(p.skills) as string[] }))),
    db.siteSettings.findUnique({ where: { id: 1 } }),
  ]);
  return { projects, settings };
}

export default async function Home() {
  const { projects, settings } = await getPageData();

  const heroName = settings?.heroName || PORTFOLIO_CONFIG.name;
  const heroRole = settings?.heroRole || undefined;
  const heroSubtitle = settings?.heroSubtitle || undefined;
  const aboutBio = settings?.aboutBio || undefined;
  const aboutSkills = settings?.aboutSkills
    ? (JSON.parse(settings.aboutSkills) as string[])
    : PORTFOLIO_CONFIG.skills;
  const photoUrl = settings?.photoUrl ?? undefined;

  return (
    <div className="relative min-h-screen text-white">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10">
        <HeroSection
          name={heroName}
          role={heroRole}
          subtitle={heroSubtitle}
        />

        <div className="section-separator" />

        <AboutSection
          name={heroName}
          photoUrl={photoUrl}
          skills={aboutSkills}
          bio={aboutBio}
        />

        <div className="section-separator" />

        <ServicesSection />

        <div className="section-separator" />

        <ProcessSection />

        <div className="section-separator" />

        <ProjectsSection projects={projects} />

        <div className="section-separator" />

        <FAQSection />

        <div className="section-separator" />

        <ContactSection />

        <footer className="relative z-10 py-8 text-center text-gray-600 text-sm border-t border-white/5">
          <p>
            © {new Date().getFullYear()} {heroName}. All rights reserved.
          </p>
          <p className="mt-2">
            <FooterLinks />
          </p>
        </footer>
      </main>
    </div>
  );
}
