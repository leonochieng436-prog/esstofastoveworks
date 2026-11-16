import AutoForm from "@/components/AutoForm";
import { BOOKING_SERVICES, CONTACT } from "@/lib/data";
import { createBooking } from "../actions";
export const metadata = { title: "Book a Service", description: "Request a consultation, site visit, installation or repair from Esstofa Stove Works." };
export default async function Book({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const services = service && !BOOKING_SERVICES.includes(service) ? [service, ...BOOKING_SERVICES] : BOOKING_SERVICES;
  return (<div className="page-wrap"><h1>Book a Service</h1><p className="mt-3">Submitting this form is a request, not a confirmed appointment. Our team reviews availability and contacts you to confirm.</p>
    <div className="mt-6"><AutoForm cta="Submit booking request" action={createBooking} defaults={{ service: service ?? "" }} fields={[...CONTACT, { name: "service", label: "Preferred service", type: "select", options: services, required: true }, { name: "date", label: "Preferred date", type: "date", required: true }, { name: "time", label: "Preferred time", type: "time", required: true }, { name: "method", label: "Service method", type: "select", options: ["Visit Esstofa workshop", "Request a mobile visit", "Online consultation"], required: true }, { name: "description", label: "Project description", type: "textarea", required: true }, { name: "notes", label: "Additional notes", type: "textarea" }, { name: "attachments", label: "Upload project photos (optional)", type: "file" }]} /></div></div>);
}
