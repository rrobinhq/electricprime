import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Electro Prime" },
      {
        name: "description",
        content: "Manage your Electro Prime orders, Prime Care warranties and delivery details.",
      },
      { property: "og:title", content: "Account — Electro Prime" },
      {
        property: "og:description",
        content: "Orders, warranties and delivery preferences for your Electro Prime devices.",
      },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-28 pt-28 lg:px-12">
      <p className="eyebrow">Client desk</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Account</h1>
      <p className="mt-4 max-w-lg text-muted-foreground">
        Sign in to track orders, register Prime Care warranties and store delivery preferences.
      </p>

      <form
        className="mt-10 grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label className="grid gap-2">
          <span className="eyebrow">Email</span>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="border border-border bg-surface/60 px-4 py-3 text-sm outline-none focus:border-signal/60"
          />
        </label>
        <label className="grid gap-2">
          <span className="eyebrow">Password</span>
          <input
            type="password"
            required
            placeholder="••••••••"
            className="border border-border bg-surface/60 px-4 py-3 text-sm outline-none focus:border-signal/60"
          />
        </label>
        <button
          type="submit"
          className="mt-2 bg-primary px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-85"
        >
          Continue
        </button>
      </form>

      <div className="mt-14 grid gap-4 border-t border-border pt-10 sm:grid-cols-3">
        {[
          ["Orders", "Track dispatch, delivery and returns."],
          ["Prime Care", "Register 3-year coverage per device."],
          ["Trade-in", "Valuation for your current hardware."],
        ].map(([title, body]) => (
          <div key={title} className="border border-border p-5">
            <p className="font-display text-lg">{title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
