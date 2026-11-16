import { db } from "@/lib/db";
import { deleteImage, saveProduct } from "../../actions";
export const dynamic = "force-dynamic";
export default async function Edit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const p = id === "new" ? null : await db.product.findUnique({ where: { id }, include: { images: true } }); const cats = await db.productCategory.findMany();
  const T = (n: string, l: string, v?: string | number | null) => <label className="block text-sm">{l}<input name={n} defaultValue={v ?? ""} className="inp mt-1" /></label>;
  return (<><form action={saveProduct.bind(null, id)} className="admin-form-panel max-w-xl space-y-3"><h1>{p ? "Edit product" : "New product"}</h1>{T("name", "Name", p?.name)}{T("slug", "URL slug (lowercase-with-dashes)", p?.slug)}
    <label className="block text-sm">Category<select name="categoryId" defaultValue={p?.categoryId} className="inp mt-1">{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <label className="block text-sm">Description<textarea name="description" required defaultValue={p?.description} rows={4} className="inp mt-1" /></label><label className="block text-sm">Features (one per line)<textarea name="features" defaultValue={p?.features.join("\n")} rows={4} className="inp mt-1" /></label>
    {T("priceKes", "Price in KES (leave empty for Request a Quote)", p?.priceKes)}{T("fuelType", "Fuel type", p?.fuelType)}{T("materials", "Materials", p?.materials)}{T("sizes", "Sizes and variations", p?.sizes)}{T("availability", "Availability", p?.availability)}{T("warranty", "Warranty (only if verified)", p?.warranty)}
    <label className="block text-sm">Upload images (JPG/PNG/WebP, 5 MB each)<input name="images" type="file" multiple accept="image/jpeg,image/png,image/webp" className="block mt-1" /></label>
    <div className="flex flex-wrap gap-4 text-sm">{[["installation", "Installation available", p?.installation ?? true], ["featured", "Featured", p?.featured], ["visible", "Visible", p?.visible ?? true], ["isSample", "Sample listing", p?.isSample]].map(([n, l, c]) => <label key={n as string}><input type="checkbox" name={n as string} defaultChecked={Boolean(c)} /> {l as string}</label>)}</div><button className="btn">Save product</button></form>
    {p && <div className="flex gap-3 mt-6 flex-wrap">{p.images.map((i) => <form key={i.id} action={deleteImage.bind(null, i.id)}><img src={i.url} alt={i.alt} className="w-24 h-24 object-cover rounded" /><button className="text-xs underline">Remove</button></form>)}</div>}</>);
}
