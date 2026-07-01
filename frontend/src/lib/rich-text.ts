/** Helpers for rich text HTML (Tiptap) — strip, normalize, truncate. */

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isEmptyRichText(html: string | null | undefined): boolean {
  if (!html) return true;
  return stripHtml(html).length === 0;
}

export function normalizeRichText(html: string): string {
  if (isEmptyRichText(html)) return "";
  return html.trim();
}

export function truncatePlain(text: string, maxLength = 140): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function truncateRichText(
  html: string | null | undefined,
  maxLength = 140,
  fallback = "",
): string {
  const plain = stripHtml(html ?? "");
  if (!plain) return fallback;
  return truncatePlain(plain, maxLength);
}
