/**
 * Ekstrak video ID dari URL YouTube (watch, youtu.be, embed, shorts).
 */

export function extractYouTubeId(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const isValidId = (value) => /^[a-zA-Z0-9_-]{11}$/.test(value ?? '');

    if (hostname === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return isValidId(id) ? id : null;
    }

    if (hostname !== 'youtube.com' && !hostname.endsWith('.youtube.com')) return null;

    if (parsed.pathname === '/watch') {
      const id = parsed.searchParams.get('v');
      return isValidId(id) ? id : null;
    }

    const [kind, id] = parsed.pathname.split('/').filter(Boolean);
    if ((kind === 'embed' || kind === 'shorts') && isValidId(id)) return id;
    return null;
  } catch {
    return null;
  }
}

export function toYouTubeWatchUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
