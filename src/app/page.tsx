import { db } from "@/lib/db";
import StudioHome from "@/components/StudioHome";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [products, services, projects, testimonials] = await Promise.all([
    db.product.findMany({
      where: { visible: true, featured: true },
      include: { images: { take: 1, orderBy: { position: "asc" } }, category: true },
      take: 6,
    }),
    db.service.findMany({ where: { visible: true }, orderBy: { position: "asc" }, take: 6 }),
    db.galleryProject.findMany({
      where: { featured: true },
      include: { images: { take: 1, orderBy: { position: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    db.testimonial.findMany({
      select: { id: true, name: true, body: true, location: true, createdAt: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return <StudioHome products={products} services={services} projects={projects} testimonials={testimonials} />;
}
