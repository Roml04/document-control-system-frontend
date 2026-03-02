const BASE_URL = "http://localhost/api";

export const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("apiToken");

  const isFormData = options.body instanceof FormData;

  return fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      // ...defaultHeaders,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });
}
