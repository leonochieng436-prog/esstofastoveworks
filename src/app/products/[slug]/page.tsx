import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { getSite, wa } from "@/lib/site";
import AutoForm from "@/components/AutoForm";
import { ProductCard } from "@/components/Cards";
import { createEnquiry } from "../../actions";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const p = await db.product.findUnique({ where: { slug: (await params).slug } }); return p ? { title: p.name, description: p.description.slice(0, 150), alternates: { canonical: `/products/${p.slug}` } } : {}; }
export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const p = await db.product.findUnique({ where: { slug: (await params).slug }, include: { images: { orderBy: { position: "asc" } }, category: true } }); if (!p || !p.visible) notFound();
  const s = await getSite(); const rel = await db.product.findMany({ where: { categoryId: p.categoryId, id: { not: p.id }, visible: true }, include: { images: { take: 1 }, category: true }, take: 3 });
  const rows = [["Fuel type", p.fuelType], ["Materials", p.materials], ["Sizes and variations", p.sizes], ["Availability", p.availability], ["Installation", p.installation ? "Available" : "Not offered"], ["Warranty", p.warranty]].filter((r) => r[1]);
  return (<div className="page-wrap"><Link href="/products" className="text-link mb-6"><ArrowLeft aria-hidden="true" size={16} />Back to products</Link><div className="grid md:grid-cols-2 gap-6"><div><div className="aspect-[4/5] max-h-[560px] bg-ash rounded-card overflow-hidden">{p.images[0] && <img src={p.images[0].url} alt={p.images[0].alt} className="w-full h-full object-cover" />}</div><div className="flex gap-2 mt-2">{p.images.slice(1).map((i) => <img key={i.id} src={i.url} alt={i.alt} loading="lazy" className="w-14 h-14 object-cover rounded-card" />)}</div></div>
    <div><p className="text-sm font-medium text-emberdark uppercase">{p.category.name}</p><h1>{p.name}</h1>{p.isSample && <p className="mt-2 text-sm bg-ember/10 inline-block px-2 py-1 rounded">Sample listing</p>}
      <p className="mt-3 font-semibold">{p.priceKes ? `KES ${p.priceKes.toLocaleString()}` : "Request a quote"}</p><p className="mt-3">{p.description}</p>
      {p.features.length > 0 && <ul className="mt-4 list-disc pl-5">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>}
      <dl className="mt-6 grid grid-cols-3 gap-y-2 text-sm">{rows.map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold">{k}</dt><dd className="col-span-2">{v}</dd></div>)}</dl>
      <div className="mt-5 flex flex-wrap gap-3"><Link href="/quote" className="btn">Request a Quote</Link><Link href="/book" className="btn-o !text-char">Book a Service</Link><a href={wa(s.phone1, `Hello Esstofa, I am enquiring about: ${p.name}`)} className="btn-o !text-char">WhatsApp</a></div></div></div>
    <section className="mt-8 max-w-2xl"><h2 className="mb-3">Enquire about this product</h2><AutoForm cta="Send enquiry" action={createEnquiry} legalAcknowledgement hidden={{ productId: p.id }} defaults={{ message: `I am interested in: ${p.name}` }} fields={[{ name: "fullName", label: "Full name", required: true }, { name: "phone", label: "Phone", type: "tel", required: true }, { name: "email", label: "Email (optional)", type: "email" }, { name: "message", label: "Message", type: "textarea", required: true }]} /></section>
    {rel.length > 0 && <section className="mt-8"><h2 className="mb-3">Related products</h2><div className="related-product-grid">{rel.map((r) => <ProductCard key={r.id} p={r} />)}</div></section>}</div>);
}
