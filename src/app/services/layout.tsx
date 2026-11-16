import { Barlow, Barlow_Condensed } from "next/font/google";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${body.variable} services-page`}>{children}</div>;
}
