import { useState } from "react";
import { Icon } from "../primitives";
import { useSessionStore } from "stores/sessionStore";
import { isRoleAllowed } from "~/utils/isRoleAllowed";
import { REVISIONSTATUS } from "~/constants";

type DropDownItemProps = {
  title: string;
  description?: string;
  status: REVISIONSTATUS;
  handleOnClick: () => void;
};

export default function DropDownItem({
  title,
  description = "...",
  status,
  handleOnClick,
}: DropDownItemProps) {
  const statusInfo: Record<REVISIONSTATUS, Record<string, string>> = {
    [REVISIONSTATUS.COORDINATOR]: {
      style: "text-slate-400",
      title: "Pending Coordinator Approval",
    },
    [REVISIONSTATUS.SUPERIOR]: {
      style: "text-slate-400",
      title: "Pending Superior Approval",
    },
    [REVISIONSTATUS.APPROVED]: { style: "text-green-500", title: "Approved" },
    [REVISIONSTATUS.DENIED]: { style: "text-red-600", title: "Denied" },
  };

  const [isShown, setIsShown] = useState(false);
  const role = useSessionStore((state) => state.role);

  function RevisionStatus({ status }: { status: REVISIONSTATUS }) {
    const { title, style } = statusInfo[status];
    return (
      <p
        className={`
        flex-1
        truncate
        ${style}
      `}
        title={title}
      >
        {status ? title : "Unknown Status"}
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
        <div className="flex flex-col w-full min-w-0 overflow-hidden">
          <h3 className="flex-1 text-nowrap">{title}</h3>
          <RevisionStatus status={status} />
        </div>
        <div
          className="flex items-center"
          onClick={() => setIsShown((prev) => !prev)}
        >
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
