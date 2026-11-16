"use client";

import Image from "next/image";
import { useActionState, type FormEvent } from "react";
import type { Service } from "@prisma/client";
import { createService, deleteService, saveService } from "../actions";
import { SERVICE_ICON_NAMES } from "@/lib/service-icons";

function ActionMessage({ message }: { message: string }) {
  if (!message) return null;
  const isError = message.startsWith("Error:");
  return <p className={`text-sm ${isError ? "text-red-700" : "text-green-800"}`} role={isError ? "alert" : "status"}>{message}</p>;
}

export function ServiceEditor({ service }: { service?: Service }) {
  const action = service ? saveService.bind(null, service.id) : createService;
  const [message, formAction, pending] = useActionState(action, "");
  const faqs = service?.faqs ? JSON.stringify(service.faqs, null, 2) : "";

  return (
    <form action={formAction} className="space-y-4 rounded-card border border-char/15 bg-white p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">Service name
          <input name="name" required defaultValue={service?.name ?? ""} className="inp mt-1" />
        </label>
        <label className="block text-sm">URL slug
          <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={service?.slug ?? ""} className="inp mt-1" />
        </label>
        <label className="block text-sm">Position
          <input name="position" type="number" min="0" step="1" defaultValue={service?.position ?? 0} className="inp mt-1" />
        </label>
        <label className="block text-sm">Card icon
          <select name="icon" defaultValue={service?.icon ?? "Wrench"} className="inp mt-1">
            {SERVICE_ICON_NAMES.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
          </select>
        </label>
      </div>
      <label className="block text-sm">Short description
        <textarea name="description" required rows={3} defaultValue={service?.description ?? ""} className="inp mt-1" />
      </label>
      <label className="block text-sm">Full description (optional)
        <textarea name="longDescription" rows={5} defaultValue={service?.longDescription ?? ""} className="inp mt-1" />
      </label>
      <label className="block text-sm">Benefits (one per line)
        <textarea name="benefits" rows={4} defaultValue={service?.benefits.join("\n") ?? ""} className="inp mt-1" />
      </label>
      <label className="block text-sm">Service options and locations
        <input name="locations" required defaultValue={service?.locations ?? "Workshop, mobile visit or on-site"} className="inp mt-1" />
      </label>
      <label className="block text-sm">FAQs (optional JSON array of question/answer objects)
        <textarea name="faqs" rows={6} placeholder={'[\n  { "question": "Example question", "answer": "Verified answer" }\n]'} defaultValue={faqs} className="inp mt-1 font-mono text-xs" />
      </label>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block text-sm">Service photo (JPG, PNG or WebP; up to 5 MB)
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-sm" />
        </label>
        {service?.imageUrl && (
          <div className="flex items-center gap-3">
            <Image src={service.imageUrl} alt={`${service.name} service photo`} width={112} height={80} className="h-20 w-28 rounded-lg object-cover" />
            <label className="text-sm"><input type="checkbox" name="removeImage" /> Remove photo</label>
          </div>
        )}
      </div>
      <label className="inline-flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" name="visible" defaultChecked={service?.visible ?? true} />
        Visible on the public site
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button className="btn" disabled={pending}>{pending ? "Saving…" : service ? "Save service" : "Create service"}</button>
        <ActionMessage message={message} />
      </div>
    </form>
  );
}

export function ServiceDeleteForm({ id, name }: { id: string; name: string }) {
  const [message, formAction, pending] = useActionState(deleteService.bind(null, id), "");
  const confirmDelete = (event: FormEvent<HTMLFormElement>) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) event.preventDefault();
  };

  return (
    <form action={formAction} onSubmit={confirmDelete} className="flex flex-wrap items-center gap-4">
      <button className="min-h-11 text-sm font-medium text-red-700 underline underline-offset-4" disabled={pending}>
        {pending ? "Deleting…" : "Delete service"}
      </button>
      <ActionMessage message={message} />
    </form>
  );
}
