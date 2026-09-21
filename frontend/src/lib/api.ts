/**
 * Klien HTTP ke backend. api() untuk publik, apiWithAuth() untuk route admin (JWT).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function apiUrl(path: string) {
  return `${API_URL}${path}`;
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const res = await fetch(apiUrl(path), {
    ...options,
    cache: options?.cache ?? 'no-store',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
  });

  const raw = await res.text();
  const data = raw ? JSON.parse(raw) : null;

  if (!res.ok) throw new Error(data?.error || 'Terjadi kesalahan. Silakan coba lagi.');
  return data as T;
}

export function apiWithAuth(token: string) {
  return <T>(path: string, options?: RequestInit) =>
    api<T>(path, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...options?.headers },
    });
}
