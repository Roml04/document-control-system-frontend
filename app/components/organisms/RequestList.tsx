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
import { useNavigate, useRevalidator } from "react-router";
import { allowedRoles } from "~/utils/allowedRoles";
import formatEnum from "~/utils/formatEnum";
import type { ViewRequestStateType } from "~/routes/main/requests";
import { apiFetch } from "~/utils/apiFetch";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";

const gridStyling = "grid grid-cols-21";

const columnWidths = {
  title: "w-full px-2 col-span-5 content-center",
  reason: "w-full px-2 col-span-7 content-center",
  type: "w-full px-2 col-span-1 content-center",
  status: "w-full px-2 col-span-2 content-center truncate",
  author: "w-full px-2 col-span-2 content-center",
  uploadDate: "w-full px-2 w-full col-span-3 content-center",
  action: "w-full px-2 col-span-1 content-center",
};

function styleRequestStatus(status: REQUESTSTATUS) {
  switch (status) {
    case REQUESTSTATUS.DENIED:
      return "text-destructive";

    case REQUESTSTATUS.APPROVED:
      return "text-green-600";

    case REQUESTSTATUS.ORIGINATOREDIT:
      return "text-amber-500";

    default:
      return "";
  }
}

export function RequestListHeader() {
  return (
    <div className={`${gridStyling} place-items-center py-2 mb-2`}>
      <div className={`${columnWidths.title} `}>
        <h3>Title</h3>
      </div>
      <div className={`${columnWidths.reason} border-gray-200`}>
        <h3>Reason</h3>
      </div>
      <div className={`${columnWidths.type}`}>
        <h3>Type</h3>
      </div>
      <div className={`${columnWidths.status} border-gray-200`}>
        <h3>Status</h3>
      </div>
      <div className={`${columnWidths.author}`}>
        <h3>Author</h3>
      </div>
      <div className={`${columnWidths.uploadDate} border-gray-200`}>
        <h3>Upload Date</h3>
      </div>
      <div className={`${columnWidths.action}`}>
        <h3>Action</h3>
      </div>
    </div>
  );
}

type RequestListItemPropType = {
  index: number;
  request: ViewRequestStateType;
  onClick: () => void;
  isOwned?: boolean;
};

export function RequestListItem({
  index,
  request,
  onClick,
  isOwned = false,
}: RequestListItemPropType) {
  const navigate = useNavigate();

  return (
    <li
      className={`grid grid-cols-21 cursor-pointer ${index !== 0 ? `border-t border-gray-200` : ``} rounded-lg hover:bg-accent`}
      key={index}
    >
      <div className={`col-span-20 py-5 grid grid-cols-20`} onClick={onClick}>
        <div className={`${columnWidths.title} `}>
          <p>{request.title}</p>
        </div>
        <div className={`${columnWidths.reason}`}>
          <p>{request.reason}</p>
        </div>
        <div className={`${columnWidths.type} `}>
          <p>{request.type ? `${request.type}`.toUpperCase() : "--"}</p>
        </div>
        <div
          className={`${columnWidths.status} ${request.status ? styleRequestStatus(request.status) : ""}`}
        >
          <p>
            {request.status ? formatEnum(request.status) : "Unknown Status"}
          </p>
        </div>
        <div className={`${columnWidths.author}`}>
          <p>
            {`${request.user?.firstName ?? ""} ${request.user?.lastName ?? ""}`.trim() ||
              "Unknown User"}
          </p>
        </div>
        <div className={`${columnWidths.uploadDate}`}>
          <p>{request.uploadDate ?? "--"}</p>
        </div>
      </div>

      <div className={`${columnWidths.action}`}>
        <DropdownMenu>
          <DropdownMenuTrigger onClick={() => {}} asChild>
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
              {allowedRoles(["originator", "sysadmin"]) &&
                request.status === REQUESTSTATUS.DENIED && (
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(
                        `/requests/${request.id}/resubmit?type=${request.type}`,
                      );
                    }}
                  >
                    Resubmit
                  </DropdownMenuItem>
                )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}

export function AdminRequestListItem({
  index,
  request,
  onClick,
  isOwned = false,
}: RequestListItemPropType) {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const revalidator = useRevalidator();

  const navigate = useNavigate();

  const handleDeleteRequest = async () => {
    try {
      const apiResponse = await apiFetch(`/admin/request/${request.id}`, {
        method: "DELETE",
      });

      if (!apiResponse.ok) {
        toast.error("Failed to delete request", {
          position: "top-center",
          description: apiResponse.message,
        });
        return;
      }

      revalidator.revalidate();

      toast.success("Request deleted", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to delete request", {
        position: "top-center",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
    }
  };

  return (
    <>
      <li
        className={`grid grid-cols-21 cursor-pointer ${index !== 0 ? `border-t border-gray-200` : ``} rounded-lg hover:bg-accent`}
        key={index}
      >
        <div className={`col-span-20 py-5 grid grid-cols-20`} onClick={onClick}>
          <div className={`${columnWidths.title} `}>
            <p>{request.title}</p>
          </div>
          <div className={`${columnWidths.reason}`}>
            <p>{request.reason}</p>
          </div>
          <div className={`${columnWidths.type} `}>
            <p>{request.type ? `${request.type}`.toUpperCase() : "--"}</p>
          </div>
          <div
            className={`${columnWidths.status} ${request.status ? styleRequestStatus(request.status) : ""}`}
          >
            <p>
              {request.status ? formatEnum(request.status) : "Unknown Status"}
            </p>
          </div>
          <div className={`${columnWidths.author}`}>
            <p>
              {`${request.user?.firstName ?? ""} ${request.user?.lastName ?? ""}`.trim() ||
                "Unknown User"}
            </p>
          </div>
          <div className={`${columnWidths.uploadDate}`}>
            <p>{request.uploadDate ?? "--"}</p>
          </div>
        </div>

        <div className={`${columnWidths.action}`}>
          <DropdownMenu>
            <DropdownMenuTrigger onClick={() => {}} asChild>
              <Button size={"icon"} variant={"ghost"}>
                <Ellipsis size={16} className="cursor-pointer" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    navigate(`/admin/requests/${request.id}`);
                  }}
                >
                  View
                </DropdownMenuItem>
                {allowedRoles(["sysadmin"]) && (
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(`/admin/requests/${request.id}/edit`);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                )}
                {allowedRoles(["sysadmin"]) &&
                  !(
                    request.status &&
                    [
                      REQUESTSTATUS.APPROVED,
                      REQUESTSTATUS.DENIED,
                      REQUESTSTATUS.ORIGINATOREDIT,
                    ].includes(request.status)
                  ) && (
                    <DropdownMenuItem
                      onClick={() => {
                        navigate(`/requests/${request.id}/review`);
                      }}
                    >
                      Review
                    </DropdownMenuItem>
                  )}
                {allowedRoles(["sysadmin"]) &&
                  request.status === REQUESTSTATUS.DENIED && (
                    <DropdownMenuItem
                      onClick={() => {
                        navigate(
                          `/requests/${request.id}/resubmit?type=${request.type}`,
                        );
                      }}
                    >
                      Resubmit
                    </DropdownMenuItem>
                  )}
                {allowedRoles(["sysadmin"]) && (
                  <DropdownMenuItem onClick={() => setOpenDeleteAlert(true)}>
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </li>
      <AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm file deletion?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-bold">{request.title}</span> and bypass the
              approval process. This action cannot be undone. Do you want to
              proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={"destructive"}
              onClick={handleDeleteRequest}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
