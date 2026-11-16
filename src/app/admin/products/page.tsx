import Link from "next/link";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function P() {
  const ps = await db.product.findMany({ include: { category: true, images: { take: 1 } }, orderBy: { createdAt: "desc" } });
  return (<><div className="admin-page-heading flex flex-wrap items-end justify-between gap-4"><h1>Products</h1><Link href="/admin/products/new" className="btn">Add product</Link></div><div className="admin-table-wrap"><table className="text-sm"><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Visible</th><th /></tr></thead><tbody>{ps.map((p) => <tr key={p.id}><td>{p.name}</td><td>{p.category.name}</td><td>{p.priceKes ? `KES ${p.priceKes.toLocaleString()}` : "Quote"}</td><td>{p.visible ? "Yes" : "Hidden"}</td><td><Link className="underline" href={`/admin/products/${p.id}`}>Edit</Link></td></tr>)}</tbody></table></div></>);
}
