import crypto from "crypto";
const OK = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
export async function uploadFile(f: File, folder: string, imagesOnly = false) {
  if (!OK.includes(f.type) || (imagesOnly && f.type === "application/pdf") || f.size > 5_000_000) throw new Error("Files must be JPG, PNG, WebP" + (imagesOnly ? "" : " or PDF") + " under 5 MB.");
  const { CLOUDINARY_CLOUD_NAME: c, CLOUDINARY_API_KEY: k, CLOUDINARY_API_SECRET: s } = process.env;
  if (!c || !k || !s) throw new Error("File uploads are not configured yet.");
  const ts = String(Math.floor(Date.now() / 1000));
  const signature = crypto.createHash("sha1").update(`folder=${folder}&timestamp=${ts}${s}`).digest("hex");
  const b = new FormData(); b.set("file", f); b.set("api_key", k); b.set("timestamp", ts); b.set("folder", folder); b.set("signature", signature);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${c}/auto/upload`, { method: "POST", body: b }); const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message ?? "Upload failed"); return j.secure_url as string;
}
export async function uploadMany(fd: FormData, key: string, folder: string, imagesOnly = false) {
  const fs = (fd.getAll(key) as File[]).filter((f) => f.size); if (fs.length > 5) throw new Error("Please upload at most 5 files.");
  const urls: string[] = []; for (const f of fs) urls.push(await uploadFile(f, folder, imagesOnly)); return urls;
}
export async function notify(subject: string, html: string, to = process.env.NOTIFY_EMAIL) {
  if (!process.env.RESEND_API_KEY || !to) return;
  try { await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.MAIL_FROM ?? "Esstofa <onboarding@resend.dev>", to: [to], subject, html }) }); } catch {}
}
