import { getSite, wa } from "@/lib/site";
import AutoForm from "@/components/AutoForm";
import { createEnquiry } from "../actions";
export const metadata = { title: "Contact Us", description: "Call, WhatsApp or visit Esstofa Stove Works in Kisumu, Kenya." };
export const dynamic = "force-dynamic";
export default async function Contact() {
  const s = await getSite(); const nums = [s.phone1, s.phone2].filter(Boolean) as string[];
  return (<div className="page-wrap grid md:grid-cols-2 gap-8"><div><h1>Contact Us</h1><address className="not-italic mt-4 space-y-2"><p className="font-semibold">{s.businessName}</p><p>{s.location}{s.address && `, ${s.address}`}</p><p>Open: {s.hours}. Mobile service and support enquiries accepted.</p>{s.email && <a className="underline block" href={`mailto:${s.email}`}>{s.email}</a>}{s.tiktokUrl && <a className="underline block" href={s.tiktokUrl} target="_blank" rel="noopener noreferrer">TikTok: Esstofa Stove Works</a>}</address>
    <div className="mt-6 grid gap-3">{nums.map((n) => <div key={n} className="flex gap-2"><a className="btn flex-1" href={`tel:${n}`}>Call {n}</a><a className="btn-o !text-char" href={wa(n, "Hello Esstofa, I would like to make an enquiry.")}>WhatsApp</a></div>)}</div>
    <p className="mt-6 text-sm">Coverage: all 47 counties in Kenya, and other African countries subject to availability and project arrangements.</p>
    {s.mapEmbedUrl ? <iframe title="Workshop location" src={s.mapEmbedUrl} loading="lazy" className="w-full h-64 mt-6 rounded-lg border" /> : <p className="mt-6 text-sm bg-ash p-4 rounded">Map coming soon. The workshop pin is added by the administrator in the admin settings.</p>}</div>
    <div><h2 className="mb-4">Send an enquiry</h2><AutoForm cta="Send message" action={createEnquiry} legalAcknowledgement fields={[{ name: "fullName", label: "Full name", required: true }, { name: "phone", label: "Phone", type: "tel", required: true }, { name: "email", label: "Email (optional)", type: "email" }, { name: "message", label: "Message", type: "textarea", required: true }]} /></div></div>);
}
