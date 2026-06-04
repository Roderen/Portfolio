/**
 * JSON-LD Structured Data for SEO
 * Helps search engines understand the content and structure of the website
 */

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "corweb",
    url: "https://corweb.dev",
    logo: "https://corweb.dev/logo.png",
    sameAs: [
      // Add social media links if available
      // "https://github.com/yourusername",
      // "https://linkedin.com/in/yourusername",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "contact@corweb.dev",
    },
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Maksym Vereshchahin",
    url: "https://corweb.dev",
    jobTitle: "Full-Stack Web Developer",
    worksFor: {
      "@type": "Organization",
      name: "corweb",
    },
    knowsAbout: [
      "Web Development",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Full-Stack Development",
    ],
    sameAs: [
      // Add social media/portfolio links
      // "https://github.com/yourusername",
      // "https://linkedin.com/in/yourusername",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "corweb | Maksym Vereshchahin",
    url: "https://corweb.dev",
    description: "Full-Stack Web Developer portfolio. Modern websites for businesses.",
    inLanguage: ["en", "ru", "uk", "de"],
    author: {
      "@type": "Person",
      name: "Maksym Vereshchahin",
    },
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "corweb - Web Development Services",
    image: "https://corweb.dev/logo.png",
    "@id": "https://corweb.dev",
    url: "https://corweb.dev",
    telephone: "", // Add if available
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "UA", // Ukraine
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 50.4501, // Kyiv coordinates (example)
      longitude: 30.5234,
    },
    areaServed: ["UA", "US", "EU"],
    serviceType: [
      "Web Development",
      "Landing Page Development",
      "E-commerce Development",
      "Web Application Development",
      "Technical Support",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
    </>
  );
}
