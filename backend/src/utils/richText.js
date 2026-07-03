/** Normalize rich text HTML — empty markup becomes empty string. */

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasImageTag(html) {
  return /<img[\s>]/i.test(html);
}

export function normalizeRichTextDescription(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (hasImageTag(trimmed)) return trimmed;
  if (stripHtml(trimmed) === '') return '';
  return trimmed;
}
