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

import { File, PackageOpen, TriangleAlert } from "lucide-react";
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { apiFileFetch } from "~/utils/apiFileFetch";

import {
  RequestListHeader,
  RequestListItem,
} from "~/components/organisms/RequestList";
import { formatUserName } from "~/utils/formatUserName";

enum ACTION {
  SETDETAILS = "SETDETAILS",
  RESETDETAILS = "RESETDETAILS",
}

export type ViewRequestStateType = {
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

  console.log("INFO | apiResponse", apiResponse);

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

  const { data } = loaderData;

  if (data.myRequests) {
    myRequests = data.myRequests;
  }

  if (data.forApprovals) {
    forApprovals = data.forApprovals;
  }

  /**
   * Hook initialization
   */
  const [openReqItemSheet, setOpenReqItemSheet] = useState(false);

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
   * Functions
   */
  const renderRequestOnSheet = async (request: ViewRequestStateType) => {
    try {
      console.log("INFO | RENDER REQUEST ON SHEET", request);
      console.log("INFO | REQUEST VERSION", request.version);

      if (!request.version) {
        return toast.success("Failed to show file details", {
          position: "top-center",
          description: "No version associated with this request",
        });
      }

      const apiResponse = await apiFetch(`/version/${request.version.id}`);

      console.log("INFO | RESPONSE OK:", apiResponse.ok);
      console.log("INFO | RESPONSE DATA:", apiResponse.data);
      console.log("INFO | RESPONSE MESSAGE:", apiResponse.message);

      viewRequestDispatch({
        type: ACTION.SETDETAILS,
        payload: { ...request, version: apiResponse.data },
      });

      setOpenReqItemSheet(true);
    } catch (error) {
      toast.error("An error occurred", {
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

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1>Requests</h1>
        <Separator />
        <div className="h-[45em]">
          {/* HEADER */}
          <RequestListHeader />
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
                    return (
                      <RequestListItem
                        key={index}
                        request={request}
                        onClick={() => renderRequestOnSheet(request)}
                        isOwned={true}
                      />
                    );
                  })}

                  {forApprovals.length !== 0 && (
                    <div className="px-2">
                      <h3>For Approvals</h3>
                    </div>
                  )}
                  {/* For Approvals */}
                  {forApprovals.map((request, index) => {
                    return (
                      <RequestListItem
                        key={index}
                        request={request}
                        onClick={() => renderRequestOnSheet(request)}
                      />
                    );
                  })}
                </ScrollArea>
              </ul>
            </div>
          ) : (
            <Empty className="h-full">
              <EmptyHeader className="gap-1">
                <EmptyMedia variant={"icon"}>
                  <PackageOpen />
                </EmptyMedia>
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
                {enumFormatter(viewRequestState.status) ?? "--"}
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
                        {viewRequestState.reason ?? "--"}
                      </p>
                    </div>
                    <div className="py-4 grid grid-cols-6">
                      <h3 className="py-2 col-span-2">Author</h3>
                      <p className="py-2 col-span-4">
                        {formatUserName(
                          viewRequestState.user?.firstName,
                          viewRequestState.user?.lastName,
                        )}
                      </p>
                    </div>
                    <div className="py-4 grid grid-cols-6">
                      <h3 className="py-2 col-span-2">Upload Date</h3>

                      <p className="py-2 col-span-4">
                        {viewRequestState.uploadDate ?? "--"}
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
                          {viewRequestState.version.fileTitle ?? "--"}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Type</h3>
                        <p className="py-2 col-span-4">
                          {enumFormatter(viewRequestState.version.fileType) ??
                            "--"}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Originator</h3>
                        <p className="py-2 col-span-4">
                          {viewRequestState.version.originator ?? "--"}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Department</h3>
                        <p className="py-2 col-span-4">
                          {viewRequestState.version.department ?? "--"}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Revision Number</h3>
                        <p className="py-2 col-span-4">
                          {viewRequestState.version.revisionNumber ?? "--"}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Revision Details</h3>
                        <p className="py-2 col-span-4">
                          {viewRequestState.version.revisionDetails ?? "--"}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Upload Date</h3>
                        <p className="py-2 col-span-4">
                          {viewRequestState.version.uploadDate ?? "--"}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Revision Date</h3>
                        <p className="py-2 col-span-4">
                          {viewRequestState.version.revisionDate ?? "--"}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Approver</h3>
                        <p className="py-2 col-span-4">
                          {viewRequestState.version.approver ?? "--"}
                        </p>
                      </div>
                      <div className="py-4 grid grid-cols-6">
                        <h3 className="py-2 col-span-2">Approved Date</h3>
                        <p className="py-2 col-span-4">
                          {viewRequestState.version.approvedDate ?? "--"}
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
