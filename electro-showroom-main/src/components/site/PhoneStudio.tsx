import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { images, products, currency } from "@/lib/products";
import { useReducedMotion, useScrollProgress } from "@/lib/motion";
import { useStore } from "@/lib/store";

const phone = products.find((p) => p.id === "prime-phone-17-pro")!;

const FACES = [
  { name: "Rear", detail: "Four-sensor optical stack with a 120 mm tetraprism." },
  { name: "Frame", detail: "Grade-5 titanium, brushed and bead-blasted." },
  { name: "Front", detail: "6.3-inch LTPO, 1–120Hz, 2,000 nits outdoors." },
];

/** Smartphone studio: colour + storage configuration with a rotating device. */
export function PhoneStudio() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const reduced = useReducedMotion();
  const { add } = useStore();
  const [color, setColor] = useState(phone.colors[0]!.name);
  const [storage, setStorage] = useState(phone.storage![1]!);
  const [face, setFace] = useState(0);

  const p = reduced ? 0.3 : progress;
  const hex = phone.colors.find((c) => c.name === color)!.hex;
  const rotY = -18 + p * 120 + face * 42;

  return (
    <div ref={ref} className="relative h-[240vh] border-t border-border">
      <section className="sticky top-0 flex h-dvh items-center overflow-hidden">
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{
            background: `radial-gradient(70% 60% at 30% 45%, color-mix(in oklab, ${hex} 22%, transparent), oklch(0.15 0.005 260) 70%)`,
          }}
        />
        <div className="relative mx-auto grid w-full max-w-[1600px] items-center gap-10 px-6 lg:grid-cols-[1.1fr_1fr] lg:px-12">
          <div className="perspective-stage order-2 flex justify-center lg:order-1">
            <img
              src={images.phone}
              alt={`${phone.name} in ${color}, showing its ${FACES[face]!.name.toLowerCase()}`}
              loading="lazy"
              width={912}
              height={1312}
              className="h-[52vh] w-auto product-shadow transition-transform duration-700 ease-[var(--ease-lab)] lg:h-[70vh]"
              style={{
                transform: `rotateY(${rotY}deg) rotateX(${4 - p * 8}deg) scale(${0.94 + p * 0.1})`,
                transformStyle: "preserve-3d",
                filter: `drop-shadow(0 40px 60px oklch(0 0 0 / 0.7)) hue-rotate(${(phone.colors.findIndex((c) => c.name === color) - 1) * 8}deg)`,
                willChange: "transform",
              }}
            />
          </div>

          <div className="order-1 lg:order-2">
            <p className="eyebrow">Chapter 02 — Phones</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">{phone.name}</h2>
            <p className="mt-4 max-w-md text-muted-foreground">{phone.tagline}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {FACES.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => setFace(i)}
                  className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    i === face
                      ? "border-signal/70 text-signal"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <p className="mt-3 h-10 text-sm text-muted-foreground">{FACES[face]!.detail}</p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="eyebrow">Finish</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {phone.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.name)}
                      className={`flex items-center gap-2 border px-3 py-2 text-xs transition-colors ${
                        c.name === color ? "border-signal/70" : "border-border hover:border-foreground/30"
                      }`}
                    >
                      <span
                        className="size-3.5 rounded-full ring-1 ring-border"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow">Storage</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {phone.storage!.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStorage(s)}
                      className={`border px-4 py-2 font-mono text-xs transition-colors ${
                        s === storage ? "border-signal/70 text-signal" : "border-border hover:border-foreground/30"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <p className="font-display text-2xl">{currency(phone.price)}</p>
              <button
                type="button"
                onClick={() => add(phone, { color, storage })}
                className="bg-[image:var(--gradient-signal)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-signal-foreground transition-opacity hover:opacity-90"
              >
                Add to bag
              </button>
              <Link
                to="/product/$productId"
                params={{ productId: phone.id }}
                className="border border-border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:border-signal/60"
              >
                Full showroom
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
