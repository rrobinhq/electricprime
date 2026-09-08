import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { useSession, clearSession } from "@tanstack/react-start/server";

/**
 * Admin authentication for the Studio.
 *
 * The admin logs in with a password (set as an environment variable, never
 * committed to code) from a login form on /studio. On success, the server
 * issues an encrypted, httpOnly session cookie — the browser never sees or
 * stores the password itself, and regular shoppers are completely
 * unaffected.
 *
 * Required environment variables (set in Vercel -> Project -> Settings ->
 * Environment Variables — NOT in code):
 *
 *   ADMIN_PASSWORD   the password you type in to log in as admin
 *   SESSION_SECRET   any random string, 32+ characters, used only to encrypt
 *                    the session cookie (generate with: openssl rand -base64 32)
 *
 * If SESSION_SECRET is missing, a fallback is used so local dev still works,
 * but you MUST set a real one in Vercel before deploying, or sessions will
 * reset every time the server restarts.
 */

interface AdminSessionData {
  isAdmin?: boolean;
}

function sessionConfig() {
  const password =
    process.env["SESSION_SECRET"] ??
    // Fallback ONLY for local dev so `npm run dev` works without setup.
    // This is not secure and must be overridden in production.
    "dev-only-insecure-fallback-secret-please-set-real-one-32c";

  return {
    password,
    name: "ep_admin_session",
    maxAge: 60 * 60 * 24 * 90, // 90 days
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) {
      throw new Error(
        "ADMIN_PASSWORD is not set on the server. Add it in Vercel -> Settings -> Environment Variables, then redeploy.",
      );
    }

    if (data.password !== expected) {
      throw new Error("Incorrect password.");
    }

    const session = await useSession<AdminSessionData>(sessionConfig());
    await session.update({ isAdmin: true });

    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  await clearSession(sessionConfig());
  return { ok: true };
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ isAdmin: boolean }> => {
    const session = await useSession<AdminSessionData>(sessionConfig());
    return { isAdmin: session.data.isAdmin === true };
  },
);

/**
 * Server-side guard — call this at the top of any server function that
 * changes store content, so requests can't bypass the UI and write
 * directly. Throws if the caller doesn't have a valid admin session.
 */
export const requireAdminSession = createServerOnlyFn(async () => {
  const session = await useSession<AdminSessionData>(sessionConfig());
  if (session.data.isAdmin !== true) {
    throw new Error("Not authorized. Please log in as admin first.");
  }
});
