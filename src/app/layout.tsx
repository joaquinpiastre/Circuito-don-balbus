import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://donbalbus.com"),
  title: {
    default: "Circuito Motocross Don Balbus | San Rafael, Mendoza",
    template: "%s | Don Balbus",
  },
  description:
    "Circuito de motocross en Las Paredes, San Rafael, Mendoza. Entrenamientos. Vení a rodar.",
  keywords: [
    "motocross",
    "San Rafael",
    "Mendoza",
    "Don Balbus",
    "pista iluminada",
    "Las Paredes",
    "circuito motocross",
  ],
  openGraph: {
    title: "Circuito Motocross Don Balbus | San Rafael, Mendoza",
    description:
      "Circuito en Las Paredes. Entrenamientos miércoles, viernes y a veces sábado. Ver horarios.",
    url: "https://donbalbus.com",
    siteName: "Circuito Motocross Don Balbus",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Circuito Motocross Don Balbus | San Rafael, Mendoza",
    description: "Circuito en Las Paredes. Entrenamientos según horarios.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://donbalbus.com" },
  // Favicon generado en app/icon.tsx (letra D, colores Don Balbus). Para usar imagen propia: agregar public/Favicon.png y descomentar:
  // icons: { icon: "/Favicon.png", apple: "/Favicon.png" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "Circuito Motocross Don Balbus",
  description: "Circuito de motocross en Las Paredes, San Rafael, Mendoza.",
  url: "https://donbalbus.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Las Paredes",
    addressRegion: "Mendoza",
    addressCountry: "AR",
  },
  geo: { "@type": "GeoCoordinates", latitude: -34.61, longitude: -68.35 },
  telephone: "+54 260 467-4619",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "20:00", closes: "00:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "20:00", closes: "00:00" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${bebas.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
