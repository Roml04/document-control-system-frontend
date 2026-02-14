import { redirect } from "react-router";

export async function requireAuth(allowedRoles?: string[]) {
  const token = localStorage.getItem("apiToken");

  const response = await fetch("http://127.0.0.1/api/me", {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    // throw redirect("/error/500");
    return;
  }

  const user = await response.json();

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw redirect("/error/401");
  }
  console.log("SUCCESS:", response);

  return user;
}
