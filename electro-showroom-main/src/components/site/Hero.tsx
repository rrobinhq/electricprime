import { Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { images } from "@/lib/products";
import { currency } from "@/lib/format";
import { useStoreContent } from "@/lib/content-store";
import { useIsMobile, usePointer, useReducedMotion, useScrollProgress, range } from "@/lib/motion";

/**
 * Hero: the flagship laptop is pinned in the stage while the environment,
 * copy and specification callouts transform around it on scroll.
 */
export function Hero() {
  const { content } = useStoreContent();
  const hero = content.products[0];
  const { ref: stageRef, progress } = useScrollProgress<HTMLDivElement>();
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const { ref: pointerRef, pos } = usePointer<HTMLDivElement>(!reduced && !mobile);

  const p = reduced ? 0 : progress;
  const enter = range(p, 0, 0.4);
  const spec = range(p, 0.35, 0.65);
  const exit = range(p, 0.72, 1);

  const rotY = (mobile ? 0 : pos.x * 7) + enter * 22 - exit * 12;
  const rotX = (mobile ? 0 : pos.y * -5) + 4 - enter * 6;
  const scale = 1 + enter * 0.12 - exit * 0.28;
  const lift = enter * -40 + exit * -140;

  if (!hero) return null;

  const callouts = [
    { label: "Display", value: hero.specs["Display"] ?? "—", className: "left-0 top-[16%] text-left" },
    { label: "Silicon", value: hero.specs["CPU"] ?? "—", className: "right-0 top-[30%] text-right" },
    { label: "I/O", value: hero.specs["Ports"] ?? "—", className: "left-0 bottom-[24%] text-left" },
    { label: "Mass", value: hero.specs["Weight"] ?? "—", className: "right-0 bottom-[16%] text-right" },
  ];

  return (
    <div ref={stageRef} className="relative h-[280vh]">
      <section className="sticky top-0 flex h-dvh flex-col overflow-hidden stage">
        {/* environment layers */}
        <div
          className="grid-lines absolute inset-0 opacity-60"
          style={{
            transform: `translate3d(${pos.x * -14}px, ${pos.y * -10 - p * 60}px, 0) scale(${1.05 + p * 0.15})`,
            transition: "transform 700ms var(--ease-lab)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-signal/25"
          style={{ transform: `scaleX(${0.2 + enter * 0.8})`, transformOrigin: "left" }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, oklch(0.82 0.15 70 / 0.16), transparent 70%)",
            transform: `translate(calc(-50% + ${pos.x * 26}px), calc(-50% + ${pos.y * 18}px)) scale(${1 + enter * 0.4})`,
          }}
        />

        <div
          ref={pointerRef}
          className="perspective-stage relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-6 lg:px-12"
        >
          {/* headline */}
          <div
            className="pointer-events-none absolute inset-x-6 top-[14vh] z-20 text-center lg:inset-x-12"
            style={{ opacity: 1 - enter * 1.4, transform: `translateY(${enter * -60}px)` }}
          >
            <p className="eyebrow">Showroom 01 — Flagship compute</p>
            <h1 className="mx-auto mt-5 max-w-[16ch] text-[13vw] font-medium leading-[0.86] sm:text-[9vw] lg:text-[7.2vw]">
              Precision you<span className="signal-text"> can feel</span>
            </h1>
          </div>

          {/* the product */}
          <div className="relative z-10 flex items-center justify-center">
            <img
              src={images.heroLaptop}
              alt={`${hero.name} floating in the Electro Prime showroom`}
              width={1600}
              height={1104}
              fetchPriority="high"
              className="w-[min(1180px,110vw)] max-w-none product-shadow"
              style={{
                transform: `translate3d(${pos.x * 18}px, ${lift + pos.y * 10}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            />
          </div>

          {/* specification callouts materialise around the anchored product */}
          <div className="pointer-events-none absolute inset-6 z-20 hidden lg:block">
            {callouts.map((c, i) => {
              const t = range(spec, i * 0.12, i * 0.12 + 0.5);
              return (
                <div
                  key={c.label}
                  className={`absolute max-w-[240px] ${c.className}`}
                  style={{
                    opacity: t,
                    transform: `translateX(${(c.className.includes("right") ? 1 : -1) * (1 - t) * 40}px)`,
                  }}
                >
                  <p className="eyebrow">{c.label}</p>
                  <p className="mt-2 font-mono text-sm text-foreground/85">{c.value}</p>
                  <span className="mt-3 block h-px w-full bg-signal/40" />
                </div>
              );
            })}
          </div>

          {/* commerce layer */}
          <div
            className="relative z-30 mx-auto mt-10 grid w-full max-w-3xl grid-cols-[minmax(0,1fr)_auto] items-end gap-6"
            style={{ opacity: spec * (1 - exit), transform: `translateY(${(1 - spec) * 30}px)` }}
          >
            <div className="min-w-0">
              <h2 className="truncate text-2xl sm:text-3xl">{hero.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{hero.tagline}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-2xl">{currency(hero.price)}</p>
              <Link
                to="/product/$productId"
                params={{ productId: hero.id }}
                className="mt-3 inline-block bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-85"
              >
                Explore in 3D
              </Link>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
          style={{ opacity: 1 - enter * 2 }}
        >
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <ArrowDown className="size-3 animate-bounce" /> Scroll to enter
          </span>
        </div>
      </section>
    </div>
  );
}
