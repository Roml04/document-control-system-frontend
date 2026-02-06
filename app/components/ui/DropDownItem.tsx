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
    <li className="border border-slate-400 px-4 py-2 rounded-lg">
      <div
        className="flex w-fullpx-4 py-2 cursor-pointer"
        onClick={() => (isShown ? setIsShown(false) : setIsShown(true))}
      >
        <div className="flex w-full">
          <h3>{title}</h3>
        </div>
        <div className="flex">
          <div className="flex"></div>
          {isShown ? (
            <Icon name="arrowdropup" />
          ) : (
            <Icon name="arrowdropdown" />
          )}
        </div>
      </div>
      {isShown && (
        <div className="flex flex-col border-t border-slate-300 gap-2">
          <div className="flex p-4 w-full">
            <p>{description}</p>
          </div>
          <div className="flex w-full justify-end gap-2">
            <button
              onClick={handleApprove}
              className="group px-4 py-2 rounded-lg hover:bg-black"
            >
              <p className="text-black group-hover:text-white">Approve</p>
            </button>
            <button
              onClick={handleDeny}
              className="group hover:bg-red-400 px-4 py-2 rounded-lg"
            >
              <p className="text-red-400 group-hover:text-white">Deny</p>
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
