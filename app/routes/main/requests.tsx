import { Separator } from "~/components/ui/separator";
import { apiFetch } from "~/utils/apiFetch";
import type { UserType, VersionType } from "~/constants/types";
import { REQUESTSTATUS, REQUESTTYPE } from "~/constants/enums";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PackageOpen, Plus } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  RequestListHeader,
  RequestListItem,
} from "~/components/organisms/RequestList";
import type { Route } from "./+types/requests";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { allowedRoles } from "~/utils/allowedRoles";
import CreateUplSheet from "~/components/organisms/CreateUplSheet";
import CreateRevSheet from "~/components/organisms/CreateRevSheet";
import CreateDelSheet from "~/components/organisms/CreateDelSheet";

export type ViewRequestStateType = {
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

  console.log("INFO | CLIENT LOADER [MAIN]", apiResponse);

  return apiResponse.data as {
    myRequests: ViewRequestStateType[];
    forApprovals: ViewRequestStateType[];
  };
}

export default function requests({ loaderData }: Route.ComponentProps) {
  const { myRequests, forApprovals } = loaderData;

  const [openCreateUplSheet, setOpenCreateUplSheet] = useState(false);
  const [openCreateRevSheet, setOpenCreateRevSheet] = useState(false);
  const [openCreateDelSheet, setOpenCreateDelSheet] = useState(false);
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
        <div className="h-[45em]">
          {/* HEADER */}
          <RequestListHeader />
          {myRequests.length !== 0 || forApprovals.length !== 0 ? (
            <div>
              <ul>
                <ScrollArea className="h-[52em]">
                  {/* MY REQUESTS */}
                  {myRequests.length !== 0 && (
                    <div className="px-4 py-2">
                      <h3>My Requests</h3>
                    </div>
                  )}
                  {myRequests.map((request, index) => {
                    return (
                      <RequestListItem
                        key={index}
                        request={request}
                        onClick={() => navigate(`/requests/${request.id}`)}
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
                        onClick={() => navigate(`/requests/${request.id}`)}
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
      <CreateUplSheet
        open={openCreateUplSheet}
        onOpenChange={setOpenCreateUplSheet}
      />
      {allowedRoles(["sysadmin"]) && (
        <CreateRevSheet
          open={openCreateRevSheet}
          onOpenChange={setOpenCreateRevSheet}
        />
      )}
      {allowedRoles(["sysadmin"]) && (
        <CreateDelSheet
          open={openCreateDelSheet}
          onOpenChange={setOpenCreateDelSheet}
        />
      )}
    </>
  );
}
