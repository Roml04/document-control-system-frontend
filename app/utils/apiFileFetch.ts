import { useSessionStore } from "../../stores/sessionStore";
import { BASE_URL } from "./apiFetch";

export async function apiFileFetch(
  endpoint: string,
  options: RequestInit = {},
) {
  const { token } = useSessionStore.getState();
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  return response;
}
