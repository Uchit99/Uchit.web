import type { Metadata } from "next";
import "./globals.css";
import "./redesign.css";
import { StudioExperience } from "./ui/studio-experience";

export const metadata: Metadata = {
  title: "UCHIT-WEB — Independent Web Design & Development",
  description:
    "Independent web design and development for businesses that want a credible, memorable online presence. Based in India.",
  keywords: [
    "Uchit-web",
    "web developer",
    "web designer",
    "website development",
    "business website",
    "freelance web developer",
    "website designer India",
    "UI UX design",
    "ecommerce website",
  ],
  authors: [
    {
      name: "Uchit",
    },
  ],
  creator: "UCHIT-WEB",
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? {
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
        alternates: { canonical: "/" },
      }
    : {}),
  openGraph: {
    title: "UCHIT-WEB — Independent Web Design & Development",
    description: "Websites and digital experiences that help businesses look credible and memorable.",
    type: "website",
    siteName: "UCHIT-WEB",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "UCHIT-WEB — Independent Web Design & Development",
    description: "Websites and digital experiences that help businesses look credible and memorable.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0b0c0e" />
      </head>

 <body>
  {children}
  <StudioExperience />

  <a
    href="https://wa.me/918882184445"
    target="_blank"
    rel="noopener noreferrer"
    className="floating-whatsapp"
    aria-label="Chat on WhatsApp"
  >
    <span>LET&apos;S TALK</span>
    <span className="floating-whatsapp-icon">↗</span>
  </a>
</body>
    </html>
  );
}
