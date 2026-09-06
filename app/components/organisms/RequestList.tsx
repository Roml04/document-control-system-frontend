import { REQUESTSTATUS, REQUESTTYPE } from "~/constants/enums";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import { useNavigate } from "react-router";
import { allowedRoles } from "~/utils/allowedRoles";
import enumFormatter from "~/utils/enumFormatter";
import type { ViewRequestStateType } from "~/routes/main/requests";

type RequestListItemPropType = {
  key: number;
  request: ViewRequestStateType;
  onClick: () => void;
  isOwned?: boolean;
};

const gridStyling = "grid grid-cols-21";

const columnWidths = {
  title: "w-full px-2 col-span-5 content-center",
  reason: "w-full px-2 col-span-7 content-center",
  status: "w-full px-2 col-span-3 content-center",
  author: "w-full px-2 col-span-2 content-center",
  uploadDate: "w-full px-2 w-full col-span-3 content-center",
  action: "w-full px-2 col-span-1 content-center",
};

export function RequestListHeader() {
  return (
    <div className={`${gridStyling} place-items-center py-2 mb-2`}>
      <div className={`${columnWidths.title} `}>
        <h3>Title</h3>
      </div>
      <div className={`${columnWidths.reason} border-x border-gray-200`}>
        <h3>Reason</h3>
      </div>
      <div className={`${columnWidths.status}`}>
        <h3>Status</h3>
      </div>
      <div className={`${columnWidths.author} border-x border-gray-200`}>
        <h3>Author</h3>
      </div>
      <div className={`${columnWidths.uploadDate}`}>
        <h3>Upload Date</h3>
      </div>
      <div className={`${columnWidths.action}`}>
        <h3>Action</h3>
      </div>
    </div>
  );
}

export function RequestListItem({
  key,
  request,
  onClick,
  isOwned = false,
}: RequestListItemPropType) {
  const navigate = useNavigate();

  console.log("INFO | RequestListItem Title", request.title);
  console.log("INFO | RequestListItem", request);

  let styleRequestStatus = "";

  switch (request.status) {
    case REQUESTSTATUS.DENIED:
      styleRequestStatus = "text-destructive";
      break;

    case REQUESTSTATUS.APPROVED:
      styleRequestStatus = "text-green-600";
      break;

    case REQUESTSTATUS.ORIGINATOREDIT:
      styleRequestStatus = "text-amber-500";
      break;

    default:
      styleRequestStatus = "text-gray-500";
  }

  return (
    <li
      className={`grid grid-cols-21 cursor-pointer ${key !== 0 ? `border-t border-gray-200` : ``} rounded-lg hover:bg-accent`}
      key={key}
    >
      <div className={`col-span-20 py-5 grid grid-cols-20`} onClick={onClick}>
        <div className={`${columnWidths.title} `}>
          <p>{request.title}</p>
        </div>
        <div className={`${columnWidths.reason}`}>
          <p>{request.reason}</p>
        </div>
        <div className={`${columnWidths.status} ${styleRequestStatus}`}>
          <p>
            {request.status ? enumFormatter(request.status) : "Unknown Status"}
          </p>
        </div>
        <div className={`${columnWidths.author}`}>
          <p>
            {`${request.user?.firstName ?? ""} ${request.user?.lastName ?? ""}`.trim() ||
              "Unknown User"}
          </p>
        </div>
        <div className={`${columnWidths.uploadDate}`}>
          <p>{request.version?.uploadDate ?? "--"}</p>
        </div>
      </div>

      <div className={`${columnWidths.action}`}>
        <DropdownMenu>
          <DropdownMenuTrigger onClick={() => {}}>
            <Button size={"icon"} variant={"ghost"}>
              <Ellipsis size={16} className="cursor-pointer" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/requests/${request.id}`);
                }}
              >
                View
              </DropdownMenuItem>
              {allowedRoles(["originator", "sysadmin"]) &&
              request.type === REQUESTTYPE.REVISION &&
              request.status === REQUESTSTATUS.ORIGINATOREDIT ? (
                <DropdownMenuItem
                  onClick={() => {
                    navigate(`/versions/${request.version?.id}/edit`);
                  }}
                >
                  Edit
                </DropdownMenuItem>
              ) : (
                <></>
              )}
              {allowedRoles([
                "coordinator",
                "superior",
                "manager",
                "sysadmin",
              ]) &&
                !isOwned && (
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(`/requests/${request.id}/review`);
                    }}
                  >
                    Review
                  </DropdownMenuItem>
                )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}
