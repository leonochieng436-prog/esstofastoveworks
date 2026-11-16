import { db } from "@/lib/db";
import { getSite } from "@/lib/site";
import { addTestimonial, delTestimonial, saveSettings } from "../actions";
export const dynamic = "force-dynamic";
export default async function Settings({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const s = await getSite();
  const ts = await db.testimonial.findMany({
    select: { id: true, name: true, body: true, location: true, createdAt: true },
  });
  const T = (n: string, l: string, v?: string | null, area = false) => <label className="block text-sm">{l}{area ? <textarea name={n} defaultValue={v ?? ""} rows={3} className="inp mt-1" /> : <input name={n} defaultValue={v ?? ""} className="inp mt-1" />}</label>;
  return (<div className="max-w-3xl space-y-8">{saved === "1" && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-900" role="status">Settings saved.</p>}{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-900" role="alert">{error}</p>}<form action={saveSettings} className="admin-form-panel space-y-3"><h1>Business settings</h1>{T("businessName", "Business name", s.businessName)}{T("phone1", "Phone 1 (also used for WhatsApp)", s.phone1)}{T("phone2", "Phone 2", s.phone2)}{T("email", "Email", s.email)}{T("location", "Location", s.location)}{T("address", "Exact workshop address (enter only when confirmed)", s.address)}{T("mapEmbedUrl", "Google Maps embed URL (https://…)", s.mapEmbedUrl)}{T("tiktokUrl", "TikTok URL (https://…)", s.tiktokUrl)}{T("hours", "Operating hours", s.hours)}{T("story", "Our Story text", s.story, true)}{T("mission", "Mission", s.mission, true)}{T("vision", "Vision", s.vision, true)}{T("foundedNote", "Founding details (optional, add only verified facts)", s.foundedNote, true)}
    <fieldset className="space-y-3 rounded-card border border-char/15 p-4"><legend className="px-2 text-base font-semibold">Services page content</legend>
      <p className="text-sm leading-6 text-char/70">All media is optional. Upload only real Esstofa photos. The neutral pattern appears when no hero photo is set.</p>
      <label className="block text-sm">Hero photo (JPG, PNG or WebP; up to 5 MB)<input name="servicesHeroImage" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full" /></label>
      {s.servicesHeroImage && <div className="flex items-center gap-3 text-sm"><img src={s.servicesHeroImage} alt="Current Services hero" className="h-20 w-32 rounded-lg object-cover" /><label><input type="checkbox" name="removeServicesHeroImage" /> Remove hero photo</label></div>}
      <label className="block text-sm">Optional hero video URL (YouTube, Vimeo or direct video URL)<input name="servicesHeroVideoUrl" type="url" defaultValue={s.servicesHeroVideoUrl ?? ""} className="inp mt-1" /></label>
      <label className="block text-sm">Intro photos (up to 3 total; JPG, PNG or WebP, up to 5 MB each)<input name="servicesIntroImages" type="file" accept="image/jpeg,image/png,image/webp" multiple className="mt-1 block w-full" /></label>
      {s.servicesIntroImages.map((image) => <label key={image} className="flex items-center gap-2 text-sm"><input type="checkbox" name="removeServicesIntroImage" value={image} /><img src={image} alt="Current Services intro photo" className="h-12 w-16 rounded object-cover" />Remove this intro photo</label>)}
      <div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm">Optional verified statistic value<input name="servicesStatValue" defaultValue={s.servicesStatValue ?? ""} placeholder="For example: 200+" className="inp mt-1" /></label><label className="block text-sm">Statistic label<input name="servicesStatLabel" defaultValue={s.servicesStatLabel ?? ""} placeholder="For example: Projects completed" className="inp mt-1" /></label></div>
      <p className="text-xs leading-5 text-char/60">The optional statistic appears only when both fields are entered. Do not add unverified claims.</p>
    </fieldset>
    <button className="btn">Save settings</button></form>
    <section><h2 className="text-3xl mb-3">Testimonials (genuine customer feedback only)</h2>{ts.map((t) => <form key={t.id} action={delTestimonial.bind(null, t.id)} className="flex justify-between text-sm py-1"><span>{t.name}: {t.body}</span><button className="underline text-red-700">Delete</button></form>)}<form action={addTestimonial} className="space-y-2 mt-3"><input name="name" required placeholder="Customer name" className="inp" /><input name="location" placeholder="Location (optional)" className="inp" /><textarea name="body" required placeholder="Feedback" className="inp" /><button className="btn">Add testimonial</button></form></section></div>);
}
