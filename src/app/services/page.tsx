import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Hammer,
  MapPin,
  Phone,
  Truck,
} from "lucide-react";
import { db } from "@/lib/db";
import { getSite, wa } from "@/lib/site";
import { getServiceIcon } from "@/lib/service-icons";
import StatCount from "@/components/services/StatCount";
import ServiceVideoModal from "@/components/services/ServiceVideoModal";

export const metadata = {
  title: "Stove, Oven and Fabrication Services",
  description: "Supply, fabrication, installation, repair and maintenance of cooking systems across Kenya and Africa.",
  alternates: { canonical: "/services" },
};
export const dynamic = "force-dynamic";

const STEPS = [
  { title: "Consultation and requirements", Icon: ClipboardList },
  { title: "Design and fabrication", Icon: Hammer },
  { title: "Delivery and installation", Icon: Truck },
  { title: "Testing and follow-up", Icon: CheckCircle2 },
];

export default async function Services() {
  const [services, site] = await Promise.all([
    db.service.findMany({ where: { visible: true }, orderBy: [{ position: "asc" }, { name: "asc" }] }),
    getSite(),
  ]);
  const introPhotos = [...new Set([
    ...site.servicesIntroImages,
    ...services.map((service) => service.imageUrl).filter((image): image is string => Boolean(image)),
  ])].slice(0, 3);
  const stats = [
    { value: 47, suffix: "", label: "Counties served across Kenya" },
    { value: 24, suffix: "-Hour", label: "Service" },
    { value: services.length, suffix: "", label: "Visible services" },
  ];

  return (
    <div className="services-page-content">
      <section className="services-hero">
        {site.servicesHeroImage ? (
          <Image
            src={site.servicesHeroImage}
            alt="Esstofa Stove Works service photo"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="services-photo-placeholder" aria-label="Esstofa service photo coming soon">
            <span>Esstofa photo coming soon</span>
          </div>
        )}
        <div className="services-hero-shade" aria-hidden="true" />
        <div className="services-hero-inner">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/75">
            <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page">Services</span>
          </nav>
          <p className="eyebrow !text-white"><span />Esstofa Stove Works</p>
          <h1 className="mt-3 max-w-4xl font-semibold tracking-tight">
            Stove, Oven and Fabrication Services <span className="text-ember">You Can Rely On</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            From modern household stoves to institutional kitchens, we supply, fabricate, install, repair and maintain cooking systems across Kenya and Africa.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/quote" className="btn !bg-emberdark hover:!bg-white hover:!text-char">
              Request a Quote <ArrowRight aria-hidden="true" size={17} className="ml-2" />
            </Link>
            <Link href="/book" className="btn-o !border-white/75 !text-white hover:!bg-white/10">
              Book a Service
            </Link>
            {site.servicesHeroVideoUrl && <ServiceVideoModal videoUrl={site.servicesHeroVideoUrl} />}
          </div>
          <ArrowDownRight aria-hidden="true" className="absolute bottom-8 right-5 hidden text-white/70 sm:block lg:right-10" size={34} strokeWidth={1} />
        </div>
      </section>

      <section id="intro" className="section-wrap">
        <div className={`grid items-center gap-6 md:gap-8 ${introPhotos.length ? "md:grid-cols-2" : "mx-auto max-w-3xl"}`}>
          {introPhotos.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {introPhotos.map((photo, index) => (
                <div key={photo} className={`relative overflow-hidden rounded-card bg-char/10 ${introPhotos.length > 1 && index === 0 ? "row-span-2 aspect-[0.78]" : "aspect-[1.12]"}`}>
                  <Image
                    src={photo}
                    alt={`Esstofa Stove Works stove and oven service photo ${index + 1}`}
                    fill
                    sizes="(max-width: 767px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
              ))}
            </div>
          )}
          <div className={`relative rounded-card bg-emberdark p-4 text-white sm:p-6 ${introPhotos.length ? "md:-ml-12" : ""}`}>
            <p className="eyebrow !text-white"><span />What we do</p>
            <h2 className="mt-3 font-semibold">
              We Are Stove and Oven Specialists
            </h2>
            <p className="mt-3 text-white/90">
              We help homes, businesses and institutions plan cooking solutions for their space and needs. Our work spans supply, fabrication, installation, repairs and maintenance. Scope, materials and timing are agreed with you after a consultation or site visit.
            </p>
            <Link href="/contact" className="mt-7 inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-4 hover:text-white/80">
              Talk to Our Team <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-8 md:px-6 md:py-12" aria-label="Esstofa service facts">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="services-stat-item">
              <span className="service-stat-value block font-display font-semibold leading-none text-char">
                <StatCount value={stat.value} />{stat.suffix}
              </span>
              <span className="mt-3 block max-w-52 text-sm leading-6 text-char/70">{stat.label}</span>
            </div>
          ))}
          {site.servicesStatValue && site.servicesStatLabel && (
            <div className="services-stat-item">
              <span className="service-stat-value block font-display font-semibold leading-none text-char">{site.servicesStatValue}</span>
              <span className="mt-3 block max-w-52 text-sm leading-6 text-char/70">{site.servicesStatLabel}</span>
            </div>
          )}
        </div>
      </section>

      <section className="services-provided-section">
        {site.servicesHeroImage && (
          <>
            <Image src={site.servicesHeroImage} alt="" fill sizes="100vw" className="object-cover" />
            <div className="services-provided-image-shade" aria-hidden="true" />
          </>
        )}
        <div className="services-provided-pattern" aria-hidden="true" />
        <span className="services-watermark" aria-hidden="true">ESSTOFA</span>
        <div className="services-provided-inner">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow !text-white/75"><span />Made for your needs</p>
              <h2 className="section-title mt-3 text-white">Services We <span className="text-ember">Provide</span></h2>
              <p className="mt-3 max-w-2xl text-white/70">
                Explore our visible services. Contact us to discuss the scope, service location and requirements for your project.
              </p>
            </div>
            <Link href="/quote" className="btn shrink-0 !bg-white !text-char hover:!bg-emberdark hover:!text-white">
              Request a Quote <ArrowRight aria-hidden="true" size={17} className="ml-2" />
            </Link>
          </div>
          {services.length > 0 ? (
            <div className="services-card-grid">
              {services.map((service) => {
                const Icon = getServiceIcon(service.icon);
                return (
                  <article key={service.id} className="service-card">
                    <Icon aria-hidden="true" className="service-card-icon" size={24} strokeWidth={1.5} />
                    <h3 className="mt-6 font-semibold leading-tight">{service.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-char/70">{service.description}</p>
                    <Link href={`/services/${service.slug}`} className="service-card-link">
                      Learn More <ArrowRight aria-hidden="true" size={17} />
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="mt-8 rounded-card border border-white/20 p-4 text-white/85">Services are being updated. Contact our team to discuss your requirements.</p>
          )}
        </div>
      </section>

      <section className="section-wrap">
        <div className="process-heading">
          <div>
            <p className="eyebrow"><span />Our approach</p>
            <h2 className="section-title mt-4 max-w-3xl">How We <span className="text-emberdark">Work</span></h2>
          </div>
          <p className="max-w-xl leading-7 text-char/70">We agree the requirements and next steps with you before work begins.</p>
        </div>
        <ol className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {STEPS.map(({ title, Icon }, index) => (
            <li key={title} className="service-step-card">
              <span className="service-step-number">{String(index + 1).padStart(2, "0")}</span>
              <Icon aria-hidden="true" size={30} strokeWidth={1.5} className="text-emberdark" />
              <h3 className="mt-4 font-semibold leading-tight">{title}</h3>
            </li>
          ))}
        </ol>
      </section>

      <section className="services-coverage">
        <div className="services-coverage-inner">
          <div>
            <p className="eyebrow !text-white/75"><span />Coverage</p>
            <h2 className="mt-3 font-semibold">Where We <span className="text-ember">Work</span></h2>
            <p className="mt-3 max-w-2xl text-white/75">Choose the service option that suits your location and project. Availability is discussed with our team.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "Kisumu workshop",
              "Mobile service at homes",
              "Businesses and institutions",
              "Construction sites",
              "All 47 counties in Kenya",
              "Other African countries, subject to availability",
            ].map((place) => <span key={place} className="coverage-chip"><MapPin aria-hidden="true" size={15} />{place}</span>)}
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            {[site.phone1, site.phone2 ?? "0727877452"].filter((phone, index, list) => Boolean(phone) && list.indexOf(phone) === index).map((phone) => (
              <a key={phone} href={`tel:${phone}`} className="btn-o !border-white/60 !text-white hover:!bg-white/10">
                <Phone aria-hidden="true" size={17} className="mr-2" />{phone}
              </a>
            ))}
            <a href={wa(site.phone1, "Hello Esstofa, I am interested in your services.")} className="btn !bg-emberdark hover:!bg-white hover:!text-char">
              WhatsApp Us <ArrowRight aria-hidden="true" size={17} className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      <section className="services-final-cta">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 md:px-6 md:py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow !text-white/80"><span />Let’s get started</p>
            <h2 className="mt-3 font-semibold">Ready to Plan Your Project?</h2>
            <p className="mt-4 leading-7 text-white/85">A booking is a request and is not a confirmed appointment until our team contacts you to confirm.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/book" className="btn !bg-white !text-char hover:!bg-char hover:!text-white">Book a Service</Link>
            <Link href="/quote" className="btn-o !border-white/75 !text-white hover:!bg-white/10">Request a Quote</Link>
            <a href={wa(site.phone1, "Hello Esstofa, I am interested in your services.")} className="btn-o !border-white/75 !text-white hover:!bg-white/10">WhatsApp Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
