"use client";

import { useRef, useState } from "react";
import { Play, X } from "lucide-react";

function getVideoSource(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch (error) {
    if (error instanceof TypeError) return null;
    throw error;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();
  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return id ? { type: "embed" as const, src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1` } : null;
  }
  if (host === "youtube.com" || host === "www.youtube.com" || host === "m.youtube.com") {
    const id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
    return id ? { type: "embed" as const, src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1` } : null;
  }
  if (host === "vimeo.com" || host === "www.vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.match(/\/(\d+)(?:\/|$)/)?.[1];
    return id ? { type: "embed" as const, src: `https://player.vimeo.com/video/${id}?autoplay=1` } : null;
  }
  if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) return { type: "video" as const, src: url.href };
  return null;
}

export default function ServiceVideoModal({ videoUrl }: { videoUrl: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const source = getVideoSource(videoUrl);
  if (!source) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          dialog.current?.showModal();
          setIsOpen(true);
        }}
        aria-label="Play Esstofa services video"
        className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/80 text-white transition-colors hover:bg-white hover:text-char"
      >
        <Play aria-hidden="true" size={20} fill="currentColor" />
      </button>
      <dialog ref={dialog} aria-labelledby="services-video-title" onClose={() => setIsOpen(false)} className="service-video-dialog">
        <div className="flex items-center justify-between gap-4 border-b border-char/10 px-4 py-3 sm:px-6">
          <h2 id="services-video-title" className="text-xl">Esstofa Stove Works services</h2>
          <button type="button" onClick={() => dialog.current?.close()} className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-char/5" aria-label="Close video">
            <X aria-hidden="true" size={20} />
          </button>
        </div>
        {isOpen && <div className="aspect-video bg-char">
          {source.type === "embed" ? (
            <iframe
              src={source.src}
              title="Esstofa Stove Works services video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          ) : (
            <video src={source.src} controls autoPlay className="h-full w-full" />
          )}
        </div>}
      </dialog>
    </>
  );
}
