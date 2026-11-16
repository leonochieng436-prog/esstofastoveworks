import "./globals.css";
import { Poppins, Open_Sans } from "next/font/google";
import { getSite } from "@/lib/site";
import SiteChrome from "@/components/SiteChrome";
const display = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const body = Open_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });
export const metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), title: { default: "Esstofa Stove Works | Modern Stoves, Ovens and Fabrication in Kenya", template: "%s | Esstofa Stove Works" }, description: "Supply, fabrication, installation and repair of modern cooking stoves, ovens and grills across Kenya. Based in Kisumu.", openGraph: { siteName: "Esstofa Stove Works", type: "website" }, verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined };
export const dynamic = "force-dynamic";
export default async function Root({ children }: { children: React.ReactNode }) {
  const s = await getSite();
  const ld = { "@context": "https://schema.org", "@type": "LocalBusiness", name: s.businessName, telephone: [s.phone1, s.phone2].filter(Boolean), email: s.email, url: process.env.NEXT_PUBLIC_SITE_URL, address: { "@type": "PostalAddress", addressLocality: "Kisumu", addressCountry: "KE", ...(s.address && { streetAddress: s.address }) }, openingHours: "Mo-Su 00:00-23:59" };
  return (<html lang="en" className={`${display.variable} ${body.variable}`}><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <SiteChrome site={{ businessName: s.businessName, phone1: s.phone1, phone2: s.phone2, email: s.email, location: s.location, hours: s.hours, tiktokUrl: s.tiktokUrl }}>
      {children}
    </SiteChrome>
  </body></html>);
}
