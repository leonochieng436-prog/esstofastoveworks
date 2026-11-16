import Link from "next/link";
import type { LegalPolicySlug } from "@/lib/legal-content";

type Block =
  | { kind: "heading"; level: 2 | 3; text: string; id: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] };

type LegalArticleProps = {
  slug: LegalPolicySlug;
  title: string;
  content: string;
  updatedAt: Date | null;
  revision: number;
  tocExtras?: { id: string; title: string }[];
  children?: React.ReactNode;
};

const SOURCES: Record<LegalPolicySlug, { label: string; href: string }[]> = {
  "privacy-policy": [
    { label: "Kenya Law — official laws of Kenya", href: "https://new.kenyalaw.org/legislation/" },
    { label: "ODPC — rights of a data subject", href: "https://www.odpc.go.ke/rights-of-a-data-subject/" },
    { label: "Office of the Data Protection Commissioner", href: "https://www.odpc.go.ke/" },
  ],
  "cookie-policy": [
    { label: "Kenya Law — official laws of Kenya", href: "https://new.kenyalaw.org/legislation/" },
    { label: "Office of the Data Protection Commissioner", href: "https://www.odpc.go.ke/" },
  ],
  "terms-and-conditions": [
    { label: "Kenya Law — official laws of Kenya", href: "https://new.kenyalaw.org/legislation/" },
  ],
};

function headingId(text: string, used: Map<string, number>) {
  const base = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
  const count = used.get(base) ?? 0;
  used.set(base, count + 1);
  return count ? `${base}-${count + 1}` : base;
}

function parseContent(content: string): Block[] {
  const blocks: Block[] = [];
  const usedIds = new Map<string, number>();
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ kind: "list", items: list });
    list = [];
  };

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    const heading = /^(##|###)\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const text = heading[2].trim();
      blocks.push({
        kind: "heading",
        level: heading[1] === "##" ? 2 : 3,
        text,
        id: headingId(text, usedIds),
      });
    } else if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2).trim());
    } else if (!line) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

export default function LegalArticle({
  slug,
  title,
  content,
  updatedAt,
  revision,
  tocExtras = [],
  children,
}: LegalArticleProps) {
  const blocks = parseContent(content);
  const headings = blocks.filter((block): block is Extract<Block, { kind: "heading" }> => block.kind === "heading");
  const date = updatedAt
    ? new Intl.DateTimeFormat("en-KE", { dateStyle: "long", timeZone: "Africa/Nairobi" }).format(updatedAt)
    : "16 November 2026";

  return (
    <div className="legal-page" id="top">
      <header className="legal-heading">
        <p className="eyebrow"><span />Esstofa Stove Works</p>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: {date}{revision > 0 ? ` · Revision ${revision}` : ""}</p>
      </header>

      <div className="legal-layout">
        <aside className="legal-toc">
          <h2>On this page</h2>
          <nav aria-label={`${title} contents`}>
            {headings.map((heading) => (
              <a
                className={heading.level === 3 ? "legal-toc-sub" : undefined}
                href={`#${heading.id}`}
                key={heading.id}
              >
                {heading.text}
              </a>
            ))}
            {tocExtras.map((item) => <a href={`#${item.id}`} key={item.id}>{item.title}</a>)}
          </nav>
        </aside>

        <article className="legal-content">
          {blocks.map((block, index) => {
            if (block.kind === "heading") {
              return block.level === 2
                ? <h2 id={block.id} key={`${block.id}-${index}`}>{block.text}</h2>
                : <h3 id={block.id} key={`${block.id}-${index}`}>{block.text}</h3>;
            }
            if (block.kind === "list") {
              return <ul key={`list-${index}`}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
            }
            return <p key={`paragraph-${index}`}>{block.text}</p>;
          })}
          {children}

          <section className="legal-sources" aria-labelledby="legal-sources-title">
            <h2 id="legal-sources-title">Official resources</h2>
            <ul>
              {SOURCES[slug].map((source) => (
                <li key={source.href}>
                  <Link href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <Link className="legal-back-top" href="#top">Back to top ↑</Link>
          <p className="legal-review-note">
            These website policies are informational and should be reviewed by a qualified Kenyan legal professional before publication.
          </p>
        </article>
      </div>
    </div>
  );
}
