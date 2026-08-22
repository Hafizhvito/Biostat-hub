/**
 * Penanganan error terpusat. Semua error API dikembalikan sebagai JSON { error: "..." }.
 * Gunakan createError(status, message) untuk error yang disengaja.
 */

export function errorHandler(err, req, res, next) {
  const isUploadError = err?.name === 'MulterError';
  const isFileTooLarge = err?.code === 'LIMIT_FILE_SIZE';
  const status = err.status || (isFileTooLarge ? 413 : isUploadError ? 422 : 500);
  const message = isFileTooLarge
    ? 'Ukuran file melebihi batas 100 MB.'
    : err.message || 'Terjadi kesalahan. Silakan coba lagi.';
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
}

export function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
