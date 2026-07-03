/** Cek error Prisma P2025 (record not found). */
export function isNotFoundError(err) {
  return err?.code === 'P2025';
}
