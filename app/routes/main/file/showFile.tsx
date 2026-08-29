import Header from "~/components/organisms/Header";
import type { Route } from "./+types/showFile";
import { apiFetch } from "~/utils/apiFetch";
import type { FileType, VersionType } from "~/constants/types";
import { Divide, Download, Ellipsis, PackageOpen } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import TypeBadge from "~/components/primitives/TypeBadge";
import enumFormatter from "~/utils/enumFormatter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const apiResponse = await apiFetch(`/file/${params.id}`);

  console.log("INFO | CLIENT LOADER", apiResponse);

  return apiResponse.data as FileType & {
    latestVersion: VersionType;
    versions: VersionType[];
  };
}

export default function showFile({ loaderData }: Route.ComponentProps) {
  const file = loaderData;

  const latestVersion = file.latestVersion;

  const colSpan = {
    revisionNumber: "col-span-5",
    author: "col-span-5",
    approvedDate: "col-span-5",
    action: "col-span-1",
  };

  const gridCols = 16;
  // const gridCols = 8;

  return (
    <div className="flex flex-col gap-2">
      <Header />
      {/* FILE */}
      <div className="flex flex-col border rounded-lg p-4 justify-center gap-4">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <div className="flex justify-center items-center rounded-sm bg-gray-200 aspect-square h-12">
              <TypeBadge type={file.type} size={22} />
            </div>
            <div className="flex flex-col">
              <h1>{file.title}</h1>
              <p>{enumFormatter(file.type)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Button size={"icon-lg"} variant={"ghost"} title="Download">
              <Download size={18} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant={"ghost"} size={"icon-lg"}>
                  <Ellipsis size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Revise</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Separator />
        <div>
          <div className="grid grid-cols-4 gap-y-4">
            <div>
              <p className="text-muted-foreground">Originator</p>
              <p>{latestVersion.originator}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Department</p>
              <p>{latestVersion.department}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Revision Number</p>
              <p>{latestVersion.revisionNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Revision Detail</p>
              <p>{latestVersion.revisionDetails}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Upload Date</p>
              <p>{latestVersion.uploadDate}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Revision Date</p>
              <p>{latestVersion.revisionDate}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Approver</p>
              <p>{latestVersion.approver}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Approved Date</p>
              <p>{latestVersion.approvedDate}</p>
            </div>
          </div>
        </div>
      </div>
      {/* VERSIONS */}
      <div className="flex flex-col border rounded-lg justify-center">
        {/* HEADER */}
        <div className="flex flex-col pt-4">
          <h3 className="px-4">Version History</h3>
          <div className={`grid grid-cols-${gridCols} p-4 mb-2`}>
            <div className={`${colSpan.revisionNumber}`}>
              <h3>Revision Number</h3>
            </div>
            <div className={`${colSpan.author}`}>
              <h3>Author</h3>
            </div>
            <div className={`${colSpan.approvedDate}`}>
              <h3>Approved Date</h3>
            </div>
            <div className={`${colSpan.action}`}>
              <h3>Action</h3>
            </div>
          </div>
        </div>
        <Separator />
        {file.versions.length !== 0 ? (
          <ul className="flex flex-col h-[34em]">
            <ScrollArea className="">
              {file.versions.map((version, index) => (
                <li key={index} className={`hover:bg-accent`}>
                  <div
                    className={`p-4 grid grid-cols-${gridCols} flex items-center `}
                  >
                    <div
                      className={`col-span-${gridCols - 1} grid grid-cols-${gridCols - 1}`}
                    >
                      <p className={`${colSpan.revisionNumber}`}>
                        {version.revisionNumber}
                      </p>
                      <p className={`${colSpan.author}`}>
                        {version.originator}
                      </p>
                      <p className={`${colSpan.approvedDate}`}>
                        {version.approvedDate}
                      </p>
                    </div>
                    <div className={`${colSpan.action}`}>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant={"ghost"} size={"icon"}>
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => {
                                // navigate(`/requests/${request.id}`);
                              }}
                            >
                              View
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </li>
              ))}
            </ScrollArea>
          </ul>
        ) : (
          <div className="h-[34em] flex justify-center">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant={"icon"}>
                  <PackageOpen />
                </EmptyMedia>
                <EmptyTitle>No versios to display</EmptyTitle>
                <EmptyDescription>
                  There are currently no versions available for viewing.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}
      </div>
    </div>
  );
}
