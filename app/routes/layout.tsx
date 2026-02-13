import { Outlet } from "react-router";
import { NavBar } from "~/components";
import { requireAuth } from "~/utils/requireAuth";

export async function clientLoader({ request }: { request: Request }) {
  return requireAuth(request, [
    "originator",
    "superior",
    "admin",
    "coordinator",
  ]);
}

export default function layout() {
  return (
    <div className="flex flex-col justify-center w-full h-screen">
      <div className="flex w-full h-fit justify-between pt-2 gap-2 bg-blue-600">
        <NavBar />
      </div>
      <div className="flex flex-1 px-4 py-2 min-h-0">
        <Outlet />
      </div>
    </div>
  );
}
