"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { allow } from "@/lib/ratelimit";
import { QUESTIONNAIRES } from "@/lib/data";
import { ref } from "@/lib/site";
import { notify, uploadMany } from "@/lib/upload";
const phone = z.string().trim().regex(/^(\+?254|0)\d{9}$/, "Enter a valid Kenyan phone number, e.g. 0712345678");
const base = { fullName: z.string().trim().min(2, "Enter your full name").max(80), phone, email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")), county: z.string().min(2, "Choose a county"), town: z.string().trim().min(2, "Enter your town or location") };
const fail = (e: unknown) => (e instanceof z.ZodError ? e.issues[0].message : e instanceof Error ? e.message : "Something went wrong. Please try again.");
const spam = (fd: FormData) => Boolean(fd.get("website"));

export async function createBooking(_: string, fd: FormData): Promise<string> {
  if (spam(fd)) return "";
  let reference = "";
  try {
    if (!(await allow("booking", 5, 3600))) return "Too many requests. Please try again later.";
    const d = z.object({ ...base, service: z.string().min(2, "Choose a service"), date: z.string().min(1, "Choose a date"), time: z.string().min(1, "Choose a time"), method: z.string().min(2, "Choose a service method"), description: z.string().trim().min(5, "Describe your project").max(1500), notes: z.string().max(800).optional() }).parse(Object.fromEntries(fd));
    if (new Date(d.date) < new Date(new Date().toDateString())) return "Please choose a date that is today or later.";
    const attachments = await uploadMany(fd, "attachments", "esstofa/bookings");
    reference = ref("BKG");
    await db.booking.create({ data: { reference, ...d, email: d.email || null, date: new Date(d.date), attachments } });
    await notify(`New booking request ${reference}`, `<p>${d.fullName}, ${d.phone}, ${d.county}/${d.town}<br>${d.service} on ${d.date} ${d.time} (${d.method})<br>${d.description}</p>`);
    if (d.email) await notify("We received your booking request", `<p>Hello ${d.fullName}, we received booking request <b>${reference}</b>. It is not confirmed until our team reviews availability and contacts you.</p>`, d.email);
  } catch (e) { return fail(e); }
  redirect(`/book/thanks?ref=${reference}`);
}
export async function submitQuestionnaire(type: string, _: string, fd: FormData): Promise<string> {
  if (spam(fd)) return "";
  const q = QUESTIONNAIRES[type]; if (!q) return "Unknown questionnaire.";
  let reference = "";
  try {
    if (!(await allow("quote", 5, 3600))) return "Too many requests. Please try again later.";
    const c = z.object(base).parse(Object.fromEntries(fd));
    const answers: Record<string, string> = {}; for (const f of q.fields) if (f.type !== "file") { const v = String(fd.get(f.name) ?? "").trim(); if (f.required && !v) return `Please answer: ${f.label}`; if (v) answers[f.label] = v.slice(0, 1500); }
    const attachments = await uploadMany(fd, "attachments", "esstofa/quotes");
    reference = ref("ENQ");
    await db.questionnaire.create({ data: { reference, type, ...c, email: c.email || null, answers, attachments } });
    await notify(`New ${q.title} request ${reference}`, `<p>${c.fullName}, ${c.phone}, ${c.county}/${c.town}</p><pre>${JSON.stringify(answers, null, 1)}</pre>`);
    if (c.email) await notify("We received your quotation request", `<p>Hello ${c.fullName}, your enquiry reference is <b>${reference}</b>. We will review it and contact you.</p>`, c.email);
  } catch (e) { return fail(e); }
  redirect(`/quote/thanks?ref=${reference}`);
}
export async function createEnquiry(_: string, fd: FormData): Promise<string> {
  if (spam(fd)) return "";
  try {
    if (!(await allow("enquiry", 8, 3600))) return "Too many messages. Please try again later.";
    const d = z.object({ fullName: base.fullName, phone, email: base.email, message: z.string().trim().min(5, "Write a short message").max(1500), productId: z.string().optional() }).parse(Object.fromEntries(fd));
    await db.enquiry.create({ data: { ...d, email: d.email || null, productId: d.productId || null } });
    await notify("New website enquiry", `<p>${d.fullName}, ${d.phone}<br>${d.message}</p>`);
  } catch (e) { return fail(e); }
  return "Thank you. We have received your message and will contact you shortly.";
}
export async function lookupBooking(_: string, fd: FormData): Promise<string> {
  if (!(await allow("lookup", 10, 900))) return "Too many lookups. Try again later.";
  const r = String(fd.get("reference") ?? "").trim().toUpperCase(), p = String(fd.get("phone") ?? "").replace(/\D/g, "").slice(-9);
  const b = await db.booking.findUnique({ where: { reference: r } });
  if (!b || b.phone.replace(/\D/g, "").slice(-9) !== p) return "We could not find a booking with that reference and phone number.";
  return `Booking ${b.reference}: ${b.status.replace("_", " ")}. ${b.status === "PENDING" ? "Our team has not reviewed it yet." : ""}`;
}
