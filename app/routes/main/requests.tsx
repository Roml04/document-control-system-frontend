import { Separator } from "~/components/ui/separator";
import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/requests";
import type { UserType } from "~/constants/types";
import enumFormatter from "~/utils/enumFormatter";
import { REQUESTSTATUS } from "~/constants/enums";
import { ScrollArea } from "~/components/ui/scroll-area";

import { Outlet, useNavigate } from "react-router";
import { Sheet, SheetContent, SheetHeader } from "~/components/ui/sheet";
import { useEffect, useReducer, useState } from "react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item";

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
};

type ViewRequestActionType = {
  type: ACTION;
  payload: Partial<ViewRequestStateType>;
};

export async function clientLoader() {
  const apiResponse = await apiFetch("/request");

  return apiResponse as {
    ok: boolean;
    data: ViewRequestStateType[];
    message: string;
  };
}

export default function requests({ loaderData }: Route.ComponentProps) {
  /**
   * Data from server
   */
  const { ok, data, message } = loaderData;

  /**
   * Hook initialization
   */
  const [openReqItemSheet, setOpenReqItemSheet] = useState(false);
  const navigate = useNavigate();

  console.log(`INFO | apiResponse.ok: ${ok}`);
  console.log(`INFO | REQUESTS:`, data);
  console.log(`INFO | ${message}`);

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
    console.log(viewRequestState);
  }, [viewRequestState]);

  /**
   * Functions
   */

  const renderRequestOnSheet = (request: ViewRequestStateType) => {
    viewRequestDispatch({ type: ACTION.SETDETAILS, payload: request });
    setOpenReqItemSheet(true);
  };

  /**
   * styling variables
   */

  const gridStyling = "grid grid-cols-20";

  const columnWidths = {
    title: "w-full px-2 col-span-5 content-center",
    reason: "w-full px-2 col-span-7 content-center",
    status: "w-full px-2 col-span-3 content-center",
    author: "w-full px-2 col-span-2 content-center",
    uploadDate: "w-full px-2 w-full col-span-3 content-center",
    // action: "w-full px-2 col-span-1 content-center",
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1>Requests</h1>
        <Separator />
        <div className="flex-1">
          <div>
            {/* HEADER */}
            <div className={`${gridStyling} place-items-center py-2`}>
              <div className={`${columnWidths.title} `}>
                <h3>Title</h3>
              </div>
              <div
                className={`${columnWidths.reason} border-x border-gray-200`}
              >
                <h3>Reason</h3>
              </div>
              <div className={`${columnWidths.status}`}>
                <h3>Status</h3>
              </div>
              <div
                className={`${columnWidths.author} border-x border-gray-200`}
              >
                <h3>Author</h3>
              </div>
              <div className={`${columnWidths.uploadDate}`}>
                <h3>Upload Date</h3>
              </div>
            </div>
            <ul>
              <ScrollArea className="h-[52em]">
                {data.map((request) => {
                  let textStyle = "";

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
                      className={`${gridStyling} cursor-pointer py-3 border-t border-gray-200 rounded-lg hover:bg-accent`}
                      key={request.id}
                      onClick={() => renderRequestOnSheet(request)}
                    >
                      <div className={`${columnWidths.title} `}>
                        <p>{request.title}</p>
                      </div>
                      <div className={`${columnWidths.reason}`}>
                        <p>{request.reason}</p>
                      </div>
                      <div className={`${columnWidths.status} ${textStyle}`}>
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
                    </li>
                  );
                })}
              </ScrollArea>
            </ul>
          </div>
        </div>
      </div>
      <Sheet open={openReqItemSheet} onOpenChange={setOpenReqItemSheet}>
        <SheetContent className="w-[30vw] sm:max-w-[30vw]! h-dvh p-0">
          <div className="flex h-full min-h-0 flex-col">
            <SheetHeader>
              <h1>{viewRequestState.title}</h1>
              <p>
                {`${viewRequestState.user?.firstName ?? ""} ${
                  viewRequestState.user?.lastName ?? ""
                }`.trim() ?? "Unknown User"}
              </p>
            </SheetHeader>
            <Separator />
            <ScrollArea className="flex-1 min-h-0 px-4 py-4">
              <div className="flex flex-col gap-2">
                <h2>Request Details</h2>
                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-3">
                    <h3>Reason</h3>
                    <p className="">{viewRequestState.reason}</p>
                  </div>
                  <div className="grid grid-cols-3">
                    <h3>Status</h3>
                    <p className="">
                      {viewRequestState.status
                        ? enumFormatter(viewRequestState.status)
                        : "Unknown Status"}
                    </p>
                  </div>
                  <div className="grid grid-cols-3">
                    <h3>Upload Date</h3>
                    <p className="">{viewRequestState.uploadDate}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
