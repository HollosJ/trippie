export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:5000/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API request failed");
  }

  return res.json() as Promise<T>;
}
