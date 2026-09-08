import { createServerFn } from "@tanstack/react-start";
import { defaultContent } from "@/data/defaults";
import type { StoreContent } from "@/data/types";
import { requireAdminSession } from "@/server-fns/auth";

/**
 * Server-side persistence for store content (products, categories, settings).
 *
 * Uses Upstash Redis (REST API, no SDK needed) so edits made in the Studio
 * are saved to a real database instead of just the visitor's own browser.
 * Requires two environment variables in your Vercel project — added
 * automatically when you connect the "Upstash for Redis" integration from
 * Storage -> Connect Database:
 *
 *   KV_REST_API_URL
 *   KV_REST_API_TOKEN
 *
 * If these are not set (e.g. local dev without setup), the functions fall
 * back to the built-in catalog so the app still runs.
 */

const REDIS_KEY = "ep-store-content-v1";

function getRedisConfig() {
  const url = process.env["KV_REST_API_URL"] ?? process.env["UPSTASH_REDIS_REST_URL"];
  const token = process.env["KV_REST_API_TOKEN"] ?? process.env["UPSTASH_REDIS_REST_TOKEN"];
  if (!url || !token) return null;
  return { url, token };
}

async function redisGet(key: string): Promise<string | null> {
  const cfg = getRedisConfig();
  if (!cfg) return null;
  const res = await fetch(`${cfg.url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${cfg.token}` },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result: string | null };
  return data.result;
}

async function redisSet(key: string, value: string): Promise<boolean> {
  const cfg = getRedisConfig();
  if (!cfg) return false;
  const res = await fetch(`${cfg.url}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "text/plain",
    },
    body: value,
  });
  return res.ok;
}

export const getStoreContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<StoreContent> => {
    try {
      const raw = await redisGet(REDIS_KEY);
      if (!raw) return defaultContent;
      const parsed = JSON.parse(raw) as Partial<StoreContent>;
      return { ...defaultContent, ...parsed } as StoreContent;
    } catch (err) {
      console.error("getStoreContent failed, serving defaults:", err);
      return defaultContent;
    }
  },
);

export const saveStoreContent = createServerFn({ method: "POST" })
  .validator((data: StoreContent) => data)
  .handler(async ({ data }) => {
    await requireAdminSession();

    const ok = await redisSet(REDIS_KEY, JSON.stringify(data));
    if (!ok) {
      throw new Error(
        "Could not save to the database. Check that KV_REST_API_URL and KV_REST_API_TOKEN are set in your Vercel project's environment variables.",
      );
    }
    return { ok: true };
  });
