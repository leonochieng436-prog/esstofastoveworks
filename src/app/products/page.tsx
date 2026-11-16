import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/Cards";
export const metadata = { title: "Products and Catalogue", description: "Stoves, ovens, grills, boilers, fireplaces and more from Esstofa Stove Works." };
export const dynamic = "force-dynamic";
export default async function Products({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const { category, q } = await searchParams; const cats = await db.productCategory.findMany({ orderBy: { name: "asc" } });
  const ps = await db.product.findMany({ where: { visible: true, ...(category && { category: { slug: category } }), ...(q && { name: { contains: q, mode: "insensitive" } }) }, include: { images: { take: 1, orderBy: { position: "asc" } }, category: true }, orderBy: { createdAt: "desc" } });
  return (<div className="page-wrap"><h1>Products and Catalogue</h1>
    <form className="mt-6 flex flex-wrap gap-3"><input name="q" defaultValue={q} placeholder="Search products" className="inp max-w-xs" /><select name="category" defaultValue={category ?? ""} className="inp max-w-xs"><option value="">All categories</option>{cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select><button className="btn">Filter</button>{(q || category) && <Link href="/products" className="self-center underline">Clear</Link>}</form>
    <div className="product-grid mt-6">{ps.map((p) => <ProductCard key={p.id} p={p} />)}</div>{!ps.length && <p className="mt-6">No products match. Try another category.</p>}</div>);
}
