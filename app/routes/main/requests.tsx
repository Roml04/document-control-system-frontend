import { Separator } from "~/components/ui/separator";
import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/requests";
import type { UserType, VersionType } from "~/constants/types";
import enumFormatter from "~/utils/enumFormatter";
import { REQUESTSTATUS } from "~/constants/enums";
import { ScrollArea } from "~/components/ui/scroll-area";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "~/components/ui/sheet";
import { useEffect, useReducer, useState } from "react";

import { Ellipsis, File, PackageOpen, TriangleAlert } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "~/components/ui/attachment";
import { toast } from "sonner";
import fallbackIfNull from "~/utils/fallbackIfNull";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { apiFileFetch } from "~/utils/apiFileFetch";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { allowedRoles } from "~/utils/allowedRoles";

enum ACTION {
  SETDETAILS = "SETDETAILS",
  RESETDETAILS = "RESETDETAILS",
}

type ViewRequestStateType = {
  id: number | null;
  title: string;
  reason: string;
  status: REQUESTSTATUS | null;
  uploadDate: string | null;
  user: UserType | null;
  version: VersionType | null;
};

type ViewRequestActionType = {
  type: ACTION;
  payload: Partial<ViewRequestStateType>;
};

export async function clientLoader() {
  const apiResponse = await apiFetch("/request");

  return apiResponse as {
    ok: boolean;
    data: {
      myRequests: ViewRequestStateType[];
      forApprovals: ViewRequestStateType[];
    };
    message: string;
  };
}

export default function requests({ loaderData }: Route.ComponentProps) {
  /**
   * Data from server
   */
  let myRequests: ViewRequestStateType[] = [];
  let forApprovals: ViewRequestStateType[] = [];

  const { ok, data, message } = loaderData;

  console.log("INFO | LOADER DATA", data);

  if (data.myRequests) {
    myRequests = data.myRequests;
  }

  if (data.forApprovals) {
    forApprovals = data.forApprovals;
  }

  console.log("INFO | MY REQUESTS", myRequests);
  console.log("INFO | FOR APPROVALS", forApprovals);
  console.log(
    "INFO | CHECK IF BOTH ARRAYS ARE EMPTY",
    myRequests.length !== 0 || forApprovals.length !== 0,
  );

  /**
   * Hook initialization
   */
  const [openReqItemSheet, setOpenReqItemSheet] = useState(false);

  console.log(`INFO | RESPONSE OK: ${ok}`);
  console.log(`INFO | RESPONSE DATA:`, data);
  console.log(`INFO | RESPONSE MESSAGE ${message}`);

  /**
   * View request reducer
   */
  const viewRequestInitialState: ViewRequestStateType = {
    id: null,
    title: "",
    reason: "",
    status: null,
    uploadDate: null,
    user: null,
    version: null,
  };

  function viewRequestReducer(
    state: ViewRequestStateType,
    action: ViewRequestActionType,
  ) {
    switch (action.type) {
      case ACTION.SETDETAILS:
        return {
          ...state,
          ...action.payload,
        };

      case ACTION.RESETDETAILS:
        return viewRequestInitialState;

      default:
        return state;
    }
  }

  const [viewRequestState, viewRequestDispatch] = useReducer(
    viewRequestReducer,
    viewRequestInitialState,
  );

  /**
   * useEffect (dev)
   */
  useEffect(() => {
    console.log("INFO | Set data to to reducer state");
    console.log("INFO |", viewRequestState);
  }, [viewRequestState]);

  /**
   * Functions
   */

  const renderRequestOnSheet = async (request: ViewRequestStateType) => {
    try {
      console.log("INFO | RENDER REQUEST ON SHEET", request);

      if (!request.version) {
        return toast.success("Failed to show file details", {
          position: "top-center",
        });
      }

      const apiResponse = await apiFetch(`/version/${request.version.id}`);

      console.log("INFO | RESPONSE OK:", apiResponse.ok);
      console.log("INFO | RESPONSE DATA:", apiResponse.data);
      console.log("INFO | RESPONSE MESSAGE:", apiResponse.message);

      viewRequestDispatch({
        type: ACTION.SETDETAILS,
        payload: { ...request, version: apiResponse.data },
        // payload: { ...request, version: apiResponse.data },
      });

      setOpenReqItemSheet(true);
    } catch (error) {
      toast.error("", {
        position: "top-center",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again in a moment",
      });
    }
  };

  const accessUploadedFile = async () => {
    if (!viewRequestState.version) {
      return;
    }

    const response = await apiFileFetch(
      `/version/${viewRequestState.version.id}/file`,
    );

    if (!response.ok) {
      const apiResponse = await response.json();
      console.log("WOW", apiResponse);

      toast.error("Could not open the file", {
        position: "top-center",
        description: apiResponse.message,
      });

      return;
    }

    console.log("INFO | RESPONSE", response);

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");

    URL.revokeObjectURL(url);
  };

  /**
   * styling variables
   */

  const gridStyling = "grid grid-cols-21";

  const columnWidths = {
    title: "w-full px-2 col-span-5 content-center",
    reason: "w-full px-2 col-span-7 content-center",
    status: "w-full px-2 col-span-3 content-center",
    author: "w-full px-2 col-span-2 content-center",
    uploadDate: "w-full px-2 w-full col-span-3 content-center",
    action: "w-full px-2 w-full col-span-1 content-center",
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1>Requests</h1>
        <Separator />
        <div className="h-[45em]">
          {/* HEADER */}
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
              {allowedRoles([
                "coordinator",
                "superior",
                "manager",
                "sysadmin",
              ]) && <h3>Action</h3>}
            </div>
          </div>
          {myRequests.length !== 0 || forApprovals.length !== 0 ? (
            <div>
              <ul>
                <ScrollArea className="h-[52em]">
                  {/* MY REQUESTS */}
                  {myRequests.length !== 0 && (
                    <div className="px-2">
                      <h3>My Requests</h3>
                    </div>
                  )}
                  {myRequests.map((request, index) => {
                    let textStyle = "";

                    console.log("INFO | REQUEST:", request);

                    switch (request.status) {
                      case "denied":
                        textStyle = "text-destructive";
                        break;

                      case "approved":
                        textStyle = "text-green-600";
                        break;

                      default:
                        textStyle = "text-gray-500";
                    }

                    return (
                      <li
                        className={`grid grid-cols-21 cursor-pointer ${index !== 0 ? `border-t border-gray-200` : ``} rounded-lg hover:bg-accent`}
                        key={request.id}
                      >
                        <div
                          className={`col-span-20 py-5 grid grid-cols-20`}
                          onClick={() => renderRequestOnSheet(request)}
                        >
                          <div className={`${columnWidths.title} `}>
                            <p>{request.title}</p>
                          </div>
                          <div className={`${columnWidths.reason}`}>
                            <p>{request.reason}</p>
                          </div>
                          <div
                            className={`${columnWidths.status} ${textStyle}`}
                          >
                            <p>
                              {request.status
                                ? enumFormatter(request.status)
                                : "Unknown Status"}
                            </p>
                          </div>
                          <div className={`${columnWidths.author}`}>
                            <p>
                              {`${request.user?.firstName ?? ""} ${request.user?.lastName ?? ""}`.trim() ||
                                "Unknown User"}
                            </p>
                          </div>
                          <div className={`${columnWidths.uploadDate}`}>
                            <p>{request.uploadDate}</p>
                          </div>
                        </div>
                        {allowedRoles([
                          "coordinator",
                          "superior",
                          "manager",
                          "sysadmin",
                        ]) && (
                          <div className={`${columnWidths.action}`}>
                            <DropdownMenu>
                              <DropdownMenuTrigger onClick={() => {}}>
                                <Button size={"icon"} variant={"ghost"}>
                                  <Ellipsis />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                  {/* <DropdownMenuLabel>Title</DropdownMenuLabel> */}
                                  <DropdownMenuItem
                                    onClick={() => console.log("CLICKED")}
                                  >
                                    Review
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </li>
                    );
                  })}

                  {forApprovals.length !== 0 && (
                    <div className="px-2">
                      <h3>For Approvals</h3>
                    </div>
                  )}
                  {/* For Approvals */}
                  {forApprovals.map((request, index) => {
                    let textStyle = "";

                    console.log("INFO | REQUEST:", request);

                    switch (request.status) {
                      case "denied":
                        textStyle = "text-destructive";
                        break;

                      case "approved":
                        textStyle = "text-green-600";
                        break;

                      default:
                        textStyle = "text-gray-500";
                    }

                    return (
                      <li
                        className={`grid grid-cols-21 cursor-pointer ${index !== 0 ? `border-t border-gray-200` : ``} rounded-lg hover:bg-accent`}
                        key={request.id}
                      >
                        <div
                          className={`col-span-20 py-5 grid grid-cols-20`}
                          onClick={() => renderRequestOnSheet(request)}
                        >
                          <div className={`${columnWidths.title} `}>
                            <p>{request.title}</p>
                          </div>
                          <div className={`${columnWidths.reason}`}>
                            <p>{request.reason}</p>
                          </div>
                          <div
                            className={`${columnWidths.status} ${textStyle}`}
                          >
                            <p>
                              {request.status
                                ? enumFormatter(request.status)
                                : "Unknown Status"}
                            </p>
                          </div>
                          <div className={`${columnWidths.author}`}>
                            <p>
                              {`${request.user?.firstName ?? ""} ${request.user?.lastName ?? ""}`.trim() ||
                                "Unknown User"}
                            </p>
                          </div>
                          <div className={`${columnWidths.uploadDate}`}>
                            <p>{request.uploadDate}</p>
                          </div>
                        </div>
                        {allowedRoles([
                          "coordinator",
                          "superior",
                          "manager",
                          "sysadmin",
                        ]) && (
                          <div className={`${columnWidths.action}`}>
                            <DropdownMenu>
                              <DropdownMenuTrigger onClick={() => {}}>
                                <Button size={"icon"} variant={"ghost"}>
                                  <Ellipsis />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                  {/* <DropdownMenuLabel>Title</DropdownMenuLabel> */}
                                  <DropdownMenuItem
                                    onClick={() => console.log("CLICKED")}
                                  >
                                    Review
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ScrollArea>
              </ul>
            </div>
          ) : (
            <Empty className="h-full border-dashed gap-1">
              <EmptyMedia variant={"icon"}>
                <PackageOpen />
              </EmptyMedia>
              <EmptyHeader className="gap-1">
                <EmptyTitle>No requests to display</EmptyTitle>
                <EmptyDescription className="text-pretty">
                  There are currently no requests available for you to view or
                  review.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </div>
      <Sheet open={openReqItemSheet} onOpenChange={setOpenReqItemSheet}>
        <SheetContent className="w-[30vw] sm:max-w-[30vw]! h-dvh p-0">
          <div className="flex h-full min-h-0 flex-col">
            <SheetHeader>
              <h1>{viewRequestState.title}</h1>
              <Badge title="Authored by" className="cursor-pointer">
                {viewRequestState.status
                  ? enumFormatter(viewRequestState.status)
                  : "Unknown Status"}
              </Badge>
            </SheetHeader>
            <Separator />
            <ScrollArea className="flex-1 min-h-0 px-4 pt-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <h2>Request Details</h2>
                  <div className="px-4">
                    <div className="py-4 grid grid-cols-6">
                      <h3 className="py-2 col-span-2">Reason</h3>
                      <p className="py-2 col-span-4">
                        {viewRequestState.reason}{" "}
                      </p>
                    </div>
                    <div className="py-4 grid grid-cols-6">
                      <h3 className="py-2 col-span-2">Author</h3>
                      <p className="py-2 col-span-4">
                        {`${viewRequestState.user?.firstName ?? ""} ${
                          viewRequestState.user?.lastName ?? ""
                        }`.trim() ?? "Unknown User"}
                      </p>
                    </div>
                    <div className="py-4 grid grid-cols-6">
                      <h3 className="py-2 col-span-2">Upload Date</h3>

                      <p className="py-2 col-span-4">
                        {viewRequestState.uploadDate}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator />
                {viewRequestState.version ? (
                  <div className="flex flex-col">
                    <h2>File Details</h2>
                    <div className="px-4">
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Title</h3>
                        <p className="py-2 col-span-4">
                          {fallbackIfNull(
                            viewRequestState.version.fileTitle,
                            "--",
                          )}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Type</h3>
                        <p className="py-2 col-span-4">
                          {fallbackIfNull(
                            enumFormatter(viewRequestState.version.fileType),
                            "--",
                          )}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Originator</h3>
                        <p className="py-2 col-span-4">
                          {fallbackIfNull(
                            viewRequestState.version.originator,
                            "--",
                          )}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Department</h3>
                        <p className="py-2 col-span-4">
                          {fallbackIfNull(
                            viewRequestState.version.department,
                            "--",
                          )}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Revision Number</h3>
                        <p className="py-2 col-span-4">
                          {fallbackIfNull(
                            viewRequestState.version.revisionNumber,
                            "--",
                          )}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Revision Details</h3>
                        <p className="py-2 col-span-4">
                          {fallbackIfNull(
                            viewRequestState.version.revisionDetails,
                            "--",
                          )}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Upload Date</h3>
                        <p className="py-2 col-span-4">
                          {fallbackIfNull(
                            viewRequestState.version.uploadDate,
                            "--",
                          )}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Revision Date</h3>
                        <p className="py-2 col-span-4">
                          {fallbackIfNull(
                            viewRequestState.version.revisionDate,
                            "--",
                          )}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Approver</h3>
                        <p className="py-2 col-span-4">
                          {fallbackIfNull(
                            viewRequestState.version.approver,
                            "--",
                          )}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Approved Date</h3>
                        <p className="py-2 col-span-4">
                          {fallbackIfNull(
                            viewRequestState.version.approvedDate,
                            "--",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Empty className="h-full border-dashed gap-0">
                    <EmptyMedia variant={"icon"}>
                      <TriangleAlert />
                    </EmptyMedia>
                    <EmptyHeader>
                      <EmptyTitle>No version</EmptyTitle>
                      <EmptyDescription className="text-pretty">
                        This request is missing its associated version. Please
                        contact your administrator for assistance.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter>
              {!viewRequestState.version ||
              !viewRequestState.version?.filePath ? (
                <div>
                  <p className="text-muted-foreground">
                    The uploaded file could not be found.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <h3>Uploaded File</h3>
                  <Attachment className="w-full">
                    <AttachmentMedia>
                      <File />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>
                        {viewRequestState.version?.fileTitle ?? "Unknown file"}
                      </AttachmentTitle>
                      <AttachmentDescription>
                        {viewRequestState.version?.fileType ?? "Unknown type"}
                      </AttachmentDescription>
                    </AttachmentContent>
                    <AttachmentTrigger
                      onClick={accessUploadedFile}
                      className="cursor-pointer"
                    ></AttachmentTrigger>
                  </Attachment>
                </div>
              )}
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
