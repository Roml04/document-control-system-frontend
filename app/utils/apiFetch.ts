import { useSessionStore } from "../../stores/sessionStore";

export const BASE_URL = "http://document-control-system-backend.test/api";

export const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const { token } = useSessionStore.getState();

  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      // ...defaultHeaders,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  return response.json();
}
