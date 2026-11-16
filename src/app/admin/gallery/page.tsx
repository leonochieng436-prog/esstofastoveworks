import { db } from "@/lib/db";
import { GALLERY_CATEGORIES } from "@/lib/data";
import { createProject, deleteProject } from "../actions";
export const dynamic = "force-dynamic";
export default async function G() {
  const ps = await db.galleryProject.findMany({ include: { images: { take: 1 } }, orderBy: { createdAt: "desc" } });
  return (<><header className="admin-page-heading"><h1>Project gallery</h1></header>
    <form action={createProject} className="admin-form-panel max-w-xl space-y-3 mb-10"><input name="title" required placeholder="Project title" className="inp" /><select name="category" className="inp">{GALLERY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select><input name="location" placeholder="Location (only if approved for publication)" className="inp" /><textarea name="description" placeholder="Description" className="inp" />
      <label className="block text-sm">Photos<input name="images" type="file" multiple accept="image/jpeg,image/png,image/webp" className="block" /></label><label className="block text-sm">Before photos<input name="before" type="file" multiple accept="image/jpeg,image/png,image/webp" className="block" /></label><label className="block text-sm">After photos<input name="after" type="file" multiple accept="image/jpeg,image/png,image/webp" className="block" /></label>
      <label className="text-sm"><input type="checkbox" name="featured" /> Featured on homepage</label><p className="text-xs">Upload only real Esstofa project photos.</p><button className="btn">Add project</button></form>
    {ps.map((p) => <form key={p.id} action={deleteProject.bind(null, p.id)} className="flex justify-between border-b py-2 text-sm"><span>{p.title} · {p.category}</span><button className="underline text-red-700">Delete</button></form>)}</>);
}
