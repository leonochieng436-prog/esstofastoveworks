import { db } from "@/lib/db";
import { wa } from "@/lib/site";
import { setBooking } from "../actions";
export const dynamic = "force-dynamic";
const S = ["PENDING", "REVIEWED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
export default async function Bookings({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status, q } = await searchParams;
  const bs = await db.booking.findMany({ where: { ...(status && { status: status as any }), ...(q && { OR: [{ reference: { contains: q, mode: "insensitive" } }, { fullName: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] }) }, orderBy: { createdAt: "desc" }, take: 100 });
  return (<><header className="admin-page-heading"><h1>Bookings</h1></header><form className="admin-filter-bar mb-6"><input name="q" defaultValue={q} placeholder="Search reference, name, phone" className="inp max-w-xs" /><select name="status" defaultValue={status ?? ""} className="inp max-w-[200px]"><option value="">All statuses</option>{S.map((s) => <option key={s}>{s}</option>)}</select><button className="btn">Filter</button></form>
    {!bs.length && <p>No bookings found.</p>}<div className="admin-record-list">{bs.map((b) => <div key={b.id} className="admin-record-card text-sm"><div className="flex justify-between"><b>{b.reference}</b><span>{b.status.replace("_", " ")}</span></div><p>{b.fullName} · {b.phone} · {b.email}</p><p>{b.county}, {b.town}</p><p><b>{b.service}</b> · {b.date.toLocaleDateString("en-KE")} {b.time} · {b.method}</p><p className="mt-1">{b.description}{b.notes && ` (${b.notes})`}</p>
      {b.attachments.map((a) => <a key={a} href={a} target="_blank" rel="noopener noreferrer" className="underline mr-3">Attachment</a>)}
      <form action={setBooking.bind(null, b.id)} className="mt-3 grid sm:grid-cols-[160px_1fr_auto] gap-2"><select name="status" defaultValue={b.status} className="inp">{S.map((s) => <option key={s}>{s}</option>)}</select><input name="internalNotes" defaultValue={b.internalNotes ?? ""} placeholder="Internal notes" className="inp" /><button className="btn">Save</button></form>
      <p className="mt-2 flex gap-4"><a className="underline" href={`tel:${b.phone}`}>Call</a><a className="underline" href={wa(b.phone, `Hello ${b.fullName}, this is Esstofa Stove Works about your booking ${b.reference}.`)}>WhatsApp customer</a></p></div>)}</div></>);
}
