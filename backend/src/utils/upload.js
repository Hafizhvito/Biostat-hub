import fs from 'fs';
import path from 'path';
import multer from 'multer';

const uploadsRoot = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'));

export const downloadUploadDir = path.join(uploadsRoot, 'downloads');
export const wizardUploadDir = path.join(uploadsRoot, 'wizard');

export function ensureUploadDirs() {
  fs.mkdirSync(downloadUploadDir, { recursive: true });
  fs.mkdirSync(wizardUploadDir, { recursive: true });
}

function sanitizeBaseName(value) {
  return value
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function buildStoredFilename(originalName) {
  const ext = path.extname(originalName || '').toLowerCase();
  const base = path.basename(originalName || 'file', ext);
  const safeBase = sanitizeBaseName(base) || 'file';
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeBase}${ext}`;
}

export function createUploader(targetDir, options = {}) {
  const allowedMimeTypes = options.allowedMimeTypes || null;
  const allowedExtensions = options.allowedExtensions || null;
  const maxFileSize = options.maxFileSize || 50 * 1024 * 1024;

  return multer({
    storage: multer.diskStorage({
      destination(req, file, callback) {
        fs.mkdirSync(targetDir, { recursive: true });
        callback(null, targetDir);
      },
      filename(req, file, callback) {
        callback(null, buildStoredFilename(file.originalname));
      },
    }),
    limits: { fileSize: maxFileSize },
    fileFilter(req, file, callback) {
      const extension = path.extname(file.originalname || '').toLowerCase();
      const invalidMimeType = allowedMimeTypes && !allowedMimeTypes.includes(file.mimetype);
      const invalidExtension = allowedExtensions && !allowedExtensions.includes(extension);

      if (invalidMimeType || invalidExtension) {
        const error = new Error('Tipe file tidak didukung.');
        error.status = 415;
        callback(error);
        return;
      }
      callback(null, true);
    },
  });
}

export async function removeStoredFile(dir, filename) {
  if (!filename) return;
  const fullPath = path.join(dir, filename);
  try {
    await fs.promises.unlink(fullPath);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
}

export function toPublicUploadUrl(folder, filename) {
  if (!filename) return '';
  return `/uploads/${folder}/${filename}`;
}
