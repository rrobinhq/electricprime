import { createFileRoute, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";
import { currency } from "@/lib/format";
import { getProduct } from "@/lib/catalog";
import { useStoreContent } from "@/lib/content-store";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Specifications — Electro Prime" },
      {
        name: "description",
        content:
          "Compare CPU, GPU, memory, display, battery and ports across Electro Prime laptops, phones and monitors.",
      },
      { property: "og:title", content: "Compare Specifications — Electro Prime" },
      {
        property: "og:description",
        content: "Put two machines side by side, line by line, without marketing language.",
      },
    ],
  }),
  component: ComparePage,
});

const ROWS = ["CPU", "GPU", "RAM", "Storage", "Display", "Battery", "Camera", "Ports", "Weight", "Connectivity"];

function ComparePage() {
  const { content } = useStoreContent();
  const { compare, toggleCompare } = useStore();
  const [picker, setPicker] = useState(false);
  const selected = compare
    .map((id) => getProduct(content.products, id))
    .filter(Boolean)
    .slice(0, 3) as NonNullable<ReturnType<typeof getProduct>>[];

  return (
    <div className="mx-auto max-w-[1600px] px-6 pb-28 pt-28 lg:px-12">
      <p className="eyebrow">Specification desk</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Comparison</h1>
      <p className="mt-4 max-w-lg text-muted-foreground">
        Add up to three products from any product card, then read the differences line by line.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setPicker((v) => !v)}
          className="border border-border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:border-signal/60"
        >
          {picker ? "Close catalogue" : "Add product"}
        </button>
        {selected.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => toggleCompare(p.id)}
            className="flex items-center gap-2 border border-signal/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-signal"
          >
            {p.name} <X className="size-3.5" />
          </button>
        ))}
      </div>

      {picker && (
        <div className="mt-6 grid gap-2 border border-border bg-surface/50 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggleCompare(p.id)}
              className={`grid grid-cols-[40px_minmax(0,1fr)] items-center gap-3 border p-2 text-left transition-colors ${
                compare.includes(p.id) ? "border-signal/60" : "border-transparent hover:border-border"
              }`}
            >
              <img
                src={p.image}
                alt=""
                loading="lazy"
                width={40}
                height={40}
                className="size-10 object-contain"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm">{p.name}</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {p.category}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {selected.length === 0 ? (
        <p className="mt-16 border border-border p-10 text-center text-sm text-muted-foreground">
          Nothing selected yet. Use “Add product” above, or the compare icon on any product card.
        </p>
      ) : (
        <div className="scroll-rail mt-14 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-40 border-b border-border pb-6 align-bottom">
                  <span className="eyebrow">Specification</span>
                </th>
                {selected.map((p) => (
                  <th key={p.id} className="border-b border-border px-4 pb-6 align-bottom">
                    <div className="grid place-items-center bg-[image:var(--gradient-stage)] p-4">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        width={200}
                        height={140}
                        className="h-24 object-contain"
                      />
                    </div>
                    <Link
                      to="/product/$productId"
                      params={{ productId: p.id }}
                      className="mt-4 block font-display text-lg hover:text-signal"
                    >
                      {p.name}
                    </Link>
                    <span className="font-mono text-xs text-muted-foreground">
                      {currency(p.price)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const values = selected.map((p) => p.specs[row] ?? "—");
                const differs = new Set(values).size > 1;
                return (
                  <tr key={row} className="border-b border-border">
                    <th className="py-4 align-top">
                      <span className="eyebrow">{row}</span>
                    </th>
                    {values.map((v, i) => (
                      <td
                        key={`${row}-${i}`}
                        className={`px-4 py-4 align-top font-mono text-sm ${
                          differs ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
