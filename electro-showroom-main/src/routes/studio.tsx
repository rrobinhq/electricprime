import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStoreContent } from "@/lib/content-store";
import type { Product, Category, CategorySlug } from "@/data/types";
import {
  TextField,
  NumberField,
  TextAreaField,
  CheckboxField,
  StringListField,
  ColorListField,
  SpecsField,
} from "@/components/studio/fields";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
  component: StudioRoute,
});

function StudioLogin({ onLogin }: { onLogin: (password: string) => Promise<boolean> }) {
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(null);
    const ok = await onLogin(password);
    setChecking(false);
    if (!ok) setError("Incorrect password.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-lg font-semibold text-foreground">Studio login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={checking || !password}
          className="w-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {checking ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}

type Section = "settings" | "categories" | "products";

function blankProduct(category: CategorySlug): Product {
  return {
    id: `product-${Date.now()}`,
    name: "New product",
    brand: "",
    category,
    price: 0,
    rating: 5,
    reviews: 0,
    image: "",
    tagline: "",
    colors: [],
    storage: [],
    memory: [],
    specs: {},
    featured: false,
  };
}

function StudioRoute() {
  const { isAdmin, authLoading, login, logout, content, update, dirty, saving, saveError, saveToServer } =
    useStoreContent();
  const [section, setSection] = useState<Section>("products");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    content.products[0]?.id ?? null,
  );

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-background" />;
  }

  if (!isAdmin) {
    return <StudioLogin onLogin={login} />;
  }

  const selectedProduct = content.products.find((p) => p.id === selectedProductId) ?? null;

  function updateProduct(id: string, patch: Partial<Product>) {
    update((draft) => {
      const p = draft.products.find((x) => x.id === id);
      if (p) Object.assign(p, patch);
    });
  }

  function updateCategory(slug: CategorySlug, patch: Partial<Category>) {
    update((draft) => {
      const c = draft.categories.find((x) => x.slug === slug);
      if (c) Object.assign(c, patch);
    });
  }

  function addProduct() {
    const fresh = blankProduct(content.categories[0]?.slug ?? "laptops");
    update((draft) => {
      draft.products.unshift(fresh);
    });
    setSelectedProductId(fresh.id);
  }

  function duplicateProduct(id: string) {
    const source = content.products.find((p) => p.id === id);
    if (!source) return;
    const copy: Product = {
      ...JSON.parse(JSON.stringify(source)),
      id: `product-${Date.now()}`,
      name: `${source.name} (copy)`,
    };
    update((draft) => {
      draft.products.unshift(copy);
    });
    setSelectedProductId(copy.id);
  }

  function deleteProduct(id: string) {
    if (!window.confirm("Delete this product? This can't be undone once saved.")) return;
    update((draft) => {
      draft.products = draft.products.filter((p) => p.id !== id);
    });
    if (selectedProductId === id) {
      setSelectedProductId(content.products.find((p) => p.id !== id)?.id ?? null);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Studio</h1>
          <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
            {saveError ? (
              <span className="text-destructive">Save failed — {saveError}</span>
            ) : saving ? (
              "Saving…"
            ) : dirty ? (
              <span className="text-amber-500">Unsaved changes</span>
            ) : (
              "Saved to server"
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={saveToServer}
            disabled={!dirty || saving}
            className="border border-foreground bg-foreground px-3 py-1.5 text-xs uppercase tracking-wide text-background disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save to server"}
          </button>
          <button
            onClick={() => {
              if (dirty && !window.confirm("You have unsaved changes. Log out anyway?")) return;
              void logout();
            }}
            className="border border-border px-3 py-1.5 text-xs uppercase tracking-wide text-foreground"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Section nav */}
        <nav className="w-40 shrink-0 border-r border-border p-4">
          {(["products", "categories", "settings"] as Section[]).map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`block w-full border-b border-transparent px-2 py-2 text-left text-xs uppercase tracking-wide ${
                section === s ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </nav>

        <div className="flex-1 p-6">
          {section === "settings" && (
            <div className="max-w-md space-y-4">
              <TextField
                label="Site name"
                value={content.settings.siteName}
                onChange={(v) => update((d) => void (d.settings.siteName = v))}
              />
              <TextField
                label="Tagline"
                value={content.settings.tagline}
                onChange={(v) => update((d) => void (d.settings.tagline = v))}
              />
              <CheckboxField
                label="Chatbot enabled"
                checked={content.settings.chatbotEnabled}
                onChange={(v) => update((d) => void (d.settings.chatbotEnabled = v))}
              />
            </div>
          )}

          {section === "categories" && (
            <div className="max-w-2xl space-y-8">
              {content.categories.map((cat) => (
                <div key={cat.slug} className="space-y-3 border-b border-border pb-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {cat.slug}
                  </p>
                  <TextField
                    label="Name"
                    value={cat.name}
                    onChange={(v) => updateCategory(cat.slug, { name: v })}
                  />
                  <TextAreaField
                    label="Blurb"
                    value={cat.blurb}
                    rows={2}
                    onChange={(v) => updateCategory(cat.slug, { blurb: v })}
                  />
                  <TextField
                    label="Image URL"
                    value={cat.image}
                    onChange={(v) => updateCategory(cat.slug, { image: v })}
                  />
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt=""
                      className="h-24 w-24 border border-border object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {section === "products" && (
            <div className="flex gap-6">
              {/* Product list */}
              <div className="w-64 shrink-0">
                <button
                  onClick={addProduct}
                  className="mb-3 w-full border border-dashed border-border px-2.5 py-1.5 text-xs uppercase tracking-wide text-muted-foreground hover:border-foreground hover:text-foreground"
                >
                  + New product
                </button>
                <div className="max-h-[70vh] space-y-1 overflow-y-auto">
                  {content.products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProductId(p.id)}
                      className={`block w-full truncate border px-2.5 py-1.5 text-left text-xs ${
                        p.id === selectedProductId
                          ? "border-foreground text-foreground"
                          : "border-transparent text-muted-foreground hover:border-border"
                      }`}
                    >
                      {p.name || "(untitled)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product editor */}
              {selectedProduct ? (
                <div className="max-w-xl flex-1 space-y-4 pb-16">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {selectedProduct.id}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => duplicateProduct(selectedProduct.id)}
                        className="border border-border px-2.5 py-1 text-[11px] uppercase tracking-wide text-foreground"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => deleteProduct(selectedProduct.id)}
                        className="border border-destructive px-2.5 py-1 text-[11px] uppercase tracking-wide text-destructive"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <TextField
                      label="Name"
                      value={selectedProduct.name}
                      onChange={(v) => updateProduct(selectedProduct.id, { name: v })}
                    />
                    <TextField
                      label="Brand"
                      value={selectedProduct.brand}
                      onChange={(v) => updateProduct(selectedProduct.id, { brand: v })}
                    />
                  </div>

                  <label className="block text-xs">
                    <span className="mb-1 block uppercase tracking-wide text-muted-foreground">
                      Category
                    </span>
                    <select
                      value={selectedProduct.category}
                      onChange={(e) =>
                        updateProduct(selectedProduct.id, {
                          category: e.target.value as CategorySlug,
                        })
                      }
                      className="w-full border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-foreground"
                    >
                      {content.categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    <NumberField
                      label="Price"
                      value={selectedProduct.price}
                      onChange={(v) => updateProduct(selectedProduct.id, { price: v ?? 0 })}
                    />
                    <NumberField
                      label="Compare-at price"
                      value={selectedProduct.compareAt}
                      onChange={(v) => updateProduct(selectedProduct.id, { compareAt: v })}
                    />
                    <NumberField
                      label="Rating"
                      value={selectedProduct.rating}
                      onChange={(v) => updateProduct(selectedProduct.id, { rating: v ?? 0 })}
                    />
                  </div>

                  <NumberField
                    label="Reviews"
                    value={selectedProduct.reviews}
                    onChange={(v) => updateProduct(selectedProduct.id, { reviews: v ?? 0 })}
                  />

                  <TextField
                    label="Image URL"
                    value={selectedProduct.image}
                    onChange={(v) => updateProduct(selectedProduct.id, { image: v })}
                  />
                  {selectedProduct.image && (
                    <img
                      src={selectedProduct.image}
                      alt=""
                      className="h-32 w-32 border border-border object-cover"
                    />
                  )}

                  <TextAreaField
                    label="Tagline"
                    value={selectedProduct.tagline}
                    onChange={(v) => updateProduct(selectedProduct.id, { tagline: v })}
                  />

                  <CheckboxField
                    label="Featured"
                    checked={selectedProduct.featured ?? false}
                    onChange={(v) => updateProduct(selectedProduct.id, { featured: v })}
                  />

                  <ColorListField
                    value={selectedProduct.colors}
                    onChange={(v) => updateProduct(selectedProduct.id, { colors: v })}
                  />

                  <StringListField
                    label="Storage options"
                    value={selectedProduct.storage ?? []}
                    onChange={(v) => updateProduct(selectedProduct.id, { storage: v })}
                  />

                  <StringListField
                    label="Memory options"
                    value={selectedProduct.memory ?? []}
                    onChange={(v) => updateProduct(selectedProduct.id, { memory: v })}
                  />

                  <SpecsField
                    value={selectedProduct.specs}
                    onChange={(v) => updateProduct(selectedProduct.id, { specs: v })}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No product selected — add one to get started.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
