import LegalArticle from "@/components/LegalArticle";
import { getPublishedPolicy } from "@/lib/legal";

export const metadata = {
  title: "Privacy Policy",
  description: "How Esstofa Stove Works handles information submitted through its website and customer enquiry forms.",
};
export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPage() {
  const policy = await getPublishedPolicy("privacy-policy");
  return <LegalArticle slug="privacy-policy" {...policy} />;
}
