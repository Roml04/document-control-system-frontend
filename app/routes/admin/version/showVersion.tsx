import Header from "~/components/organisms/Header";
import { apiFetch } from "~/utils/apiFetch";
import type { RequestType, UserType, VersionType } from "~/constants/types";
import FileTypeBadge from "~/components/primitives/FileTypeBadge";
import { NavLink, useNavigate } from "react-router";
import { Download, Ellipsis, PackageOpen } from "lucide-react";
import { Button } from "~/components/ui/button";
import formatEnum from "~/utils/formatEnum";
import { downloadFile } from "~/utils/downloadFile";
import { Separator } from "~/components/ui/separator";
import { formatUserName } from "~/utils/formatUserName";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import type { Route } from "./+types/showVersion";

const gridStyling = "grid grid-cols-10";

const columnWidths = {
  id: "col-span-1 px-4",
  title: "col-span-3",
  status: "col-span-3",
  author: "col-span-2",
  action: "col-span-1 flex justify-center items-center",
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const fetchedVersion = await apiFetch(`/admin/version/${params.id}`);

  console.log("VERSION", fetchedVersion);

  return fetchedVersion.data as VersionType & {
    request: Pick<RequestType, "id" | "title" | "status" | "user"> & {
      user: Pick<UserType, "firstName" | "lastName">;
    };
  };
}

export default function showVersion({ loaderData }: Route.ComponentProps) {
  const version = loaderData;

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <Header />
      <div className="border p-4 rounded-lg flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <div className="flex justify-center items-center rounded-sm bg-gray-200 aspect-square h-12">
              <FileTypeBadge type={version.fileType} size={22} />
            </div>
            <div className="flex flex-col">
              <h1>{version.fileTitle}</h1>
              <p>{formatEnum(version.fileType)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <NavLink to={`/onlyoffice/${version.id}?mode=view`} target="_blank">
              <Button variant={"ghost"}>Open in editor</Button>
            </NavLink>
            <Button
              size={"icon-lg"}
              variant={"ghost"}
              title="Download"
              onClick={() => {
                downloadFile(version.id, version.fileName);
              }}
            >
              <Download size={18} />
            </Button>
          </div>
        </div>
        <Separator />
        <div>
          <div className="grid grid-cols-4 gap-y-4">
            <div>
              <p className="text-muted-foreground">Originator</p>
              <p>{version.originator}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Department</p>
              <p>{version.department}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Revision Number</p>
              <p>{version.revisionNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Revision Details</p>
              <p>{version.revisionDetails}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Upload Date</p>
              <p>{version.uploadDate}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Revision Date</p>
              <p>{version.revisionDate}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Approver</p>
              <p>{version.approver}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Approved Date</p>
              <p>{version.approvedDate ?? "--"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full">
        <div className="w-full border rounded-lg">
          <h3 className="p-4">Request</h3>
          <Separator />
          <div>
            {version.request ? (
              <>
                <div className={`${gridStyling} p-4`}>
                  <h3 className={columnWidths.id}>ID</h3>
                  <h3 className={columnWidths.title}>Title</h3>
                  <h3 className={columnWidths.status}>Status</h3>
                  <h3 className={columnWidths.author}>Author</h3>
                  <div className={columnWidths.action}>
                    <h3>Action</h3>
                  </div>
                </div>
                <div
                  className={`${gridStyling} px-4 cursor-pointer hover:bg-accent items-center-center`}
                >
                  <div
                    onClick={() =>
                      navigate(`/admin/requests/${version.request.id}`)
                    }
                    className="col-span-9 grid grid-cols-9 py-4 items-center"
                  >
                    <p className={columnWidths.id}>{version.request.id}</p>
                    <p className={columnWidths.title}>
                      {version.request.title}
                    </p>
                    <p className={columnWidths.status}>
                      {version.request.status}
                    </p>
                    <p className={columnWidths.author}>
                      {formatUserName(
                        version.request.user.firstName,
                        version.request.user.lastName,
                      )}
                    </p>
                  </div>
                  <div className={`${columnWidths.action} py-4`}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/admin/requests/${version.request.id}`)
                            }
                          >
                            View
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant={"icon"}>
                    <PackageOpen />
                  </EmptyMedia>
                  <EmptyTitle>Request Not Found</EmptyTitle>
                  <EmptyDescription>
                    The request associated with this version could not be found.
                    It may have been deleted or is no longer available.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
