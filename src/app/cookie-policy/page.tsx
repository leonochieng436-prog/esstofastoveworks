import LegalArticle from "@/components/LegalArticle";
import { getCookieCategories, getPublishedPolicy } from "@/lib/legal";

export const metadata = {
  title: "Cookie Policy",
  description: "Cookie and browser-storage choices for the Esstofa Stove Works website.",
};
export const dynamic = "force-dynamic";

export default async function CookiePolicyPage() {
  const [policy, categories] = await Promise.all([
    getPublishedPolicy("cookie-policy"),
    getCookieCategories(),
  ]);
  return (
    <LegalArticle
      slug="cookie-policy"
      {...policy}
      tocExtras={[{ id: "cookie-category-details", title: "Current cookie category settings" }]}
    >
      <section className="legal-cookie-categories" aria-labelledby="cookie-category-details">
        <h2 id="cookie-category-details">Current cookie category settings</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.key}>
              <strong>{category.title}{category.essential ? " (always active)" : category.enabled ? " (available by consent)" : " (not currently active)"}</strong>
              <span>{category.description}</span>
            </li>
          ))}
        </ul>
      </section>
    </LegalArticle>
  );
}
