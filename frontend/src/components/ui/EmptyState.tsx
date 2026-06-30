/** Pesan saat daftar kosong (materi, video, dll.). */

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-500">
      {message}
    </div>
  );
}
