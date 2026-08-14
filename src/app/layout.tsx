import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://vetconnect-tandil.vercel.app";
const title = "VetConnect — Cartilla de veterinarios";
const description =
  "Encontrá veterinarios y clínicas veterinarias habilitadas por el Colegio de Veterinarios de Tandil: direcciones, teléfonos, horarios y especialidades.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: title,
    template: "%s | VetConnect",
  },
  description,
  keywords: [
    "veterinarios Tandil",
    "veterinaria Tandil",
    "clínica veterinaria Tandil",
    "Colegio de Veterinarios de Tandil",
    "mascotas perdidas Tandil",
    "cartilla de veterinarios",
  ],
  authors: [{ name: "Colegio de Veterinarios de Tandil" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title,
    description,
    url: BASE_URL,
    siteName: "VetConnect",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Colegio de Veterinarios de Tandil",
  url: BASE_URL,
  areaServed: {
    "@type": "City",
    name: "Tandil",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "VetConnect",
  url: BASE_URL,
  inLanguage: "es-AR",
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${fontSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
