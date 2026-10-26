"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LANG, isLang, type Lang } from "./index";

/**
 * The language for a client component that has no server parent to hand it
 * down — the error boundaries. The root layout sets <html lang> from the
 * cookie, and that is read after mount, so the first frame may be Croatian
 * on an English page; on a crash screen that is an acceptable price for not
 * shipping both languages.
 */
export function useDocumentLang(): Lang {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  useEffect(() => {
    const value = document.documentElement.lang;
    if (isLang(value)) setLang(value);
  }, []);
  return lang;
}
