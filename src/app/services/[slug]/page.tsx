import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { getSite, wa } from "@/lib/site";
import { GALLERY_CATEGORIES } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

function galleryCategoriesFor(name: string) {
  const value = name.toLowerCase();
  if (value.includes("pizza")) return ["Pizza Ovens"];
  if (value.includes("fireless cooker")) return ["Portable Stoves"];
  if (value.includes("institutional")) return ["Institutional Stoves"];
  if (value.includes("outdoor")) return ["Outdoor Kitchens"];
  if (value.includes("fireplace")) return ["Fireplaces"];
  if (value.includes("choma") || value.includes("grill")) return ["Choma Grills"];
  if (value.includes("boiler")) return ["Boilers"];
  if (value.includes("repair") || value.includes("maintenance")) return ["Repairs and Renovations"];
  if (value.includes("fabrication") || value.includes("worktop") || value.includes("tiling")) return ["Custom Fabrication"];
  if (value.includes("baking")) return ["Baking Ovens"];
  if (value.includes("oven")) return ["Baking Ovens", "Pizza Ovens"];
  if (value.includes("hotplate")) return ["Modern Household Stoves"];
  if (value.includes("stove")) return ["Modern Household Stoves", "Institutional Stoves", "Portable Stoves"];
  return GALLERY_CATEGORIES.filter((category) => value.includes(category.toLowerCase()));
}

function validFaqs(value: unknown): { question: string; answer: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) return [];
    if (!("question" in entry) || !("answer" in entry)) return [];
    return typeof entry.question === "string" && typeof entry.answer === "string"
      ? [{ question: entry.question, answer: entry.answer }]
      : [];
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await db.service.findFirst({
    where: { slug, visible: true },
    select: { slug: true, name: true, description: true, longDescription: true, imageUrl: true },
  });
  if (!service) return {};
  const description = (service.longDescription || service.description).replace(/\s+/g, " ").slice(0, 160);
  return {
    title: service.name,
    description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.name,
      description,
      url: `/services/${service.slug}`,
      type: "website",
      ...(service.imageUrl ? { images: [{ url: service.imageUrl, alt: service.name }] } : {}),
    },
  };
}

export default async function ServiceDetail({ params }: Props) {
  const { slug } = await params;
  const service = await db.service.findUnique({ where: { slug } });
  if (!service || !service.visible) notFound();

  const site = await getSite();
  const categories = galleryCategoriesFor(service.name);
  const [projects, related] = await Promise.all([
    categories.length
      ? db.galleryProject.findMany({
          where: { category: { in: categories } },
          include: { images: { where: { kind: "PHOTO" }, orderBy: { position: "asc" }, take: 1 } },
          orderBy: { createdAt: "desc" },
          take: 6,
        })
      : Promise.resolve([]),
    db.service.findMany({
      where: { visible: true, id: { not: service.id } },
      orderBy: [{ position: "asc" }, { name: "asc" }],
      take: 3,
      select: { id: true, slug: true, name: true, description: true },
    }),
  ]);
  const faqs = validFaqs(service.faqs);
  const description = service.longDescription || service.description;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description,
    serviceType: service.name,
    provider: { "@type": "LocalBusiness", name: "Esstofa Stove Works" },
    areaServed: { "@type": "Country", name: "Kenya" },
  };
  const safeJsonLd = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <div className="services-page-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd }} />
      <section className="service-detail-hero relative isolate overflow-hidden bg-char text-white">
        {service.imageUrl ? (
          <Image src={service.imageUrl} alt={`${service.name} by Esstofa Stove Works`} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="services-photo-placeholder" aria-label="Esstofa service photo coming soon">
            <span>Service photo coming soon</span>
          </div>
        )}
        <div className="services-hero-shade" aria-hidden="true" />
        <div className="service-detail-hero-inner relative mx-auto flex max-w-7xl flex-col justify-center">
          <nav aria-label="Breadcrumb" className="mb-7 text-sm text-white/75">
            <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href="/services" className="underline-offset-4 hover:underline">Services</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page">{service.name}</span>
          </nav>
          <p className="eyebrow !text-white"><span />Esstofa service</p>
          <h1 className="mt-3 max-w-4xl font-semibold">{service.name}</h1>
          <p className="mt-4 max-w-2xl text-white/85">{service.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/quote" className="btn !bg-emberdark hover:!bg-white hover:!text-char">Request a Quote</Link>
            <Link href={`/book?service=${encodeURIComponent(service.name)}`} className="btn-o !border-white/75 !text-white hover:!bg-white/10">Book This Service</Link>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <Link href="/services" className="mb-8 inline-flex min-h-11 items-center gap-2 font-semibold text-emberdark underline-offset-4 hover:underline">
          <ArrowLeft aria-hidden="true" size={17} />All Services
        </Link>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:gap-8">
          <div>
            <p className="eyebrow"><span />About this service</p>
            <h2 className="mt-3 font-semibold">Planned around your needs</h2>
            <div className="mt-5 space-y-4 leading-7 text-char/80">
              {description.split(/\n{2,}/).map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>)}
            </div>
            {service.benefits.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-semibold">What to expect</h3>
                <ul className="mt-4 space-y-3">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 leading-6">
                      <Check aria-hidden="true" size={18} className="mt-1 shrink-0 text-emberdark" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <aside className="h-fit rounded-card border border-char/10 bg-white p-4 sm:p-5">
            <p className="eyebrow"><span />Service options</p>
            <h2 className="mt-3 font-semibold">Where we can help</h2>
            <ul className="mt-5 space-y-3">
              {service.locations.split(/[,;]+/).map((option) => option.trim()).filter(Boolean).map((option) => (
                <li key={option} className="flex items-start gap-3 text-sm leading-6">
                  <MapPin aria-hidden="true" size={17} className="mt-1 shrink-0 text-emberdark" />{option}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-char/10 pt-5 text-sm leading-6 text-char/70">
              Service scope and availability are discussed with you before a booking is confirmed.
            </p>
          </aside>
        </div>
      </section>

      {projects.some((project) => project.images.length > 0) && (
        <section className="bg-white">
          <div className="section-wrap">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow"><span />Real Esstofa work</p>
                <h2 className="section-title mt-4">Related <span className="text-emberdark">Projects</span></h2>
              </div>
              <Link href={`/gallery?category=${encodeURIComponent(categories[0])}`} className="text-link">View Gallery <ArrowRight aria-hidden="true" size={17} /></Link>
            </div>
            <div className="gallery-grid mt-6">
              {projects.filter((project) => project.images.length > 0).map((project) => (
                <article key={project.id} className="overflow-hidden rounded-card border border-char/10 bg-ash">
                  <div className="relative aspect-square max-h-[280px]">
                    <Image src={project.images[0].url} alt={project.images[0].alt || project.title} fill sizes="(max-width: 767px) 40vw, (max-width: 1199px) 30vw, 25vw" className="object-cover transition-transform duration-500 hover:scale-[1.03]" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-emberdark">{project.category}</p>
                    <h3 className="mt-2 font-semibold">{project.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="section-wrap">
          <p className="eyebrow"><span />Helpful details</p>
          <h2 className="section-title mt-4">Frequently Asked <span className="text-emberdark">Questions</span></h2>
          <div className="mt-8 max-w-3xl divide-y divide-char/15 border-y border-char/15">
            {faqs.map((faq) => (
              <details key={faq.question} className="py-5">
                <summary className="min-h-11 cursor-pointer py-2 text-base font-semibold">{faq.question}</summary>
                <p className="max-w-2xl pb-2 leading-7 text-char/75">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="bg-white">
          <div className="section-wrap">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow"><span />More from Esstofa</p>
                <h2 className="section-title mt-4">Related <span className="text-emberdark">Services</span></h2>
              </div>
              <Link href="/services" className="text-link">All Services <ArrowRight aria-hidden="true" size={17} /></Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.id} href={`/services/${item.slug}`} className="group rounded-card border border-char/10 bg-ash p-4 transition hover:border-emberdark/40 hover:bg-white focus-visible:bg-white">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-char/70">{item.description}</p>
                  <span className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-emberdark">Learn More <ArrowRight aria-hidden="true" size={17} className="transition-transform group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="services-final-cta">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 md:px-6 md:py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow !text-white/80"><span />Take the next step</p>
            <h2 className="mt-3 font-semibold">Discuss {service.name}</h2>
            <p className="mt-3 leading-7 text-white/85">A booking is a request, not a confirmed appointment until the Esstofa team confirms it.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/quote" className="btn !bg-white !text-char hover:!bg-char hover:!text-white">Request a Quote</Link>
            <Link href={`/book?service=${encodeURIComponent(service.name)}`} className="btn-o !border-white/75 !text-white hover:!bg-white/10">Book This Service</Link>
            <a href={wa(site.phone1, `Hello Esstofa, I am interested in ${service.name}.`)} className="btn-o !border-white/75 !text-white hover:!bg-white/10">WhatsApp Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
