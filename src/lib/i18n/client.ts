"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LANG, LANG_COOKIE, isLang, type Lang } from "./index";

/**
 * The language for a client component that has no server parent to hand it
 * down — the error boundaries. The cookie is the source of truth and is read
 * after mount, so the first frame may be Croatian on an English page; on a
 * crash screen that is an acceptable price for not shipping both languages.
 * It is the cookie, not <html lang>, because global-error renders the <html>
 * element itself and would only ever read back what it had just written.
 */
export function useDocumentLang(): Lang {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  useEffect(() => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${LANG_COOKIE}=([^;]*)`));
    const value = match ? decodeURIComponent(match[1]) : document.documentElement.lang;
    if (isLang(value)) setLang(value);
  }, []);
  return lang;
}
