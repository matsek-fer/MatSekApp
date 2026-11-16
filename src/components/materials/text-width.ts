/*
 * Advance widths of Inter Medium at 12.5px, measured in Chromium with
 * getComputedTextLength on the prerequisite map's own <text> element. A character count
 * cannot do this job: "differential equations" is 22 characters and 128px,
 * "Higher category theory" is 22 characters and 139px, and a four-bucket
 * estimate still missed by 7% on the latter. Unknown characters get a
 * typical lowercase width.
 */
const CHAR_PX = new Map<string, number>();
for (const [px, chars] of [
  [3.1, "ijl"], [3.4, " I"], [3.5, "’"], [3.8, ",.:"], [3.9, ";'"], [4.2, "t"],
  [4.4, "f"], [4.6, "()/"], [4.9, "r"], [5.2, "1"], [5.8, "-"], [6.2, "–"],
  [6.7, "sš"], [7.0, "kxzž"], [7.1, "aL"], [7.2, "cvyJćč"], [7.3, "e7"],
  [7.4, "F"], [7.5, "hnouE"], [7.7, "bdgpqđ2"], [7.8, "3"], [7.9, "689"],
  [8.0, "PZŽ"], [8.1, "0&RSTŠ"], [8.2, "B4"], [8.6, "K"], [8.7, "XY"],
  [9.0, "ADV"], [9.2, "CUČĆ"], [9.3, "GHĐ"], [9.4, "N"], [9.6, "OQ"],
  [10.3, "w"], [11.1, "m"], [11.4, "M…"], [12.5, "—"], [12.7, "W"],
] as const)
  for (const ch of chars) CHAR_PX.set(ch, px);

/** Width in px of `s` set in Inter Medium at `fontPx` (the table is at 12.5px). */
export function textWidth(s: string, fontPx = 12.5): number {
  let w = 0;
  for (const ch of s) w += CHAR_PX.get(ch) ?? 7.5;
  return (w * fontPx) / 12.5;
}

/** `s` cut with an ellipsis so that it fits `maxPx` at `fontPx`. */
export function clipText(s: string, maxPx: number, fontPx = 12.5): string {
  if (textWidth(s, fontPx) <= maxPx) return s;
  let cut = s;
  while (cut.length > 1 && textWidth(cut + "…", fontPx) > maxPx) cut = cut.slice(0, -1);
  return cut.trimEnd() + "…";
}
