import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const b = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [products, services] = await Promise.all([
    db.product.findMany({ where: { visible: true }, select: { slug: true, updatedAt: true } }),
    db.service.findMany({ where: { visible: true }, select: { slug: true } }),
  ]);
  return [
    ...["", "/about", "/products", "/services", "/gallery", "/book", "/quote", "/contact"].map((path) => ({ url: b + path })),
    ...products.map((product) => ({ url: `${b}/products/${product.slug}`, lastModified: product.updatedAt })),
    ...services.map((service) => ({ url: `${b}/services/${service.slug}` })),
  ];
}
