import Link from "next/link";
import { db } from "@/lib/db";
import { GALLERY_CATEGORIES } from "@/lib/data";
export const metadata = { title: "Project Gallery", description: "Completed stoves, ovens, grills and fabrication projects by Esstofa Stove Works." };
export const dynamic = "force-dynamic";
export default async function Gallery({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams; const ps = await db.galleryProject.findMany({ where: category ? { category } : {}, include: { images: { orderBy: { position: "asc" } } }, orderBy: { createdAt: "desc" } });
  return (<div className="page-wrap"><h1>Project Gallery</h1>
    <div className="flex flex-wrap gap-2 mt-4 text-sm"><Link href="/gallery" className="min-h-11 inline-flex items-center border rounded-full px-3">All</Link>{GALLERY_CATEGORIES.map((c) => <Link key={c} href={`/gallery?category=${encodeURIComponent(c)}`} className={`min-h-11 inline-flex items-center border rounded-full px-3 ${c === category ? "bg-ember text-white" : ""}`}>{c}</Link>)}</div>
    <section className="mt-6" aria-label="Project results">
      <h2 className="sr-only">Projects</h2>
      <div className="gallery-grid">{ps.map((p) => <article key={p.id} className="gallery-card"><div className="grid grid-cols-2 gap-2">{p.images.slice(0, 4).map((i, n) => <a key={i.id} href={i.url} target="_blank" rel="noopener noreferrer" className={n === 0 && p.images.length % 2 ? "col-span-2" : ""}><img src={i.url} alt={i.alt} loading="lazy" className="gallery-thumbnail w-full object-cover rounded-card" />{i.kind !== "PHOTO" && <span className="text-xs">{i.kind === "BEFORE" ? "Before" : "After"}</span>}</a>)}</div>
        <h3 className="gallery-card-title mt-2">{p.title}</h3><p className="text-xs text-emberdark font-medium uppercase">{p.category}{p.location && ` · ${p.location}`}</p>{p.description && <p className="mt-1 line-clamp-2">{p.description}</p>}</article>)}</div>
    </section>
    {!ps.length && <p className="mt-8">Project photos are being added. <Link href="/contact" className="underline">Contact us</Link> to see recent work.</p>}</div>);
}
