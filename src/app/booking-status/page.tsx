import AutoForm from "@/components/AutoForm";
import { lookupBooking } from "../actions";
export const metadata = { title: "Check booking status" };
export default function Status() { return <div className="page-wrap"><h1>Booking status</h1><div className="mt-6"><AutoForm cta="Check status" action={lookupBooking} fields={[{ name: "reference", label: "Booking reference", required: true }, { name: "phone", label: "Phone number used", type: "tel", required: true }]} /></div></div>; }
