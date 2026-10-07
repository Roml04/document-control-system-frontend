import { Separator } from "~/components/ui/separator";
import { apiFetch } from "~/utils/apiFetch";
import type { UserType, VersionType } from "~/constants/types";
import { REQUESTSTATUS, REQUESTTYPE } from "~/constants/enums";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useState } from "react";
import { PackageOpen, Plus } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";

import {
  AdminRequestListItem,
  RequestListHeader,
} from "~/components/organisms/RequestList";
import type { Route } from "./+types/requests";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import CreateUplSheet from "~/components/organisms/CreateUplSheet";
import CreateRevSheet from "~/components/organisms/CreateRevSheet";
import CreateDelSheet from "~/components/organisms/CreateDelSheet";
import { useNavigate } from "react-router";

export type ViewRequestType = {
  id: number | null;
  type: REQUESTTYPE | null;
  title: string;
  reason: string;
  status: REQUESTSTATUS | null;
  uploadDate: string | null;
  user: UserType | null;
  version: VersionType | null;
};

export async function clientLoader() {
  const apiResponse = await apiFetch("/request");

  console.log("INFO | apiResponse data", apiResponse.data);

  return apiResponse.data as {
    myRequests: ViewRequestType[];
    forApprovals: ViewRequestType[];
  };
}

export default function requests({ loaderData }: Route.ComponentProps) {
  const { forApprovals } = loaderData;

  /**
   * Hook initialization
   */
  const [openCreateUplSheet, setOpenCreateUplSheet] = useState(false);
  const [openCreateRevSheet, setOpenCreateRevSheet] = useState(false);
  const [openCreateDelSheet, setOpenCreateDelSheet] = useState(false);
  const [openAddPublishSheet, setOpenAddPublishSheet] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex w-full justify-between">
          <h1>Requests</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus color="#ffffff" />
                Add a Request
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Request Type</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setOpenCreateUplSheet(true)}>
                  Upload
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenCreateRevSheet(true)}>
                  Revise
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenCreateDelSheet(true)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator />
        <div className="h-[50em]">
          <RequestListHeader />
          {forApprovals.length !== 0 ? (
            <ul>
              <ScrollArea className="h-[50em]">
                <div className="px-4 pt-2">
                  <h3>For Approvals</h3>
                </div>
                {forApprovals.map((request, index) => (
                  <AdminRequestListItem
                    key={index}
                    request={request}
                    onClick={() => navigate(`/admin/requests/${request.id}`)}
                  />
                ))}
              </ScrollArea>
            </ul>
          ) : (
            <Empty className="h-full">
              <EmptyHeader className="gap-1">
                <EmptyMedia variant={"icon"}>
                  <PackageOpen />
                </EmptyMedia>
                <EmptyTitle>No requests to display</EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </div>
      <CreateUplSheet
        open={openCreateUplSheet}
        onOpenChange={setOpenCreateUplSheet}
      />
      <CreateRevSheet
        open={openCreateRevSheet}
        onOpenChange={setOpenCreateRevSheet}
      />
      <CreateDelSheet
        open={openCreateDelSheet}
        onOpenChange={setOpenCreateDelSheet}
      />
    </>
  );
}
