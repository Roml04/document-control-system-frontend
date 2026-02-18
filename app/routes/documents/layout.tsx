import { Outlet } from "react-router";

export default function layout() {
  return (
    <div>
      <div className="flex w-full bg-blue-600 h-8"></div>
      <Outlet />
    </div>
  );
}
