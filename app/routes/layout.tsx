import { Outlet } from "react-router";
import NavBar from "~/components/ui/NavBar";

export default function layout() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex w-full h-fit justify-between pt-2 gap-2 bg-blue-600">
          <NavBar />
        </div>
        <div className="flex px-4 py-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
