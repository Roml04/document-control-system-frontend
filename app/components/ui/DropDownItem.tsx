import { useState } from "react";
import { Icon } from "../primitives";
import { useSessionStore } from "stores/sessionStore";
import { isRoleAllowed } from "~/utils/isRoleAllowed";
import { REVISIONSTATUS } from "~/routes/Requests";

type DropDownItemProps = {
  title: string;
  description?: string;
  status: REVISIONSTATUS;
  handleOnClick: () => void;
  handleDeny: () => void;
};

export default function DropDownItem({
  title,
  description = "...",
  status,
  handleOnClick,
}: DropDownItemProps) {
  const statusStyles: Record<REVISIONSTATUS, string> = {
    [REVISIONSTATUS.PENDING]: "text-slate-300",
    [REVISIONSTATUS.APPROVED]: "text-gray-500",
    [REVISIONSTATUS.DENIED]: "text-red-600",
  };

  const [isShown, setIsShown] = useState(false);
  const role = useSessionStore((state) => state.role);

  function RevisionStatus({ status }: { status: REVISIONSTATUS }) {
    const capitalizedStatus = status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Unknown Status";

    return (
      <p className={`px-4 h-full ${statusStyles[status]}`}>
        {capitalizedStatus}
      </p>
    );
  }

  return (
    <li
      className="border border-slate-300 bg-slate-50 px-4 py-2 rounded-lg transition-all duration-200 active:bg-slate-200 cursor-pointer"
      onClick={() => {
        if (
          isRoleAllowed(
            ["coordinator", "superior", "admin", "originator"],
            role,
          )
        )
          handleOnClick();
      }}
    >
      <div className="flex w-full py-1 cursor-pointer">
        <div className="flex w-full justify-between">
          <h3>{title}</h3>
          <RevisionStatus status={status} />
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
