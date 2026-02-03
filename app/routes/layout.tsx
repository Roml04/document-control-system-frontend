import { NavLink, Outlet } from "react-router";
import NavBar from "~/components/NavBar";

export default function layout() {
  return (
    <div className="flex flex-col px-4 gap-4">
      <div className="flex w-full justify-between pt-2 gap-2">
        <NavBar />
        <NavLink
          to={`/requests`}
          className="flex px-8 py-2 border justify-center border-slate-400 rounded-lg"
        >
          Requests
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
