import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultContent } from "@/data/defaults";
import type { StoreContent } from "@/data/types";
import { adminLogin, adminLogout, getAdminSession } from "@/server-fns/auth";
import { getStoreContent, saveStoreContent } from "@/server-fns/content";

const LOCAL_KEY = "electro-prime-content-v1";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

type Updater = (draft: StoreContent) => void;

interface ContentApi {
  content: StoreContent;
  /** Apply a local edit. Only saved to your browser until you hit "Save to server". */
  update: (updater: Updater) => void;
  /** Discard local edits, reload from the server's last-saved version. */
  reset: () => void;
  hydrated: boolean;
  isAdmin: boolean;
  authLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  /** True while a save to the server is in flight. */
  saving: boolean;
  /** Set when the most recent save to the server failed. */
  saveError: string | null;
  /** True when there are local edits not yet pushed to the server. */
  dirty: boolean;
  /** Push the current content to the server now. */
  saveToServer: () => void;
}

const ContentContext = createContext<ContentApi | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<StoreContent>(defaultContent);
  const [hydrated, setHydrated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  // On load: prefer the server's saved content. Fall back to a locally
  // cached copy (e.g. offline, or the request fails), then to defaults.
  useEffect(() => {
    let cancelled = false;
    getStoreContent()
      .then((serverContent) => {
        if (cancelled) return;
        setContent(serverContent);
        try {
          localStorage.setItem(LOCAL_KEY, JSON.stringify(serverContent));
        } catch {
          // best-effort local cache only
        }
      })
      .catch(() => {
        if (cancelled) return;
        try {
          const raw = localStorage.getItem(LOCAL_KEY);
          if (raw) setContent(JSON.parse(raw) as StoreContent);
        } catch {
          // fall back to bundled defaults, already the initial state
        }
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Check for an existing admin session on load.
  useEffect(() => {
    getAdminSession()
      .then((res) => setIsAdmin(res.isAdmin))
      .catch(() => setIsAdmin(false))
      .finally(() => setAuthLoading(false));
  }, []);

  const login = useCallback(async (password: string) => {
    try {
      await adminLogin({ data: { password } });
      setIsAdmin(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await adminLogout().catch(() => undefined);
    setIsAdmin(false);
  }, []);

  const persistLocal = useCallback((next: StoreContent) => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    } catch {
      // storage full or unavailable — local-only convenience, safe to skip
    }
  }, []);

  // Local edits only — does NOT call the server. Saving to Redis happens
  // explicitly via saveToServer(), so typing in the Studio doesn't burn
  // through Redis's request quota one keystroke at a time.
  const update = useCallback(
    (updater: Updater) => {
      setContent((prev) => {
        const draft = clone(prev);
        updater(draft);
        persistLocal(draft);
        setDirty(true);
        return draft;
      });
    },
    [persistLocal],
  );

  const saveToServer = useCallback(() => {
    setSaving(true);
    setSaveError(null);
    setContent((current) => {
      saveStoreContent({ data: current })
        .then(() => setDirty(false))
        .catch((err: unknown) => {
          setSaveError(err instanceof Error ? err.message : "Save failed.");
        })
        .finally(() => setSaving(false));
      return current;
    });
  }, []);

  const reset = useCallback(() => {
    setSaving(true);
    getStoreContent()
      .then((serverContent) => {
        setContent(serverContent);
        persistLocal(serverContent);
        setDirty(false);
      })
      .catch(() => undefined)
      .finally(() => setSaving(false));
  }, [persistLocal]);

  // Warn before leaving the page with unsaved server changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const value = useMemo(
    () => ({
      content,
      update,
      reset,
      hydrated,
      isAdmin,
      authLoading,
      login,
      logout,
      saving,
      saveError,
      dirty,
      saveToServer,
    }),
    [
      content,
      update,
      reset,
      hydrated,
      isAdmin,
      authLoading,
      login,
      logout,
      saving,
      saveError,
      dirty,
      saveToServer,
    ],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useStoreContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useStoreContent must be used within ContentProvider");
  return ctx;
}
