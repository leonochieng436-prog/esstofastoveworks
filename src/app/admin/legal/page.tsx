import { db } from "@/lib/db";
import { DEFAULT_COOKIE_CATEGORIES, LEGAL_POLICY_DEFAULTS, LEGAL_POLICY_SLUGS } from "@/lib/legal-content";
import { getCookieCategories } from "@/lib/legal";
import { requireAdminRole } from "@/lib/auth";
import { saveCookieCategories, saveLegalPolicy } from "../actions";

export const dynamic = "force-dynamic";

const formatDate = (date: Date) => new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeZone: "Africa/Nairobi" }).format(date);

export default async function LegalAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; unchanged?: string; categoriesSaved?: string; error?: string }>;
}) {
  await requireAdminRole();
  const params = await searchParams;
  const [storedPolicies, categories, revisions] = await Promise.all([
    db.legalPolicy.findMany(),
    getCookieCategories(),
    db.legalPolicyRevision.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { id: true, policySlug: true, title: true, revision: true, changedBy: true, createdAt: true },
    }),
  ]);
  const policyMap = new Map(storedPolicies.map((policy) => [policy.slug, policy]));
  const categoryMap = new Map(categories.map((category) => [category.key, category]));

  return (
    <div className="admin-legal-page">
      <header className="admin-page-heading">
        <p className="admin-page-eyebrow">Governance</p>
        <h1>Legal and cookie settings</h1>
        <p>Edit public policy content, review its history, and control which optional cookie categories visitors may choose.</p>
      </header>

      {params.saved && <p className="admin-legal-message" role="status">Policy published and revision recorded.</p>}
      {params.unchanged && <p className="admin-legal-message" role="status">No changes detected; the policy was not revised.</p>}
      {params.categoriesSaved && <p className="admin-legal-message" role="status">Cookie category settings saved.</p>}
      {params.error && <p className="admin-legal-error" role="alert">{params.error}</p>}

      <section className="admin-legal-stat" aria-labelledby="cookie-stats-title">
        <div>
          <h2 id="cookie-stats-title">Consent statistics</h2>
          <p>Not collected. Consent choices stay in each visitor’s browser, so the site does not transmit or retain visitor-level cookie statistics.</p>
        </div>
        <span>Privacy-first</span>
      </section>

      <section className="admin-legal-card" aria-labelledby="cookie-categories-title">
        <div className="admin-legal-card-heading">
          <div>
            <p className="admin-page-eyebrow">Visitor choices</p>
            <h2 id="cookie-categories-title">Cookie categories</h2>
          </div>
        </div>
        <p className="admin-legal-help">Enabling an optional category makes it available in the consent manager; it does not install tracking code. Any future analytics or marketing tool must be gated on the visitor’s consent before it loads. Essential storage always stays enabled.</p>
        <form action={saveCookieCategories} className="admin-legal-form">
          {DEFAULT_COOKIE_CATEGORIES.map((defaultCategory) => {
            const category = categoryMap.get(defaultCategory.key) ?? defaultCategory;
            return (
              <fieldset key={category.key} className="admin-cookie-category">
                <legend>{category.title}{category.essential ? " · Essential" : ""}</legend>
                <label className="admin-legal-field">
                  Display name
                  <input name={`${category.key}Title`} defaultValue={category.title} required maxLength={80} className="inp" />
                </label>
                <label className="admin-legal-field">
                  Description
                  <textarea name={`${category.key}Description`} defaultValue={category.description} rows={2} required maxLength={1000} className="inp" />
                </label>
                {category.essential ? (
                  <p className="admin-legal-essential">Always active and cannot be disabled.</p>
                ) : (
                  <label className="admin-legal-toggle">
                    <input type="checkbox" name={`${category.key}Enabled`} defaultChecked={category.enabled} />
                    <span>Offer this optional category to visitors</span>
                  </label>
                )}
              </fieldset>
            );
          })}
          <button className="btn">Save cookie categories</button>
        </form>
      </section>

      <section className="admin-legal-policies" aria-labelledby="published-policies-title">
        <div className="admin-page-heading">
          <p className="admin-page-eyebrow">Public pages</p>
          <h2 id="published-policies-title">Published policies</h2>
        </div>
        {LEGAL_POLICY_SLUGS.map((slug) => {
          const policy = policyMap.get(slug);
          const fallback = LEGAL_POLICY_DEFAULTS[slug];
          const title = policy?.title ?? fallback.title;
          const content = policy?.content ?? fallback.content;
          const history = revisions.filter((revision) => revision.policySlug === slug);
          return (
            <article key={slug} className="admin-legal-card">
              <div className="admin-legal-card-heading">
                <div>
                  <p className="admin-page-eyebrow">/{slug}</p>
                  <h2>{title}</h2>
                </div>
                <span className="admin-legal-revision">{policy ? `Revision ${policy.revision}` : "Draft defaults"}</span>
              </div>
              <p className="admin-legal-help">Last updated: {policy ? formatDate(policy.updatedAt) : "Not yet saved in the database"}</p>
              <form action={saveLegalPolicy} className="admin-legal-form">
                <input type="hidden" name="slug" value={slug} />
                <label className="admin-legal-field">
                  Page title
                  <input name="title" defaultValue={title} required minLength={3} maxLength={120} className="inp" />
                </label>
                <label className="admin-legal-field">
                  Policy content (Markdown headings: ## and ###; list items: -)
                  <textarea name="content" defaultValue={content} rows={18} required minLength={100} maxLength={50000} className="inp admin-legal-editor" />
                </label>
                <button className="btn">Publish policy</button>
              </form>
              <details className="admin-legal-history">
                <summary>Revision history ({history.length}{revisions.filter((revision) => revision.policySlug === slug).length === 30 ? "+" : ""})</summary>
                {history.length ? (
                  <ol>
                    {history.map((revision) => (
                      <li key={revision.id}>
                        <strong>Revision {revision.revision}: {revision.title}</strong>
                        <span>{formatDate(revision.createdAt)} · Admin account {revision.changedBy}</span>
                      </li>
                    ))}
                  </ol>
                ) : <p>No saved revisions yet.</p>}
              </details>
            </article>
          );
        })}
      </section>
    </div>
  );
}
