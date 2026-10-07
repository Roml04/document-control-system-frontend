import { PackageOpen, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/files";
import type { FileType, UserType, VersionType } from "~/constants/types";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import {
  FileListHeader,
  AdminFileListItem,
} from "~/components/organisms/FileList";
import AddPublishFileSheet from "~/components/organisms/AddPublishFileSheet";

type FetchFileType = FileType & {
  latestVersion: VersionType;
};

export async function clientLoader() {
  const [fileResponse, userResponse] = await Promise.all([
    apiFetch("/file"),
    apiFetch("/user?role=superior"),
  ]);

  return {
    files: fileResponse.data,
    approvers: userResponse.data,
  } as {
    files: FetchFileType[];
    approvers: UserType[];
  };
}

export default function files({ loaderData }: Route.ComponentProps) {
  const { files } = loaderData;
  const [openAddPublishSheet, setOpenAddPublishSheet] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1>Files</h1>
          <Button onClick={() => setOpenAddPublishSheet(true)}>
            <Plus color="#ffffff" />
            Add & Publish
          </Button>
        </div>
        <Separator />
        <div className="h-[50em]">
          <FileListHeader />
          {files.length > 0 ? (
            <ul>
              <ScrollArea className="h-[52em] w-full ">
                {files.map((file, index) => (
                  <AdminFileListItem key={index} file={file} />
                ))}
              </ScrollArea>
            </ul>
          ) : (
            <Empty className="h-full">
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
      <AddPublishFileSheet
        open={openAddPublishSheet}
        onOpenChange={setOpenAddPublishSheet}
      />
    </>
  );
}
