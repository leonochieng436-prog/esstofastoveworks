import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  CookingPot,
  MapPin,
  Truck,
  Wrench,
} from "lucide-react";
import { ProductCard } from "@/components/Cards";

type ImageAsset = { url: string; alt: string };
type Product = {
  slug: string;
  name: string;
  description: string;
  priceKes: number | null;
  category: { name: string };
  images: ImageAsset[];
};
type Service = {
  id: string;
  slug: string;
  name: string;
  description: string;
};
type Project = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  location: string | null;
  images: ImageAsset[];
};
type Testimonial = {
  id: string;
  name: string;
  body: string;
  location: string | null;
};

const HERO_IMAGE: ImageAsset = {
  url: "/images/image1.jpeg",
  alt: "Brick cooking stoves in a covered kitchen.",
};

const FEATURES = [
  {
    icon: Clock3,
    title: "24-hour service",
    description: "Support and service enquiries are welcome around the clock.",
  },
  {
    icon: MapPin,
    title: "Nationwide coverage",
    description: "Serving homes, businesses and institutions across Kenya.",
  },
  {
    icon: Truck,
    title: "Mobile installation",
    description: "On-site visits and installation options for your project.",
  },
  {
    icon: Wrench,
    title: "Quality fabrication",
    description: "Practical cooking solutions built with care and tested after installation.",
  },
];

const BENEFITS = [
  "Reduced firewood consumption",
  "Improved cooking efficiency",
  "Smoke reduction",
  "Quality workmanship and customer follow-up",
];

const PROCESS = [
  {
    title: "Tell us what you need",
    description: "We discuss your kitchen, cooking needs and project requirements.",
  },
  {
    title: "Plan and build",
    description: "We fabricate in our workshop or prepare for an on-site installation.",
  },
  {
    title: "Install and test",
    description: "We test the cooking solution after installation.",
  },
  {
    title: "Get ongoing support",
    description: "We provide customer guidance and follow-up after the work is done.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span aria-hidden="true" />
      {children}
    </p>
  );
}

function SectionTitle({
  eyebrow,
  children,
  description,
  className = "",
}: {
  eyebrow: string;
  children: React.ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="section-title mt-4">{children}</h2>
      {description && <p className="mt-3 max-w-2xl text-body text-char/70">{description}</p>}
    </div>
  );
}

function Photo({
  image,
  className,
  priority = false,
}: {
  image?: ImageAsset;
  className: string;
  priority?: boolean;
}) {
  if (!image) {
    return (
      <div className={`photo-placeholder ${className}`} aria-hidden="true">
        <CookingPot className="h-12 w-12 text-ember" strokeWidth={1.2} />
      </div>
    );
  }

  return (
    <img
      src={image.url}
      alt={image.alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: (typeof FEATURES)[number]) {
  return (
    <article className="feature-card group">
      <Icon aria-hidden="true" className="h-5 w-5 text-ember" strokeWidth={1.5} />
      <h3 className="mt-4 font-display font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-char/70">{description}</p>
      <ArrowUpRight aria-hidden="true" className="feature-card-arrow" size={18} />
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const image = project.images[0];
  return (
    <Link
      href="/gallery"
      className="project-card group"
      aria-label={`View ${project.title} in the project gallery`}
    >
      <div className="project-card-image">
        <Photo image={image} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        <span className="project-card-arrow" aria-hidden="true">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display font-semibold">{project.title}</h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-emberdark">
            {project.category}{project.location && ` · ${project.location}`}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function StudioHome({
  products,
  services,
  projects,
  testimonials,
}: {
  products: Product[];
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
}) {
  const featureImage =
    projects.find((project) => project.images[0])?.images[0] ??
    products.find((product) => product.images[0])?.images[0];
  const heroImage = HERO_IMAGE;
  const processImages = [
    products[0]?.images[0],
    projects[0]?.images[0],
    projects[1]?.images[0],
    projects[2]?.images[0],
  ];

  return (
    <>
      <section className="hero-section">
        <div className="hero-image" aria-hidden="true">
          {heroImage ? (
            <Photo image={heroImage} className="h-full w-full object-cover" priority />
          ) : (
            <div className="hero-image-fallback" />
          )}
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-copy">
            <Eyebrow>Kisumu, Kenya · Serving all 47 counties</Eyebrow>
            <h1 className="mt-3 max-w-3xl font-display font-semibold tracking-tight">
              Modern cooking solutions, <span className="text-ember">made to work.</span>
            </h1>
            <p className="mt-3 max-w-xl text-white/80">
              We supply, fabricate, install and maintain practical cooking solutions for homes,
              businesses, institutions and commercial kitchens.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
              <Link href="/products" className="btn">
                Explore our catalogue <ArrowUpRight className="ml-2" size={17} />
              </Link>
              <Link href="/book" className="hero-text-link">
                Book a service <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="hero-stat" aria-label="Serving all 47 counties in Kenya">
            <span className="hero-stat-value font-display font-semibold text-ember">47</span>
            <span className="mt-1 block text-xs font-medium uppercase tracking-[0.16em] text-white/75">counties served</span>
            <span className="mt-4 block h-px w-10 bg-white/40" />
            <span className="mt-3 block text-sm text-white/80">Built for better everyday cooking</span>
          </div>
          <a href="#intro" className="hero-scroll" aria-label="Scroll to discover Esstofa">
            <ArrowDown size={16} />
          </a>
        </div>
      </section>

      <section id="intro" className="section-wrap">
        <SectionTitle
          eyebrow="Esstofa Stove Works"
          className="mx-auto max-w-3xl text-center"
          description="Reliable products and responsive service, shaped around the way people cook."
        >
          Better kitchens start with <span className="text-ember">the right solution.</span>
        </SectionTitle>
        <div className="feature-grid mt-6">
          {FEATURES.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
        </div>
      </section>

      <section className="dark-feature">
        <div className="dark-feature-inner">
          <div className="dark-feature-copy">
            <Eyebrow>Made for everyday life</Eyebrow>
            <h2 className="section-title mt-5 text-white">
              Where better cooking <span className="text-ember">comes alive.</span>
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-white/70">
              From a family kitchen to a busy institution, we bring practical cooking solutions
              together with dependable installation and support.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm leading-6 text-white/85">
                  <Check aria-hidden="true" className="mt-1 shrink-0 text-ember" size={16} />
                  {benefit}
                </li>
              ))}
            </ul>
            <Link href="/about" className="hero-text-link mt-8">
              Get to know us <ArrowRight size={16} />
            </Link>
          </div>
          <div className="dark-feature-media">
            <Photo image={featureImage} className="h-full w-full object-cover" />
            <div className="dark-image-caption">
              <span className="text-xs uppercase tracking-[0.16em] text-white/70">Designed around your needs</span>
              <span className="mt-2 block font-display text-lg font-semibold">Cooking made practical.</span>
            </div>
          </div>
        </div>
        <span className="ghost-wordmark" aria-hidden="true">ESSTOFA</span>
      </section>

      {services.length > 0 && (
        <section id="services" className="section-wrap">
          <div className="grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
            <div className="service-feature-image">
              <Photo image={featureImage} className="h-full w-full object-cover" />
              <div className="service-image-caption">
                <Eyebrow>From workshop to your kitchen</Eyebrow>
                <p className="mt-2 font-display text-lg font-semibold">A complete service, from start to finish.</p>
              </div>
            </div>
            <div>
              <SectionTitle eyebrow="What we do">
                Explore our <span className="text-ember">services.</span>
              </SectionTitle>
              <div className="mt-7 divide-y divide-char/15 border-y border-char/15">
                {services.map((service, index) => (
                  <Link
                    key={service.id}
                    href={`/services#${service.slug}`}
                    className={`service-row ${index === 0 ? "service-row-active" : ""}`}
                  >
                    <span className="min-w-0">
                      <span className="block font-display text-base font-semibold">{service.name}</span>
                      <span className="mt-1 block text-sm leading-6 text-char/65">{service.description}</span>
                    </span>
                    <ArrowUpRight aria-hidden="true" className="shrink-0" size={20} />
                  </Link>
                ))}
              </div>
              <Link href="/services" className="text-link mt-5">
                View all services <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="stats-band" aria-label="Esstofa at a glance">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">47</span>
            <span className="stat-label">counties across Kenya</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">24h</span>
            <span className="stat-label">service enquiries welcome</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">75%*</span>
            <span className="stat-label">less smoke, as reported by Esstofa</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">Kisumu</span>
            <span className="stat-label">our home base in Kenya</span>
          </div>
        </div>
        <p className="stats-note">
          *Business-reported performance claim. Results vary by stove, installation, fuel and use;
          this is not an independently verified guarantee.
        </p>
      </section>

      <section className="section-wrap process-section">
        <div className="process-heading">
          <SectionTitle eyebrow="How it works">
            A clear process. <span className="text-ember">A better result.</span>
          </SectionTitle>
          <p className="max-w-md leading-7 text-char/70">
            From the first conversation through installation and follow-up, we help you find a
            practical fit for your kitchen.
          </p>
        </div>
        <div className="process-grid">
          {PROCESS.map((step, index) => (
            <article key={step.title} className="process-card">
              <div className="process-image">
                <Photo image={processImages[index]} className="h-full w-full object-cover" />
                <span className="process-number">{`0${index + 1}`}</span>
              </div>
              <h3 className="mt-4 font-display font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-char/70">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      {products.length > 0 && (
        <section className="section-wrap bg-white">
          <div className="section-heading-row">
            <SectionTitle eyebrow="Our catalogue">
              Cooking solutions for <span className="text-ember">your space.</span>
            </SectionTitle>
            <Link href="/products" className="text-link hidden sm:inline-flex">
              Browse all products <ArrowRight size={16} />
            </Link>
          </div>
          <div className="product-grid mt-6">
            {products.slice(0, 3).map((product) => <ProductCard key={product.slug} p={product} />)}
          </div>
          <Link href="/products" className="text-link mt-6 sm:hidden">
            Browse all products <ArrowRight size={16} />
          </Link>
        </section>
      )}

      {projects.length > 0 && (
        <section className="section-wrap relative overflow-hidden">
          <span className="section-ghost" aria-hidden="true">WORK</span>
          <div className="section-heading-row relative z-10">
            <SectionTitle
              eyebrow="Selected projects"
              description="A look at real work from the Esstofa Stove Works project gallery."
            >
              Projects that <span className="text-ember">make a difference.</span>
            </SectionTitle>
            <Link href="/gallery" className="text-link hidden sm:inline-flex">
              View the gallery <ArrowRight size={16} />
            </Link>
          </div>
          <div className="project-track mt-6" role="region" aria-label="Recent projects" tabIndex={0}>
            {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
          <p className="mt-4 text-xs text-char/55 sm:hidden">Swipe to explore projects</p>
          <Link href="/gallery" className="text-link mt-6 sm:hidden">
            View the gallery <ArrowRight size={16} />
          </Link>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="section-wrap testimonial-section">
          <div className="testimonial-media">
            <Photo image={featureImage} className="h-full w-full object-cover" />
            <span className="testimonial-media-label">Esstofa Stove Works · Kisumu, Kenya</span>
          </div>
          <div className="testimonial-copy">
            <SectionTitle eyebrow="Customer stories">
              Here’s what our <span className="text-ember">customers say.</span>
            </SectionTitle>
            <div className="mt-7 space-y-6">
              {testimonials.slice(0, 3).map((testimonial) => (
                <figure key={testimonial.id} className="testimonial-quote">
                  <blockquote className="font-display text-lg leading-snug sm:text-xl">
                    “{testimonial.body}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-medium">
                    {testimonial.name}
                    {testimonial.location && <span className="font-normal text-char/60"> · {testimonial.location}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta-banner">
        <div className="cta-image" aria-hidden="true">
          <Photo image={projects[1]?.images[0] ?? featureImage} className="h-full w-full object-cover" />
        </div>
        <div className="cta-shade" aria-hidden="true" />
        <div className="cta-content">
          <div>
            <Eyebrow>Start a conversation</Eyebrow>
            <h2 className="section-title mt-3 max-w-3xl font-display font-semibold">
              Ready for a <span className="text-ember">better kitchen?</span>
            </h2>
          </div>
          <div className="mt-6 max-w-sm md:mt-0">
            <p className="leading-7 text-white/80">
              Tell us what you need. We’ll help you explore the right product, service or installation.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/quote" className="btn">Request a quote <ArrowUpRight className="ml-2" size={17} /></Link>
              <Link href="/contact" className="hero-text-link">Contact us <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
