import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { currency, searchProducts } from "@/lib/products";
import { useStore } from "@/lib/store";

const SUGGESTIONS = ["laptop", "16GB RAM", "titanium phone", "wireless mouse", "gaming headset"];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const results = useMemo(() => searchProducts(q), [q]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-background/95 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1100px] px-6 pt-24">
        <div className="flex items-center gap-4 border-b border-border pb-5">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the showroom — “16GB RAM laptop”, “wireless mouse”…"
            className="min-w-0 flex-1 bg-transparent font-display text-2xl outline-none placeholder:text-muted-foreground/60 sm:text-3xl"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
            className="grid size-10 shrink-0 place-items-center border border-border transition-colors hover:border-signal/60"
          >
            <X className="size-4" />
          </button>
        </div>

        {!q && (
          <div className="mt-8 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQ(s)}
                className="border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-signal/50 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 max-h-[58vh] overflow-y-auto">
          {q && results.length === 0 && (
            <p className="py-10 text-sm text-muted-foreground">
              No products match “{q}”. Try a category, a brand, or a specification.
            </p>
          )}
          <ul className="divide-y divide-border">
            {results.map((p, i) => (
              <li key={p.id} style={{ animationDelay: `${i * 45}ms` }} className="anim-mask-up">
                <Link
                  to="/product/$productId"
                  params={{ productId: p.id }}
                  onClick={() => setSearchOpen(false)}
                  className="group grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-5 py-4"
                >
                  <div className="grid size-16 place-items-center border border-border bg-[image:var(--gradient-stage)]">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={64}
                      height={64}
                      className="size-12 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base transition-colors group-hover:text-signal">
                      {p.name}
                    </p>
                    <p className="truncate font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {p.category} · {p.specs["RAM"] !== "—" ? p.specs["RAM"] : p.specs["Display"]}
                    </p>
                  </div>
                  <span className="font-display">{currency(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
