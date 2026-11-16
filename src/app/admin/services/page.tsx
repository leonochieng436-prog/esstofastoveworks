import { db } from "@/lib/db";
import { ServiceDeleteForm, ServiceEditor } from "./ServiceEditor";

export const dynamic = "force-dynamic";

export default async function AdminServices() {
  const services = await db.service.findMany({ orderBy: [{ position: "asc" }, { name: "asc" }] });

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="eyebrow"><span />Content management</p>
        <h1 className="mt-3">Services</h1>
        <p className="mt-3 text-sm leading-6 text-char/70">Edit service details, visibility, order and real Esstofa photos. The position field controls the public order.</p>
      </header>
      <section className="max-w-4xl space-y-4">
        <h2 className="text-2xl">Add a service</h2>
        <ServiceEditor />
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl">Existing services ({services.length})</h2>
        {services.length === 0 && <p className="text-sm text-char/70">No services have been added yet.</p>}
        <div className="space-y-3">
          {services.map((service) => (
            <details key={service.id} className="group rounded-card border border-char/15 bg-white">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 [&::-webkit-details-marker]:hidden">
                <span className="font-semibold">{service.name}</span>
                <span className="shrink-0 text-xs text-char/60">#{service.position} · {service.visible ? "Visible" : "Hidden"} · Edit</span>
              </summary>
              <div className="space-y-4 border-t border-char/10 p-4 sm:p-5">
                <ServiceEditor service={service} />
                <ServiceDeleteForm id={service.id} name={service.name} />
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
