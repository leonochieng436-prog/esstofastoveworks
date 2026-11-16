import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { serviceIconForName } from "../src/lib/service-icons";
const db = new PrismaClient();
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const cats = ["Multipurpose portable jikos","Modern household stoves","Institutional cooking stoves","Firewood and charcoal stoves","Stove inserts and liners","Boilers","Movable ovens","Pizza ovens","Baking ovens","Choma grills","Hotplates","Fireplaces","Bonfire installations","Fireless cookers","Portable cooking stoves"];
const services = ["Modern stove installation","Pizza oven installation","Baking oven installation","Choma grill fabrication and installation","Hotplate installation","Fireplace construction and installation","Institutional stove installation","Fireless cooker supply and installation","Outdoor kitchen structures and designs","Kitchen worktops","Tiling services","Stove and oven repairs","Boiler installation","Custom metal fabrication","Household and institutional cooking solutions","Maintenance, testing and follow-up"];
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding the admin account.");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  const passwordHash = await bcrypt.hash(password, 12);
  await db.adminUser.upsert({ where: { email }, update: { passwordHash }, create: { email, name: "Admin", role: "ADMIN", passwordHash } });
  await db.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { businessName: "Esstofa Stove Works", phone1: "0745017194", phone2: "0727877452", email: "Reaganomondi2022@gmail.com", location: "Kisumu, Kenya" } });
  for (const n of cats) {
    const c = await db.productCategory.upsert({ where: { slug: slug(n) }, update: {}, create: { name: n, slug: slug(n) } });
    await db.product.upsert({ where: { slug: slug(n) + "-sample" }, update: {}, create: { slug: slug(n) + "-sample", name: `${n} (sample listing)`, categoryId: c.id, isSample: true, featured: true,
      description: "Sample listing. Replace with verified product details, photos, sizes and pricing in the admin.", features: ["Details to be confirmed by Esstofa"] } });
  }
  for (const [i, n] of services.entries()) await db.service.upsert({ where: { slug: slug(n) }, update: {}, create: { slug: slug(n), name: n, position: i, icon: serviceIconForName(n), description: `${n} by the Esstofa team. Scope, materials and timelines are agreed with you after a consultation or site visit.`, benefits: ["Consultation before work starts", "Testing and follow-up after installation", "Workshop, mobile or on-site service"] } });
}
main().finally(() => db.$disconnect());
