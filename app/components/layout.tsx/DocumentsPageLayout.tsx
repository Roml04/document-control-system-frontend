import { Outlet, useNavigate } from "react-router";
import PressableIcon from "../primitives/PressableIcon";
import type { ReactNode } from "react";

export default function DocumentsPageLayout({
  pagetitle,
  children,
}: {
  pagetitle: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center h-full -mt-20 ">
        <div className="flex flex-col w-3/4 px-4 py-4 gap-2 rounded-lg h-fit bg-white">
          <div className="flex items-center gap-2">
            <PressableIcon iconName="arrowleft" onClick={() => navigate(-1)} />
            <h1>{pagetitle}</h1>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
