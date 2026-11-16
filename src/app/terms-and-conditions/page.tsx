import LegalArticle from "@/components/LegalArticle";
import { getPublishedPolicy } from "@/lib/legal";

export const metadata = {
  title: "Terms and Conditions",
  description: "Terms governing use of the Esstofa Stove Works website, enquiries, bookings, and services.",
};
export const dynamic = "force-dynamic";

export default async function TermsAndConditionsPage() {
  const policy = await getPublishedPolicy("terms-and-conditions");
  return <LegalArticle slug="terms-and-conditions" {...policy} />;
}
