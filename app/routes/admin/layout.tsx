import { Outlet, redirect } from "react-router";
import { USERROLE } from "~/constants/enums";
import { apiFetch } from "~/utils/apiFetch";

export async function clientLoader() {
  const user = await apiFetch("/me");

  if (!user) {
    throw redirect("/");
  }

  if (user.role !== USERROLE.SYSADMIN) {
    throw redirect("/dashboard");
  }

  return { user };
}

export default function layout() {
  return <Outlet />;
}
