const BASE_URL = "http://localhost/api";

export const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("apiToken");

  return fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      ...defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });
}
