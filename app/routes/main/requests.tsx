import { Separator } from "~/components/ui/separator";
import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/requests";
import type { UserType } from "~/constants/types";
import { Ellipsis } from "lucide-react";
import enumFormatter from "~/utils/enumFormatter";
import { Button } from "~/components/ui/button";
import type { REQUESTSTATUS } from "~/constants/enums";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

type Request = {
  id: number;
  title: string;
  reason: string;
  status: REQUESTSTATUS;
  uploadDate: string;
  user: UserType;
};

export async function clientLoader() {
  const apiResponse = await apiFetch("/request");

  return apiResponse as {
    ok: boolean;
    data: Request[];
    message: string;
  };
}

export default function requests({ loaderData }: Route.ComponentProps) {
  const { ok, data, message } = loaderData;

  console.log(`INFO | ${ok}`);
  console.log(`INFO |`, data);
  console.log(`INFO | ${message}`);

  const gridStyling = "grid grid-cols-20";

  const columnWidths = {
    title: "w-full px-2 col-span-3 content-center",
    reason: "w-full px-2 col-span-7 content-center",
    status: "w-full px-2 col-span-3 content-center",
    author: "w-full px-2 col-span-3 content-center",
    uploadDate: "w-full px-2 w-full col-span-4 content-center",
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
              {/* <div className={`${columnWidths.action} text-center`}>
                  <h3>Action</h3>
                </div> */}
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
                      onClick={() => {}}
                    >
                      <div className={`${columnWidths.title} `}>
                        <p>{request.title}</p>
                      </div>
                      <div className={`${columnWidths.reason}`}>
                        <p>{request.reason}</p>
                      </div>
                      <div className={`${columnWidths.status} ${textStyle}`}>
                        <p>{enumFormatter(request.status)}</p>
                      </div>
                      <div className={`${columnWidths.author}`}>
                        <p>{`${request.user.firstName} ${request.user.lastName}`}</p>
                      </div>
                      <div className={`${columnWidths.uploadDate}`}>
                        <p>{request.uploadDate}</p>
                      </div>
                      {/* <div
                      className={`${columnWidths.action}  flex justify-center items-center`}
                    ></div> */}
                    </li>
                  );
                })}
              </ScrollArea>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
