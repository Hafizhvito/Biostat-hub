/**
 * Klien HTTP ke backend. api() untuk publik, apiWithAuth() untuk route admin (JWT).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan. Silakan coba lagi.');
  return data;
}

export function apiWithAuth(token: string) {
  return <T>(path: string, options?: RequestInit) =>
    api<T>(path, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...options?.headers },
    });
}
