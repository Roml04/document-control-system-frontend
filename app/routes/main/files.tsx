import { PackageOpen, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/files";
import type { FileType, VersionType } from "~/constants/types";
import FileCard from "~/components/primitives/FileCard";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import CreateUplSheet from "~/components/organisms/CreateUplSheet";
import { allowedRoles } from "~/utils/allowedRoles";
import AddPublishFileSheet from "~/components/organisms/AddPublishFileSheet";
import {
  AdminFileListItem,
  FileListHeader,
} from "~/components/organisms/FileList";

type FetchFileType = FileType & { latestVersion: VersionType };

export async function clientLoader() {
  const fileResponse = await apiFetch("/file");

  console.log("INFO | CLIENT LOADER [MAIN]", fileResponse);

  return fileResponse.data as FetchFileType[];
}

export default function files({ loaderData }: Route.ComponentProps) {
  const files = loaderData;

  const [openCreateSheet, setOpenCreateSheet] = useState(false);
  const [openAddPublishSheet, setOpenAddPublishSheet] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 h-[55em]">
        <div className="flex justify-between">
          <h1>Files</h1>
          {allowedRoles(["sysadmin"]) && (
            <Button onClick={() => setOpenAddPublishSheet(true)}>
              <Plus color="#ffffff" />
              Add & Publish
            </Button>
          )}
          {allowedRoles(["originator"]) && (
            <Button
              onClick={() => {
                setOpenCreateSheet(true);
              }}
            >
              <Plus color="#ffffff" />
              Add File
            </Button>
          )}
        </div>
        <Separator />
        <div>
          {allowedRoles(["sysadmin"]) && <FileListHeader />}
          {files.length > 0 ? (
            <ScrollArea className="h-[52em] w-full">
              {allowedRoles(["sysadmin"]) ? (
                <ul>
                  {files.map((file, index) => (
                    <AdminFileListItem key={index} file={file} />
                  ))}
                </ul>
              ) : (
                <ul className="grid grid-cols-4 gap-x-4 gap-y-2">
                  {files.map((file, index) => (
                    <FileCard
                      key={index}
                      file={file}
                      uri={
                        allowedRoles(["sysadmin"])
                          ? `/admin/files/${file.id}`
                          : `/files/${file.id}`
                      }
                    />
                  ))}
                </ul>
              )}
            </ScrollArea>
          ) : (
            <Empty>
              <EmptyHeader className="gap-1">
                <EmptyMedia variant={"icon"}>
                  <PackageOpen />
                </EmptyMedia>
                <EmptyTitle>No files published at the moment</EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </div>
      <CreateUplSheet
        open={openCreateSheet}
        onOpenChange={setOpenCreateSheet}
      />
      <AddPublishFileSheet
        open={openAddPublishSheet}
        onOpenChange={setOpenAddPublishSheet}
      />
    </>
  );
}
