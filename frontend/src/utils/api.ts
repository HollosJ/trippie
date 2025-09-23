export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('auth-token');
  if (!token) throw new Error('No token found');

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data as T;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}
