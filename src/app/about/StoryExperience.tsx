"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ChefHat,
  Clock,
  Flame,
  Hammer,
  Leaf,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Wallet,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { wa } from "@/lib/whatsapp";

type StoryExperienceProps = {
  businessName: string;
  story: string | null;
  mission: string | null;
  vision: string | null;
  foundedNote: string | null;
  location: string;
  phone1: string;
  phone2: string | null;
  email: string | null;
  tiktokUrl: string | null;
  hours: string;
};

type StoryTab = {
  id: string;
  label: string;
  description: string;
  points: string[];
  Icon: LucideIcon;
};

const HIGHLIGHTS = [
  { title: "Stove Installation", subtitle: "Household & institutional", Icon: Flame, target: "stove-installation" },
  { title: "Ovens & Grills", subtitle: "Built for your kitchen", Icon: ChefHat, target: "ovens-grills" },
  { title: "Repairs", subtitle: "Home & institution", Icon: Wrench, target: "repairs" },
  { title: "Outdoor Kitchens", subtitle: "Structures & worktops", Icon: MapPin, target: "outdoor-kitchens" },
  { title: "Fabrication", subtitle: "Cooking solutions", Icon: Hammer, target: "fabrication" },
];

const OFFERINGS = [
  {
    id: "stove-installation",
    title: "Stove installation",
    text: "Modern household and institutional stoves, hotplates, fireless cookers, boilers and portable stoves.",
    Icon: Flame,
  },
  {
    id: "ovens-grills",
    title: "Ovens & grills",
    text: "Pizza and baking ovens, movable ovens, choma grills, fireplaces and bonfires.",
    Icon: ChefHat,
  },
  {
    id: "repairs",
    title: "Repairs",
    text: "Repair services for cooking equipment in households and institutions.",
    Icon: Wrench,
  },
  {
    id: "outdoor-kitchens",
    title: "Outdoor kitchens",
    text: "Outdoor kitchen structures and designs, worktops and tiling.",
    Icon: MapPin,
  },
  {
    id: "fabrication",
    title: "Fabrication",
    text: "Fabrication and supply of stoves, inserts, liners, boilers and cooking equipment.",
    Icon: Hammer,
  },
];

const VALUES = [
  {
    title: "Less firewood, less smoke",
    text: "Up to 75% less smoke, as reported by Esstofa. Results depend on stove model, installation, fuel and use. Efficient stoves can also use less firewood, cook faster and help save money.",
    Icon: Wind,
  },
  {
    title: "Firewood + charcoal",
    text: "Selected stove options work with either firewood or charcoal, giving households and institutions a choice of fuel and cooking approach.",
    Icon: Flame,
  },
  {
    title: "Install, test & follow up",
    text: "Installations are tested, with follow-up support and a warranty. We value quality materials and workmanship.",
    Icon: ShieldCheck,
  },
  {
    title: "24-hour mobile service",
    text: "We aim to be punctual and trustworthy, serving customers at the Kisumu workshop and at customer locations with customer satisfaction in mind.",
    Icon: Clock,
  },
  {
    title: "Training & flexible payment",
    text: "We provide customer training, flexible payment options and ongoing support, with a product catalogue to help explore available solutions.",
    Icon: Wallet,
  },
];

export default function StoryExperience({
  businessName,
  story,
  mission,
  vision,
  foundedNote,
  location,
  phone1,
  phone2,
  email,
  tiktokUrl,
  hours,
}: StoryExperienceProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [activeHighlight, setActiveHighlight] = useState(0);
  useEffect(() => {
    const root = document.querySelector(".story-page");
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>("[data-story-reveal]");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    root.classList.add("story-motion-enabled");
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);
  const tabs: StoryTab[] = [
    {
      id: "craft",
      label: "Our Craft",
      description: mission ?? "We supply, retail, fabricate and install practical cooking solutions for homes, businesses and institutions.",
      points: ["Quality materials and workmanship", "Installation testing and follow-up", "Warranty support"],
      Icon: Hammer,
    },
    {
      id: "promise",
      label: "Our Promise",
      description: vision ?? "We work toward cleaner, more efficient kitchens for customers across Kenya and Africa.",
      points: ["Punctual and trustworthy service", "Available 24 hours", "Flexible payment options"],
      Icon: ShieldCheck,
    },
    {
      id: "planet",
      label: "Our Planet",
      description: "We support environmental conservation through more efficient cooking solutions that can use less firewood.",
      points: ["Options for firewood or charcoal", "Smoke-reduction claim is model- and use-dependent", "Customer training for informed use"],
      Icon: Leaf,
    },
  ];
  const ActiveTabIcon = tabs[activeTab].Icon;
  const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="story-page">
      <section className="story-hero" aria-labelledby="story-hero-title">
        <Image
          src="/images/image1.jpeg"
          alt="Esstofa outdoor cooking and stove installation at a covered kitchen"
          fill
          priority
          sizes="100vw"
          className="story-hero-image"
        />
        <div className="story-hero-overlay" aria-hidden="true" />
        <div className="story-container story-hero-content">
          <p className="story-eyebrow story-hero-eyebrow"><span />Our Story</p>
          <h1 id="story-hero-title">Cooking Smarter. Burning Less. Serving Africa.</h1>
          <p className="story-hero-summary">
            {businessName} supplies, retails and installs cooking solutions from Kisumu to customer locations.
          </p>
          <Link className="story-button" href="/quote">
            Request a Quote <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <a className="story-hero-scroll" href="#story-highlights" aria-label="Explore our services">
          <ArrowDownRight size={22} aria-hidden="true" />
        </a>
      </section>

      <nav className="story-container story-highlights" id="story-highlights" aria-label="Explore Esstofa services">
        {HIGHLIGHTS.map(({ title, subtitle, Icon, target }, index) => (
          <a
            key={target}
            className={`story-highlight${activeHighlight === index ? " is-active" : ""}`}
            href={`#${target}`}
            onClick={() => setActiveHighlight(index)}
            onFocus={() => setActiveHighlight(index)}
            onMouseEnter={() => setActiveHighlight(index)}
          >
            <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
            <span className="story-highlight-copy">
              <strong>{title}</strong>
              <small>{subtitle}</small>
            </span>
            {activeHighlight === index && (
              <span className="story-highlight-arrow" aria-hidden="true">
                <ArrowRight size={16} />
              </span>
            )}
          </a>
        ))}
      </nav>

      <section className="story-section story-why" aria-labelledby="story-why-title">
        <div className="story-container">
          <div className="story-section-heading story-centered">
            <p className="story-eyebrow"><span />Why Esstofa</p>
            <h2 id="story-why-title">Why Choose Esstofa?</h2>
            <p>Practical cooking solutions, attentive service and a focus on efficient kitchens.</p>
          </div>

          <div className="story-tabs" role="tablist" aria-label="Esstofa values">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                id={`story-tab-${tab.id}`}
                className={`story-tab${activeTab === index ? " is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeTab === index}
                aria-controls="story-tab-panel"
                tabIndex={activeTab === index ? 0 : -1}
                onClick={() => setActiveTab(index)}
                onKeyDown={(event) => {
                  let nextIndex: number | null = null;
                  if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
                  if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
                  if (event.key === "Home") nextIndex = 0;
                  if (event.key === "End") nextIndex = tabs.length - 1;
                  if (nextIndex !== null) {
                    event.preventDefault();
                    setActiveTab(nextIndex);
                    document.getElementById(`story-tab-${tabs[nextIndex].id}`)?.focus();
                  }
                }}
              >
                <span className="story-tab-dot" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div
            key={tabs[activeTab].id}
            id="story-tab-panel"
            className="story-tab-panel"
            role="tabpanel"
            aria-labelledby={`story-tab-${tabs[activeTab].id}`}
            tabIndex={0}
          >
            <span className="story-tab-icon"><ActiveTabIcon size={23} strokeWidth={1.7} aria-hidden="true" /></span>
            <div className="story-tab-copy">
              <h3>{tabs[activeTab].label}</h3>
              <p>{tabs[activeTab].description}</p>
              <ul>
                {tabs[activeTab].points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="story-section story-origin" aria-labelledby="story-origin-title">
        <div className="story-container">
          <div className="story-origin-grid" data-story-reveal>
            <div className="story-photo-stack" aria-label="Esstofa workshop photography">
              <div className="story-photo story-photo-main">
                <Image
                  src="/images/image1.jpeg"
                  alt="Covered outdoor kitchen with Esstofa cooking stoves and worktops"
                  fill
                  sizes="(max-width: 767px) 90vw, 45vw"
                  className="story-photo-image"
                />
              </div>
              <div className="story-photo story-photo-placeholder story-photo-top" aria-label="Photo placeholder: Esstofa stove installation">
                <Flame size={25} aria-hidden="true" />
                <span>Installation photo placeholder</span>
              </div>
              <div className="story-photo story-photo-placeholder story-photo-bottom" aria-label="Photo placeholder: Esstofa fabrication">
                <Hammer size={23} aria-hidden="true" />
                <span>Workshop photo placeholder</span>
              </div>
              <span className="story-photo-caption">Esstofa cooking space</span>
            </div>

            <div className="story-origin-copy">
              <p className="story-eyebrow"><span />Rooted in Kisumu</p>
              <h2 id="story-origin-title">Built Around Better Cooking.</h2>
              <p className="story-origin-lead">
                {story ?? `${businessName} is a Kisumu-based supplier, retailer and installer of stoves, ovens and outdoor kitchen solutions.`}
              </p>
              <p>
                Customers can visit the workshop, or the team can deliver and provide services at customer locations. Esstofa serves homes, businesses and institutions across Kenya and Africa.
              </p>
              <p>
                The work is focused on practical cooking equipment, quality materials and efficient solutions that can use less firewood and support environmental conservation.
              </p>
              {foundedNote && <p className="story-founded-note"><strong>Our background:</strong> {foundedNote}</p>}
            </div>
          </div>

          <div className="story-offerings" data-story-reveal>
            <div className="story-offerings-heading">
              <p className="story-eyebrow"><span />Our work</p>
              <h3>What We Make & Do</h3>
            </div>
            <div className="story-offerings-grid">
              {OFFERINGS.map(({ id, title, text, Icon }) => (
                <article className="story-offering" id={id} key={id}>
                  <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                  <h4>{title}</h4>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="story-section story-company" aria-labelledby="story-company-title">
        <div className="story-container story-company-grid">
          <div className="story-company-copy">
            <p className="story-eyebrow"><span />Esstofa Stove Works</p>
            <h2 id="story-company-title">A Stove Company With A Difference.</h2>
            <p>
              From Kisumu, we supply, retail and install cooking equipment, with workshop visits or mobile service at customer locations. Our team supports customers through installation, testing and follow-up.
            </p>
            <div className="story-founder">
              <span className="story-founder-mark"><Flame size={18} aria-hidden="true" /></span>
              <span><strong>[FOUNDER NAME]</strong><small>[TITLE]</small></span>
            </div>
          </div>

          <div className="story-info-grid">
            <InfoCard
              title="Who We Are"
              description="A Kisumu-based supplier, retailer and installer of cooking solutions."
              Icon={Flame}
              href="#story-origin-title"
              imageLabel="Company photo placeholder"
            />
            <InfoCard
              title="How We Work"
              description="Visit our workshop or request delivery and service at your location."
              Icon={Truck}
              href="#story-coverage"
              imageLabel="Mobile service photo placeholder"
            />
          </div>
        </div>
      </section>

      <section className="story-section story-values" aria-labelledby="story-values-title">
        <div className="story-watermark" aria-hidden="true"><Flame /></div>
        <div className="story-container story-values-layout">
          <div className="story-values-heading">
            <p className="story-eyebrow story-eyebrow-light"><span />Our difference</p>
            <h2 id="story-values-title">Efficient Stoves. Trusted Service.</h2>
            <a className="story-round-link" href="#story-coverage" aria-label="Go to contact and coverage">
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>

          <div className="story-values-grid">
            {VALUES.map(({ title, text, Icon }, index) => (
              <article className={`story-value-card${index === 0 ? " is-featured" : ""}`} key={title}>
                <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="story-coverage" id="story-coverage" aria-labelledby="story-coverage-title">
        <div className="story-container story-coverage-inner">
          <div>
            <p className="story-eyebrow"><span />Visit or call</p>
            <h2 id="story-coverage-title">Serving All Counties in Kenya and Across Africa.</h2>
            <p className="story-coverage-detail">
              Based in {location}. Open {hours}. Contact us to discuss delivery and service availability at your location.
            </p>
            <div className="story-contact-meta">
              {phone2 && <a href={phoneHref(phone2)}>{phone2}</a>}
              {email && <a href={`mailto:${email}`}>{email}</a>}
              {tiktokUrl
                ? <a href={tiktokUrl} target="_blank" rel="noopener noreferrer">TikTok: Esstofa Stove Works</a>
                : <span>TikTok: Esstofa Stove Works</span>}
            </div>
          </div>
          <div className="story-coverage-actions">
            <a className="story-button" href={phoneHref(phone1)}>
              <Phone size={17} aria-hidden="true" /> Call {phone1}
            </a>
            <a
              className="story-button story-button-outline"
              href={wa(phone1, "Hello Esstofa, I would like to know more about your services.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us <ArrowRight size={17} aria-hidden="true" />
            </a>
            {phone2 && <a className="story-secondary-phone" href={phoneHref(phone2)}>Or call {phone2}</a>}
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  title,
  description,
  Icon,
  href,
  imageLabel,
}: {
  title: string;
  description: string;
  Icon: LucideIcon;
  href: string;
  imageLabel: string;
}) {
  return (
    <article className="story-info-card">
      <div className="story-info-image" aria-label={imageLabel}>
        <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
        <span>{imageLabel}</span>
      </div>
      <div className="story-info-copy">
        <p className="story-info-label">{title}</p>
        <p>{description}</p>
        <a className="story-info-arrow" href={href} aria-label={`Learn more: ${title}`}>
          <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
