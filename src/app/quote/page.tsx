import Link from "next/link";
import AutoForm from "@/components/AutoForm";
import { CONTACT, QUESTIONNAIRES } from "@/lib/data";
import { submitQuestionnaire } from "../actions";
export const metadata = { title: "Request a Quote", description: "Tell us about your project and request a quotation from Esstofa Stove Works." };
export default async function Quote({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams; const q = type ? QUESTIONNAIRES[type] : undefined;
  if (!q) return (<div className="page-wrap"><h1>Request a Quote</h1><p className="mt-3">Choose what you need. A few questions help us prepare an accurate quotation.</p><div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">{Object.entries(QUESTIONNAIRES).map(([k, v]) => <Link key={k} href={`/quote?type=${k}`} className="rounded-card border-l-4 border-ember bg-ash p-4 text-base font-display font-semibold hover:bg-ember/10">{v.title}</Link>)}</div></div>);
  return (<div className="page-wrap"><Link href="/quote" className="text-sm underline">Change project type</Link><h1 className="mt-2">{q.title}</h1><div className="mt-6"><AutoForm cta="Submit request" action={submitQuestionnaire.bind(null, type!)} legalAcknowledgement fields={[...CONTACT, ...q.fields]} /></div></div>);
}
