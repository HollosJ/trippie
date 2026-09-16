export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('auth-token');

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (res.status === 401) {
    window.dispatchEvent(new Event('auth:expired'));
    throw new Error(data.error || 'Session expired');
  }
  if (!res.ok) throw new Error(data.error || 'API request failed');

  return data as T;
}
