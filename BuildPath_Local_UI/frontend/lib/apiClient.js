// API client — wraps fetch for all backend calls
// Base URL is injected from env at runtime

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Core fetch wrapper.
 * Adds Authorization header when a token is provided.
 * Always returns { data, error } — never throws.
 */
async function apiFetch(path, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json.error || { message: 'Request failed' } };
    }

    return { data: json.data, error: null };
  } catch (err) {
    return { data: null, error: { message: err.message || 'Network error' } };
  }
}

// ── Convenience methods ──────────────────────────────────────────────────────

export const apiClient = {
  get: (path, token) => apiFetch(path, { method: 'GET' }, token),
  post: (path, body, token) =>
    apiFetch(path, { method: 'POST', body: JSON.stringify(body) }, token),
  patch: (path, body, token) =>
    apiFetch(path, { method: 'PATCH', body: JSON.stringify(body) }, token),
  delete: (path, token) => apiFetch(path, { method: 'DELETE' }, token),
};

export default apiClient;
