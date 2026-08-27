import { Minus, Plus, Trash2, X, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { currency } from "@/lib/products";
import { useStore } from "@/lib/store";

export function CartDrawer() {
  const { cartOpen, setCartOpen, detailed, setQty, remove, subtotal, count } = useStore();

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  return (
    <>
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-[75] bg-background/70 backdrop-blur-sm transition-opacity duration-500 ${
          cartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-hidden={!cartOpen}
        className={`fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-[440px] flex-col border-l border-border bg-surface shadow-[var(--shadow-panel)] transition-transform duration-[600ms] ease-[var(--ease-lab)] ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border px-6 py-5">
          <div className="min-w-0">
            <p className="eyebrow">Your bag</p>
            <h2 className="mt-1 truncate text-xl">
              {count} item{count === 1 ? "" : "s"}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
            className="grid size-10 shrink-0 place-items-center border border-border transition-colors hover:border-signal/60"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6">
          {detailed.length === 0 ? (
            <p className="py-16 text-sm text-muted-foreground">
              Your bag is empty. Every product in the showroom can be added from its card or detail
              page.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {detailed.map(({ line, product }) => (
                <li
                  key={line.key}
                  className="anim-mask-up grid grid-cols-[72px_minmax(0,1fr)] gap-4 py-5"
                >
                  <div className="grid size-[72px] place-items-center border border-border bg-[image:var(--gradient-stage)]">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      width={72}
                      height={72}
                      className="size-14 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-sm font-semibold">{product.name}</p>
                      <button
                        type="button"
                        aria-label="Remove"
                        onClick={() => remove(line.key)}
                        className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="mt-1 truncate font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {[line.color, line.memory, line.storage].filter(Boolean).join(" · ")}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(line.key, line.qty - 1)}
                          className="grid size-8 place-items-center hover:bg-accent"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs">{line.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQty(line.key, line.qty + 1)}
                          className="grid size-8 place-items-center hover:bg-accent"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="font-display">{currency(product.price * line.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="border-t border-border px-6 py-6">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Subtotal</span>
            <span className="font-display text-2xl">{currency(subtotal)}</span>
          </div>
          <p className="mt-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-signal" /> Free 2-day delivery · 3-year Prime Care
          </p>
          <button
            type="button"
            disabled={detailed.length === 0}
            className="mt-5 w-full bg-[image:var(--gradient-signal)] py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-signal-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Proceed to checkout
          </button>
        </footer>
      </aside>
    </>
  );
}
