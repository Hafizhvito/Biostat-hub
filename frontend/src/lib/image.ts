/**
 * Konversi link share Google Drive ke URL yang bisa dipakai tag <img>.
 * getDisplayImageCandidates() mengembalikan beberapa URL alternatif (Drive sering memblokir embed).
 * Dipakai oleh QuizQuestionImage (preview + lightbox zoom).
 */

/** Ambil file ID dari berbagai format link Google Drive. */
export function extractGoogleDriveFileId(url: string): string | null {
  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?(?:export=\w+&)?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Beberapa URL kandidat untuk menampilkan gambar Drive di <img>.
 * Google sering memblokir format lama; kita coba berurutan sampai ada yang berhasil.
 */
export function getDisplayImageCandidates(url: string): string[] {
  const trimmed = url.trim();
  const fileId = extractGoogleDriveFileId(trimmed);

  if (fileId) {
    return [
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
      `https://drive.usercontent.google.com/uc?id=${fileId}&export=view`,
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://lh3.googleusercontent.com/d/${fileId}`,
    ];
  }

  return [trimmed];
}

/** @deprecated gunakan getDisplayImageCandidates */
export function toDisplayImageUrl(url: string): string {
  return getDisplayImageCandidates(url)[0];
}
