import { db } from "@/lib/db";
import { QUESTIONNAIRES } from "@/lib/data";
import { wa } from "@/lib/site";
import { setQuote } from "../actions";
export const dynamic = "force-dynamic";
export default async function Quotes() {
  const qs = await db.questionnaire.findMany({ orderBy: { createdAt: "desc" }, take: 100 }); const es = await db.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 30, include: { product: true } });
  return (<><header className="admin-page-heading"><h1>Quote requests</h1></header>{!qs.length && <p>No questionnaires yet.</p>}<div className="admin-record-list">{qs.map((q) => <div key={q.id} className="admin-record-card text-sm"><div className="flex justify-between"><b>{q.reference} · {QUESTIONNAIRES[q.type]?.title ?? q.type}</b><span>{q.status}</span></div><p>{q.fullName} · {q.phone} · {q.county}, {q.town}</p>
    <dl className="mt-2 grid sm:grid-cols-2 gap-x-6">{Object.entries(q.answers as Record<string, string>).map(([k, v]) => <div key={k}><dt className="font-semibold">{k}</dt><dd>{v}</dd></div>)}</dl>{q.attachments.map((a) => <a key={a} href={a} target="_blank" rel="noopener noreferrer" className="underline mr-3">Attachment</a>)}
    <form action={setQuote.bind(null, q.id)} className="mt-3 grid sm:grid-cols-[140px_1fr_auto] gap-2"><select name="status" defaultValue={q.status} className="inp">{["NEW", "REVIEWED", "QUOTED", "CLOSED"].map((s) => <option key={s}>{s}</option>)}</select><input name="quoteNotes" defaultValue={q.quoteNotes ?? ""} placeholder="Quotation notes" className="inp" /><button className="btn">Save</button></form>
    <a className="underline mt-2 inline-block" href={wa(q.phone, `Hello ${q.fullName}, Esstofa Stove Works about your enquiry ${q.reference}.`)}>WhatsApp customer</a></div>)}</div>
    <h2 className="mt-8 mb-3">Contact and product enquiries</h2>{es.map((e) => <p key={e.id} className="border-b py-2 text-sm"><b>{e.fullName}</b> · {e.phone} · {e.product?.name ?? "General"}: {e.message}</p>)}</>);
}
