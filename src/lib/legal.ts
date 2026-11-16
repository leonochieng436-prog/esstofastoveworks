import { db } from "@/lib/db";
import {
  DEFAULT_COOKIE_CATEGORIES,
  LEGAL_POLICY_DEFAULTS,
  type CookieCategoryConfig,
  type LegalPolicySlug,
} from "@/lib/legal-content";

export async function getPublishedPolicy(slug: LegalPolicySlug) {
  const fallback = LEGAL_POLICY_DEFAULTS[slug];
  const saved = await db.legalPolicy.findUnique({ where: { slug } });
  return {
    ...fallback,
    content: saved?.content ?? fallback.content,
    revision: saved?.revision ?? 0,
    updatedAt: saved?.updatedAt ?? null,
  };
}

export async function getCookieCategories(): Promise<CookieCategoryConfig[]> {
  const savedCategories = await db.cookieCategory.findMany();
  const savedByKey = new Map(savedCategories.map((category) => [category.key, category]));

  return DEFAULT_COOKIE_CATEGORIES.map((category) => {
    const saved = savedByKey.get(category.key);
    if (!saved) return category;
    return {
      key: category.key,
      title: saved.title,
      description: saved.description,
      essential: category.essential,
      enabled: category.essential || saved.enabled,
    };
  });
}
