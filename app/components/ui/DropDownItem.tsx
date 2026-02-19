import { useState } from "react";
import { Icon } from "../primitives";
import { useSessionStore } from "stores/sessionStore";
import { isRoleAllowed } from "~/utils/isRoleAllowed";

type DropDownItemProps = {
  title: string;
  description?: string;
  handleOnClick: () => void;
  handleDeny: () => void;
};

export default function DropDownItem({
  title,
  description = "...",
  handleOnClick,
}: DropDownItemProps) {
  const [isShown, setIsShown] = useState(false);
  const role = useSessionStore((state) => state.role);

  return (
    <li
      className="border border-slate-300 bg-slate-50 px-4 py-2 rounded-lg transition-all duration-200 active:bg-slate-200 cursor-pointer"
      onClick={() => {
        if (isRoleAllowed(["coordinator", "superior", "admin"], role))
          handleOnClick();
      }}
    >
      <div className="flex w-full py-1 cursor-pointer">
        <div className="flex w-full">
          <h3>{title}</h3>
        </div>
        <div className="flex" onClick={() => setIsShown((prev) => !prev)}>
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
        <div className="flex flex-col">
          <div className="flex flex-col px-3 py-1 w-full border-l border-slate-300 mb-2">
            <h3 className="text-slate-400">Reason</h3>
            <p className="text-slate-400">{description}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
