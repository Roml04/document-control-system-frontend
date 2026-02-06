import { useState } from "react";
import { Icon } from "../primitives";

type DropDownItemProps = {
  title: string;
  description?: string;
  handleApprove: () => void;
  handleDeny: () => void;
};

export default function DropDownItem({
  title,
  description = "...",
  handleApprove,
  handleDeny,
}: DropDownItemProps) {
  const [isShown, setIsShown] = useState(false);

  return (
    <li className="border border-slate-300 px-4 py-2 rounded-lg transition-all duration-200">
      <div
        className="flex w-fullpx-4 py-1 cursor-pointer"
        onClick={() => setIsShown((prev) => !prev)}
      >
        <div className="flex w-full">
          <h3>{title}</h3>
        </div>
        <div className="flex">
          {isShown ? (
            <Icon name="arrowdropup" />
          ) : (
            <Icon name="arrowdropdown" />
          )}
        </div>
      </div>

      {/* Animated container */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isShown ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"}
        `}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col px-3 py-1 w-full border-l border-slate-300">
            <h3 className="text-slate-400">Reason</h3>
            <p className="text-slate-400">{description}</p>
          </div>
          <div className="flex w-full justify-end gap-2">
            <button
              onClick={handleApprove}
              className="group px-4 py-2 rounded-lg hover:bg-black"
            >
              <p className="text-black group-hover:text-white">Approve</p>
            </button>
            <button onClick={handleDeny} className="group px-4 py-2 rounded-lg">
              <p className="text-red-400 group-hover:text-red-600 ">Deny</p>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
