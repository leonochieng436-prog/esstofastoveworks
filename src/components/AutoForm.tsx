"use client";
import { useActionState } from "react";
import type { Field } from "@/lib/data";
export default function AutoForm({ fields, action, cta, defaults = {}, hidden = {} }: { fields: Field[]; action: (p: string, fd: FormData) => Promise<string>; cta: string; defaults?: Record<string, string>; hidden?: Record<string, string> }) {
  const [msg, act, pending] = useActionState(action, "");
  const ok = msg.startsWith("Thank") || msg.startsWith("Booking");
  return (<form action={act} className="grid sm:grid-cols-2 gap-4">
    {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
    {fields.map((f) => <label key={f.name} className={`block text-sm font-medium ${f.type === "textarea" || f.type === "file" ? "sm:col-span-2" : ""}`}>{f.label}{f.required && " *"}
      {f.type === "textarea" ? <textarea name={f.name} required={f.required} rows={4} defaultValue={defaults[f.name]} className="inp mt-1" />
        : f.type === "select" ? <select name={f.name} required={f.required} defaultValue={defaults[f.name] ?? ""} className="inp mt-1"><option value="" disabled>Select…</option>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
        : f.type === "file" ? <input name={f.name} type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" className="mt-1 block" />
        : <input name={f.name} type={f.type ?? "text"} required={f.required} defaultValue={defaults[f.name]} className="inp mt-1" />}</label>)}
    <div className="sm:col-span-2"><button disabled={pending} className="btn disabled:opacity-50">{pending ? "Sending…" : cta}</button>
      {msg && <p role="status" className={`mt-3 text-sm ${ok ? "text-green-800" : "text-red-700"}`}>{msg}</p>}</div></form>);
}
