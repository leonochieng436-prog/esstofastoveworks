import Link from "next/link";
export const metadata = { title: "Request received", robots: { index: false } };
export default async function Thanks({ searchParams }: { searchParams: Promise<{ ref?: string }> }) { const { ref } = await searchParams;
  return <div className="page-wrap text-center"><h1>Thank you</h1><p className="mx-auto mt-3">Your enquiry reference is <b className="block text-base">{ref}</b>Our team will review your request and contact you.</p><Link href="/" className="btn mt-5">Back to home</Link></div>; }
