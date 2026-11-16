"use server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { COOKIE, createSession, requireAdmin } from "@/lib/auth";
import { allow } from "@/lib/ratelimit";
import { uploadFile, uploadMany } from "@/lib/upload";
import { SERVICE_ICON_NAMES } from "@/lib/service-icons";
const done = () => revalidatePath("/", "layout");
export async function login(_: unknown, fd: FormData) {
  if (!(await allow("login", 5, 900))) return "Too many attempts. Try again in 15 minutes.";
  const email = String(fd.get("email") ?? "").toLowerCase().trim();
  const password = String(fd.get("password") ?? "");
  const u = await db.adminUser.findUnique({ where: { email } });
  if (!u || !(await bcrypt.compare(password, u.passwordHash))) return "Wrong email or password.";
  await createSession(u.id, u.role); redirect("/admin");
}
export async function logout() {
  (await cookies()).delete(COOKIE);
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}
export async function setBooking(id: string, fd: FormData) {
  await requireAdmin();
  await db.booking.update({ where: { id }, data: { status: z.enum(["PENDING", "REVIEWED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).parse(fd.get("status")), internalNotes: String(fd.get("internalNotes") ?? "").slice(0, 2000) || null } }); done();
}
export async function setQuote(id: string, fd: FormData) {
  await requireAdmin();
  await db.questionnaire.update({ where: { id }, data: { status: z.enum(["NEW", "REVIEWED", "QUOTED", "CLOSED"]).parse(fd.get("status")), quoteNotes: String(fd.get("quoteNotes") ?? "").slice(0, 2000) || null } }); done();
}
const opt = (s: unknown) => (String(s ?? "").trim() || null);
export async function saveProduct(id: string, fd: FormData) {
  await requireAdmin();
  const d = z.object({ name: z.string().min(2), slug: z.string().toLowerCase().regex(/^[a-z0-9-]+$/), categoryId: z.string(), description: z.string().min(3), priceKes: z.coerce.number().int().min(1).optional().or(z.literal("").transform(() => undefined)) }).parse(Object.fromEntries(fd));
  const data = { ...d, priceKes: d.priceKes ?? null, features: String(fd.get("features") ?? "").split("\n").map((x) => x.trim()).filter(Boolean), fuelType: opt(fd.get("fuelType")), materials: opt(fd.get("materials")), sizes: opt(fd.get("sizes")), warranty: opt(fd.get("warranty")), availability: opt(fd.get("availability")) ?? "Available on request", installation: fd.has("installation"), featured: fd.has("featured"), visible: fd.has("visible"), isSample: fd.has("isSample") };
  const pid = id === "new" ? (await db.product.create({ data })).id : (await db.product.update({ where: { id }, data })).id;
  for (const url of await uploadMany(fd, "images", "esstofa/products", true)) await db.productImage.create({ data: { productId: pid, url, alt: data.name, position: Date.now() % 1000000 } });
  done(); redirect("/admin/products");
}
export async function deleteImage(id: string) { await requireAdmin(); await db.productImage.delete({ where: { id } }); done(); }
export async function createProject(fd: FormData) {
  await requireAdmin();
  const d = z.object({ title: z.string().min(2), category: z.string().min(2) }).parse(Object.fromEntries(fd));
  const p = await db.galleryProject.create({ data: { ...d, description: opt(fd.get("description")), location: opt(fd.get("location")), featured: fd.has("featured") } });
  for (const [key, kind] of [["images", "PHOTO"], ["before", "BEFORE"], ["after", "AFTER"]] as const) for (const f of (fd.getAll(key) as File[]).filter((x) => x.size)) await db.galleryImage.create({ data: { projectId: p.id, url: await uploadFile(f, "esstofa/gallery", true), alt: `${d.title} (${kind.toLowerCase()})`, kind, position: Date.now() % 1000000 } });
  done();
}
export async function deleteProject(id: string) { await requireAdmin(); await db.galleryProject.delete({ where: { id } }); done(); }
export async function saveSettings(fd: FormData) {
  await requireAdmin();
  const parsedSettings = z.object({ businessName: z.string().trim().min(2), phone1: z.string().trim().min(9), location: z.string().trim().min(2), hours: z.string().trim().min(2) }).safeParse(Object.fromEntries(fd));
  if (!parsedSettings.success) redirect(`/admin/settings?error=${encodeURIComponent(parsedSettings.error.issues[0]?.message ?? "Check the required business settings.")}`);
  const d = parsedSettings.data;
  const url = (key: string) => {
    const value = opt(fd.get(key));
    if (value && !z.string().url().safeParse(value).success) redirect(`/admin/settings?error=${encodeURIComponent(`${key} must be a valid HTTPS URL.`)}`);
    if (value && !value.startsWith("https://")) redirect(`/admin/settings?error=${encodeURIComponent(`${key} must start with https://`)}`);
    return value;
  };
  const videoUrl = opt(fd.get("servicesHeroVideoUrl"));
  const validVideoUrl = z.string().url().refine((value) => {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") return false;
    if (parsed.hostname === "youtu.be") return /^\/[^/]+/.test(parsed.pathname);
    if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(parsed.hostname)) {
      return Boolean(parsed.searchParams.get("v") || parsed.pathname.match(/^\/(?:embed|shorts|live)\/[^/]+/));
    }
    if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(parsed.hostname)) return /\/\d+(?:\/|$)/.test(parsed.pathname);
    return /\.(mp4|webm|ogg)$/i.test(parsed.pathname);
  }, "Use a secure YouTube, Vimeo, or direct video URL.");
  if (videoUrl && !validVideoUrl.safeParse(videoUrl).success) redirect(`/admin/settings?error=${encodeURIComponent("Use a secure YouTube, Vimeo, or direct video URL.")}`);
  const statInput = z.object({ label: z.string().max(80), value: z.string().max(24) }).safeParse({
    label: String(fd.get("servicesStatLabel") ?? "").trim(),
    value: String(fd.get("servicesStatValue") ?? "").trim(),
  });
  if (!statInput.success) redirect(`/admin/settings?error=${encodeURIComponent("The optional statistic label or value is too long.")}`);
  const statLabel = opt(statInput.data.label);
  const statValue = opt(statInput.data.value);
  if (Boolean(statLabel) !== Boolean(statValue)) redirect(`/admin/settings?error=${encodeURIComponent("Enter both fields to show the optional Services statistic.")}`);

  const existing = await db.siteSettings.findUnique({ where: { id: 1 }, select: { servicesHeroImage: true, servicesIntroImages: true } });
  let servicesHeroImage = fd.has("removeServicesHeroImage") ? null : existing?.servicesHeroImage ?? null;
  const heroFile = fd.get("servicesHeroImage");
  if (heroFile instanceof File && heroFile.size > 0) {
    try {
      servicesHeroImage = await uploadFile(heroFile, "esstofa/services", true);
    } catch (error) {
      if (error instanceof Error) redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
      throw error;
    }
  }
  const removedIntroImages = new Set(fd.getAll("removeServicesIntroImage").map(String));
  const retainedIntroImages = (existing?.servicesIntroImages ?? []).filter((image) => !removedIntroImages.has(image));
  const introFiles = fd.getAll("servicesIntroImages").filter((file): file is File => file instanceof File && file.size > 0);
  if (retainedIntroImages.length + introFiles.length > 3) redirect(`/admin/settings?error=${encodeURIComponent("Services page supports up to three intro photos.")}`);
  let newIntroImages: string[];
  try {
    newIntroImages = await uploadMany(fd, "servicesIntroImages", "esstofa/services", true);
  } catch (error) {
    if (error instanceof Error) redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
    throw error;
  }

  await db.siteSettings.update({
    where: { id: 1 },
    data: {
      ...d,
      phone2: opt(fd.get("phone2")),
      email: opt(fd.get("email")),
      address: opt(fd.get("address")),
      mapEmbedUrl: url("mapEmbedUrl"),
      tiktokUrl: url("tiktokUrl"),
      story: opt(fd.get("story")),
      mission: opt(fd.get("mission")),
      vision: opt(fd.get("vision")),
      foundedNote: opt(fd.get("foundedNote")),
      servicesHeroImage,
      servicesHeroVideoUrl: videoUrl,
      servicesIntroImages: [...retainedIntroImages, ...newIntroImages],
      servicesStatLabel: statLabel,
      servicesStatValue: statValue,
    },
  });
  done();
  redirect("/admin/settings?saved=1");
}

const faqEntrySchema = z.object({ question: z.string().trim().min(1).max(300), answer: z.string().trim().min(1).max(2000) });
const faqTextSchema = z.string().transform((raw, context) => {
  if (!raw.trim()) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch (error) {
    if (error instanceof SyntaxError) {
      context.addIssue({ code: "custom", message: "FAQs must be valid JSON." });
      return z.NEVER;
    }
    throw error;
  }
  const parsed = z.array(faqEntrySchema).max(20).safeParse(value);
  if (!parsed.success) {
    context.addIssue({ code: "custom", message: "FAQs must be an array of question and answer objects (up to 20)." });
    return z.NEVER;
  }
  return parsed.data;
});
const serviceFormSchema = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug with dashes."),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(3).max(2000),
  longDescription: z.string().trim().max(8000),
  benefits: z.string().max(3000),
  locations: z.string().trim().min(2).max(500),
  position: z.coerce.number().int().min(0),
  icon: z.enum(SERVICE_ICON_NAMES),
  faqs: faqTextSchema,
});

async function persistService(id: string | null, fd: FormData): Promise<string> {
  await requireAdmin();
  const parsed = serviceFormSchema.safeParse({
    slug: fd.get("slug"),
    name: fd.get("name"),
    description: fd.get("description"),
    longDescription: String(fd.get("longDescription") ?? ""),
    benefits: String(fd.get("benefits") ?? ""),
    locations: fd.get("locations"),
    position: fd.get("position"),
    icon: fd.get("icon"),
    faqs: String(fd.get("faqs") ?? ""),
  });
  if (!parsed.success) return `Error: ${parsed.error.issues[0]?.message ?? "Check the service fields and try again."}`;

  const data = parsed.data;
  const file = fd.get("image");
  let imageUrl: string | null | undefined;
  if (fd.has("removeImage")) imageUrl = null;
  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await uploadFile(file, "esstofa/services", true);
    } catch (error) {
      if (error instanceof Error) return `Error: ${error.message}`;
      throw error;
    }
  }
  const serviceData = {
    slug: data.slug,
    name: data.name,
    description: data.description,
    longDescription: data.longDescription.trim() || null,
    benefits: data.benefits.split(/\r?\n/).map((benefit) => benefit.trim()).filter(Boolean),
    locations: data.locations,
    position: data.position,
    icon: data.icon,
    faqs: data.faqs ?? Prisma.DbNull,
    visible: fd.has("visible"),
    ...(imageUrl !== undefined ? { imageUrl } : {}),
  };

  try {
    if (id) await db.service.update({ where: { id }, data: serviceData });
    else await db.service.create({ data: serviceData });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return "Error: That service URL slug is already in use.";
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return "Error: This service no longer exists.";
    throw error;
  }

  revalidatePath("/services", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/services");
  return id ? "Service saved." : "Service created.";
}

export async function createService(_: string, fd: FormData) {
  return persistService(null, fd);
}

export async function saveService(id: string, _: string, fd: FormData) {
  return persistService(id, fd);
}

export async function deleteService(id: string, _: string, _fd: FormData) {
  await requireAdmin();
  try {
    await db.service.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return "Error: This service no longer exists.";
    throw error;
  }
  revalidatePath("/services", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/services");
  return "Service deleted.";
}
export async function addTestimonial(fd: FormData) { await requireAdmin(); const d = z.object({ name: z.string().min(2), body: z.string().min(5) }).parse(Object.fromEntries(fd)); await db.testimonial.create({ data: { ...d, location: opt(fd.get("location")) } }); done(); }
export async function delTestimonial(id: string) { await requireAdmin(); await db.testimonial.delete({ where: { id } }); done(); }
