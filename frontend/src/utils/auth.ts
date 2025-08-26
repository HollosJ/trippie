export function hasAuthToken() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  return !!token;
}