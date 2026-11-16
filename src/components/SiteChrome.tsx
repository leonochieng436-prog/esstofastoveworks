"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { wa } from "@/lib/whatsapp";

type SiteChromeProps = {
  site: {
    businessName: string;
    phone1: string;
    phone2: string | null;
    email: string | null;
    location: string;
    hours: string;
    tiktokUrl: string | null;
  };
  children: React.ReactNode;
};

const NAV = [["Home", "/"], ["Our Story", "/about"], ["Products", "/products"], ["Services", "/services"], ["Gallery", "/gallery"], ["Book a Service", "/book"], ["Contact", "/contact"]];

export default function SiteChrome({ site, children }: SiteChromeProps) {
  const isAdmin = usePathname()?.startsWith("/admin") ?? false;

  if (isAdmin) return <div className="admin-app-content">{children}</div>;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-char/95 text-white backdrop-blur-md">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <Link href="/" className="shrink-0 font-display text-xl font-semibold tracking-wide sm:text-2xl">
            ESSTOFA <span className="text-ember">STOVE WORKS</span>
          </Link>
          <nav className="hidden items-center gap-5 text-xs xl:flex">
            {NAV.map(([label, href]) => (
              <Link key={href} href={href} className="whitespace-nowrap transition-colors hover:text-ember">{label}</Link>
            ))}
          </nav>
          <div className="hidden items-center md:flex">
            <Link href="/quote" className="btn !min-h-11 !whitespace-nowrap !px-5 !py-2.5 !text-xs">Request a quote</Link>
          </div>
          <details className="group relative xl:hidden">
            <summary
              className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-white/30 transition-colors hover:border-ember hover:text-ember [&::-webkit-details-marker]:hidden"
              aria-label="Open navigation menu"
            >
              <Menu aria-hidden="true" size={20} />
            </summary>
            <nav className="absolute right-0 top-[calc(100%+0.75rem)] grid w-[min(20rem,calc(100vw-2.5rem))] gap-1 rounded-2xl border border-white/10 bg-char p-3 shadow-xl">
              {NAV.map(([label, href]) => (
                <Link key={href} href={href} className="whitespace-nowrap rounded-lg px-4 py-3 text-sm transition-colors hover:bg-white/10 hover:text-ember">
                  {label}
                </Link>
              ))}
              <Link href="/quote" className="btn mt-2 !whitespace-nowrap !text-xs">Request a quote</Link>
            </nav>
          </details>
        </div>
      </header>
      <main className="app-content">{children}</main>
      <footer className="site-footer">
        <span className="footer-watermark" aria-hidden="true">ESSTOFA</span>
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm md:grid-cols-[1.4fr_1fr_0.8fr] md:gap-10 md:px-6 md:py-16">
          <div className="max-w-sm">
            <p className="font-display text-3xl font-semibold text-white">ESSTOFA STOVE WORKS</p>
            <p className="mt-4 leading-7">
              Supply, fabrication, installation and maintenance of modern cooking stoves and ovens across Kenya and Africa.
            </p>
          </div>
          <address className="space-y-2 not-italic">
            <p className="mb-4 font-semibold text-white">Contact</p>
            <p>{site.location}</p>
            <a className="block" href={`tel:${site.phone1}`}>{site.phone1}</a>
            {site.phone2 && <a className="block" href={`tel:${site.phone2}`}>{site.phone2}</a>}
            {site.email && <a className="block break-all" href={`mailto:${site.email}`}>{site.email}</a>}
            <p>Open: {site.hours}</p>
            {site.tiktokUrl && <a className="block underline" href={site.tiktokUrl} target="_blank" rel="noopener noreferrer">TikTok</a>}
          </address>
          <nav aria-label="Footer navigation">
            <p className="mb-4 font-semibold text-white">Explore</p>
            <div className="grid gap-2">
              {NAV.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            </div>
          </nav>
        </div>
        <p className="relative border-t border-white/10 px-5 py-5 text-center text-xs">
          © {new Date().getFullYear()} {site.businessName}. All rights reserved.
        </p>
      </footer>
      <a href={wa(site.phone1, "Hello Esstofa, I would like to make an enquiry.")} aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-40 btn !rounded-full shadow-lg">
        <Phone size={18} className="mr-2" />WhatsApp
      </a>
    </>
  );
}