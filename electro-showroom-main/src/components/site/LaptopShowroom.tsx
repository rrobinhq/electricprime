import { Link } from "@tanstack/react-router";
import { images } from "@/lib/products";
import { currency } from "@/lib/format";
import { useStoreContent } from "@/lib/content-store";
import { range, useReducedMotion, useScrollProgress } from "@/lib/motion";

const CHAPTERS = [
  {
    at: 0,
    face: "Front",
    title: "The display",
    body: '16.2" XDR at 120Hz, 1,600 nits peak, factory-calibrated to ΔE < 1.',
  },
  {
    at: 0.28,
    face: "Deck",
    title: "The deck",
    body: "Gasket-mounted keys with 1.1 mm travel over a machined unibody deck.",
  },
  {
    at: 0.55,
    face: "Side",
    title: "The I/O",
    body: "3× Thunderbolt 5 at 120 Gb/s, HDMI 2.1, SDXC, MagLink — 11.2 mm thin.",
  },
  {
    at: 0.8,
    face: "Rear",
    title: "The thermal core",
    body: "Dual vapour chambers exhaust through a 0.4 mm rear vent array.",
  },
];

/** Laptop showroom: the product stays anchored, the camera orbits on scroll. */
export function LaptopShowroom() {
  const { content } = useStoreContent();
  const laptop = content.products[0];
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const reduced = useReducedMotion();
  const p = reduced ? 0.2 : progress;

  const rotY = -14 + p * 200;
  const rotX = 10 - p * 16;
  const zoom = 1 + Math.sin(p * Math.PI) * 0.14;
  const active = CHAPTERS.reduce((acc, c, i) => (p >= c.at - 0.02 ? i : acc), 0);

  if (!laptop) return null;

  return (
    <div ref={ref} className="relative h-[400vh] border-t border-border">
      <section className="sticky top-0 h-dvh overflow-hidden bg-background">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(80% 60% at ${20 + p * 60}% 40%, oklch(0.3 0.012 260), oklch(0.14 0.005 260) 70%)`,
          }}
        />
        <div className="relative mx-auto grid h-full max-w-[1600px] grid-rows-[auto_1fr_auto] px-6 pb-10 pt-24 lg:px-12">
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <p className="eyebrow">Chapter 01 — Laptops</p>
              <h2 className="mt-3 text-4xl sm:text-5xl">The machine, examined</h2>
            </div>
            <div className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground sm:block">
              {String(active + 1).padStart(2, "0")} / 04 · {CHAPTERS[active]!.face}
            </div>
          </header>

          <div className="perspective-stage relative flex items-center justify-center">
            <div
              className="absolute h-[46vmin] w-[80vmin] rounded-full bg-signal/10 blur-3xl"
              style={{ transform: `scale(${zoom})` }}
            />
            <img
              src={images.heroLaptop}
              alt={`${laptop.name} rotating to reveal its ${CHAPTERS[active]!.face.toLowerCase()}`}
              loading="lazy"
              width={1600}
              height={1104}
              className="relative w-[min(1000px,92vw)] product-shadow"
              style={{
                transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${zoom})`,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            />

            {/* contextual info follows the rotation */}
            <div className="pointer-events-none absolute inset-0 flex items-center">
              {CHAPTERS.map((c, i) => {
                const t = range(p, c.at, c.at + 0.14) * (1 - range(p, c.at + 0.2, c.at + 0.28));
                return (
                  <div
                    key={c.title}
                    className="absolute max-w-sm"
                    style={{
                      left: i % 2 === 0 ? "2%" : "auto",
                      right: i % 2 === 0 ? "auto" : "2%",
                      top: `${18 + i * 16}%`,
                      opacity: t,
                      transform: `translateY(${(1 - t) * 24}px)`,
                    }}
                  >
                    <p className="eyebrow">{c.face}</p>
                    <h3 className="mt-2 text-2xl">{c.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <footer className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6">
            <div className="min-w-0">
              <div className="flex gap-1.5">
                {CHAPTERS.map((c, i) => (
                  <span
                    key={c.face}
                    className={`h-0.5 w-12 transition-colors duration-500 ${
                      i <= active ? "bg-signal" : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 truncate text-lg">
                {laptop.name} — <span className="text-muted-foreground">{laptop.specs["CPU"]}</span>
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-xl">{currency(laptop.price)}</p>
              <Link
                to="/product/$productId"
                params={{ productId: laptop.id }}
                className="mt-2 inline-block border border-border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:border-signal/60"
              >
                Configure
              </Link>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
