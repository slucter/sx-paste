const KEY_PREFIX = "sxpaste:edit:";

export function getEditToken(slug: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY_PREFIX + slug);
  } catch {
    return null;
  }
}

export function setEditToken(slug: string, token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY_PREFIX + slug, token);
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — edit access is best-effort.
  }
}

export function subscribeEditToken(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}
