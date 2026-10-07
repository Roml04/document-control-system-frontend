import { FileIcon, FileUp, PackageOpen, Plus, XIcon } from "lucide-react";
import { useReducer, useRef, useState, type SubmitEventHandler } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "~/components/ui/attachment";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";
import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/files";
import type { FileType, UserType, VersionType } from "~/constants/types";
import { formatUserName } from "~/utils/formatUserName";
import FileCard from "~/components/primitives/FileCard";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import LoadingButton from "~/components/primitives/LoadingButton";
import { FILETYPE } from "~/constants/enums";
import CreateUplSheet from "~/components/organisms/CreateUplSheet";

type FetchFileType = FileType & { latestVersion: VersionType };

export async function clientLoader() {
  const [fileResponse, userResponse] = await Promise.all([
    apiFetch("/file"),
    apiFetch("/user?role=superior"),
  ]);

  console.log("INFO | files.tsx clientLoader fileResponse", fileResponse);
  console.log("INFO | files.tsx clientLoader userResponse", userResponse);

  return {
    files: fileResponse.data,
    approvers: userResponse.data,
  } as {
    files: FetchFileType[];
    approvers: UserType[];
  };
}

export default function files({ loaderData }: Route.ComponentProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  let files: FetchFileType[] = [];
  let approvers: UserType[] = [];

  if (loaderData.files.length !== 0) {
    files = loaderData.files;
  }

  if (loaderData.approvers.length !== 0) {
    approvers = loaderData.approvers;
  }

  /**
   * Hook initialization
   */
  const [openCreateSheet, setOpenCreateSheet] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  /**
   * Functions
   */
  const handleUploadRequest: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    try {
      setIsSpinning(true);
      event.preventDefault();

      if (!file) {
        toast.error("No file uploaded", {
          position: "top-center",
        });
        return;
      }

      const formData = new FormData(event.currentTarget);

      formData.append("type", "upl");
      formData.append("file", file);

      console.log("FORMDATA", Object.fromEntries(formData.entries()));

      const apiResponse = await apiFetch("/request", {
        method: "POST",
        body: formData,
      });

      console.log("INFO | RESPONSE OK", apiResponse.ok);
      console.log("INFO | RESPONSE DATA", apiResponse.data);

      if (!apiResponse.ok) {
        console.log("INFO | MESSAGE", apiResponse.message);
        return toast.error("Submission failed", {
          description: apiResponse.message,
          position: "top-center",
        });
      }

      setOpenCreateSheet(false);
      formRef.current?.reset();
      setFile(null);

      return toast.success("Upload file request submitted", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to submit upload file request", {
        position: "top-center",
      });
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 h-[55em]">
        <div className="flex justify-between">
          <h1>Files</h1>
          <Button
            onClick={() => {
              setOpenCreateSheet(true);
            }}
          >
            <Plus color="#ffffff" />
            Add File
          </Button>
        </div>
        <Separator />
        {files.length > 0 ? (
          <ScrollArea className="h-[52em] w-full ">
            <ul className="grid grid-cols-4 gap-x-4 gap-y-2">
              {files.map((file) => (
                <FileCard file={file} uri={`/files/${file.id}`} />
              ))}
            </ul>
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
      <CreateUplSheet
        open={openCreateSheet}
        onOpenChange={setOpenCreateSheet}
      />
    </>
  );
}
