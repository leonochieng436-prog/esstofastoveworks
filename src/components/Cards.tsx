import Link from "next/link";
import { ArrowUpRight, CookingPot } from "lucide-react";

export function ProductCard({
  p,
}: {
  p: {
    slug: string;
    name: string;
    description: string;
    priceKes: number | null;
    category?: { name: string };
    images: { url: string; alt: string }[];
  };
}) {
  const image = p.images[0];

  return (
    <Link
      href={`/products/${p.slug}`}
      className="group block overflow-hidden rounded-card border border-char/10 bg-white transition-colors hover:border-ember/50"
    >
      <div className="aspect-[4/5] max-h-[280px] overflow-hidden bg-ash">
        {image ? (
          <img
            src={image.url}
            alt={image.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="photo-placeholder h-full w-full" aria-hidden="true">
            <CookingPot className="h-12 w-12 text-ember" strokeWidth={1.2} />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-caption font-medium uppercase tracking-[0.12em] text-emberdark">{p.category?.name}</p>
        <h3 className="mt-2 line-clamp-2 font-display font-semibold">{p.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-char/70">{p.description}</p>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-char/10 pt-3 text-sm font-semibold">
          <span>{p.priceKes ? `KES ${p.priceKes.toLocaleString()}` : "Request a quote"}</span>
          <span className="inline-flex items-center gap-1 text-emberdark">
            View details <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
