import Header from "~/components/organisms/Header";
import type { Route } from "./+types/showFile";
import { apiFetch } from "~/utils/apiFetch";
import type { FileType, VersionType } from "~/constants/types";
import { Download, Ellipsis, PackageOpen } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import formatEnum from "~/utils/formatEnum";
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
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { useState } from "react";
import FileTypeBadge from "~/components/primitives/FileTypeBadge";
import { downloadFile } from "~/utils/downloadFile";
import { NavLink, useNavigate } from "react-router";
import CreateRevSheet from "~/components/organisms/CreateRevSheet";
import CreateDelSheet from "~/components/organisms/CreateDelSheet";

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

  const navigate = useNavigate();

  const [openReviseSheet, setOpenReviseSheet] = useState(false);
  const [openDeleteSheet, setOpenDeleteSheet] = useState(false);

  const colSpan = {
    revisionNumber: "col-span-5",
    author: "col-span-5",
    approvedDate: "col-span-5",
    action: "col-span-1",
  };

  const gridCols = "grid grid-cols-16";

  return (
    <>
      <div className="flex flex-col gap-4">
        <Header />
        {/* FILE */}
        <div className="flex flex-col border rounded-lg p-4 justify-center gap-4">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <div className="flex justify-center items-center rounded-sm bg-gray-200 aspect-square h-12">
                <FileTypeBadge type={file.type} size={22} />
              </div>
              <div className="flex flex-col">
                <h1>{file.title}</h1>
                <p>{formatEnum(file.type)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <NavLink
                to={`/onlyoffice/${latestVersion.id}?mode=view`}
                target="_blank"
              >
                <Button variant={"ghost"}>Open in editor</Button>
              </NavLink>
              <Button
                size={"icon-lg"}
                variant={"ghost"}
                title="Download"
                onClick={() => {
                  downloadFile(latestVersion.id, latestVersion.fileName);
                }}
              >
                <Download size={18} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon-lg"}>
                    <Ellipsis size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setOpenReviseSheet(true)}>
                      Revise
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setOpenDeleteSheet(true)}
                    >
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
                <p className="text-muted-foreground">Revision Details</p>
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
        <div className="flex flex-col border rounded-lg justify-center">
          <div className="flex flex-col">
            <h3 className="p-4">Version History</h3>
            <Separator />
          </div>
          <div className="flex flex-col">
            <div className={`${gridCols} p-4`}>
              <div className={`${colSpan.revisionNumber}`}>
                <h3>Revision Number</h3>
              </div>
              <div className={`${colSpan.author}`}>
                <h3>Author</h3>
              </div>
              <div className={`${colSpan.approvedDate}`}>
                <h3>Approved Date</h3>
              </div>
              <div className={`${colSpan.action} flex justify-center`}>
                <h3>Action</h3>
              </div>
            </div>
          </div>
          {file.versions.length !== 0 ? (
            <ul className="flex flex-col">
              <ScrollArea className="h-[34em]">
                {file.versions.map((version, index) => (
                  <li
                    key={index}
                    className={`${gridCols} px-4 hover:bg-accent cursor-pointer`}
                  >
                    <div
                      className={`col-span-15 grid grid-cols-15 py-4 content-center`}
                      onClick={() => navigate(`/admin/versions/${version.id}`)}
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
                    <div
                      className={`${colSpan.action} py-4 flex justify-center items-center`}
                    >
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
                                navigate(`/admin/versions/${version.id}`)
                              }
                            >
                              View
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                  <EmptyTitle>No versions to display</EmptyTitle>
                  <EmptyDescription>
                    There are currently no versions available for viewing.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </div>
      </div>
      <CreateRevSheet
        open={openReviseSheet}
        onOpenChange={setOpenReviseSheet}
        latestVersionid={latestVersion.id}
      />
      <CreateDelSheet
        open={openDeleteSheet}
        onOpenChange={setOpenDeleteSheet}
        latestVersionId={latestVersion.id}
        fileId={file.id}
      />
    </>
  );
}
