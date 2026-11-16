import Link from "next/link";
export const metadata = { title: "Booking request received", robots: { index: false } };
export default async function Thanks({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return (<div className="page-wrap text-center"><h1>Request received</h1><p className="mx-auto mt-3">Your reference is <b className="block text-base">{ref}</b>Keep it to check your status. This is a request, not a confirmed appointment. We will contact you to confirm.</p><div className="mt-5 flex justify-center gap-3"><Link href="/booking-status" className="btn">Check status</Link><Link href="/" className="btn-o !text-char">Home</Link></div></div>);
}
