import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uchit.web — Websites That Grow Businesses",
  description:
    "Uchit.web builds modern, fast and premium websites for businesses, brands and individuals.",
  keywords: [
    "Uchit.web",
    "web developer",
    "web designer",
    "website development",
    "business website",
    "freelance web developer",
    "website designer India",
  ],
  authors: [
    {
      name: "Uchit",
    },
  ],
  creator: "Uchit.web",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Uchit.web — Websites That Grow Businesses",
    description:
      "Modern websites designed and developed to help businesses grow online.",
    type: "website",
    siteName: "Uchit.web",
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
        <meta name="theme-color" content="#080808" />
      </head>

     <body>
  {children}

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