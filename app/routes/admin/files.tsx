import { FileIcon, FileUp, PackageOpen, Plus, XIcon } from "lucide-react";
import { useRef, useState, type SubmitEventHandler } from "react";
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
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import LoadingButton from "~/components/primitives/LoadingButton";
import { FILETYPE } from "~/constants/enums";
import { FileListHeader, FileListItem } from "~/components/organisms/FileList";

type FetchFileType = FileType & {
  latestVersion: VersionType;
};

type SubmitIntent = "request" | "direct";

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
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [openCreateSheet, setOpenCreateSheet] = useState(false);

  const { files, approvers } = loaderData;

  const handleUploadRequest: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();

    const submitter = event.nativeEvent.submitter as HTMLButtonElement | null;
    const intent = submitter?.value as SubmitIntent;

    if (!file) {
      toast.error("No file uploaded", {
        position: "top-center",
      });
      return;
    }

    const formData = new FormData(event.currentTarget);

    formData.append("type", "upl");
    formData.append("file", file);

    const apiResponse = await apiFetch(
      intent === "request" ? "/request" : "/admin/request",
      {
        method: "POST",
        body: formData,
      },
    );

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
  };

  return (
    <>
      <div className="flex flex-col gap-4 h-[55em]">
        <div className="flex justify-between">
          <h1>Files</h1>
          <Button onClick={() => setOpenCreateSheet(true)}>
            <Plus color="#ffffff" />
            Add File
          </Button>
        </div>
        <Separator />
        <FileListHeader />
        {files.length > 0 ? (
          <ScrollArea className="h-[52em] w-full ">
            <ul>
              {files.map((file, index) => {
                console.log("FILE", file);
                return <FileListItem key={index} file={file} />;
              })}
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
      <Sheet
        open={openCreateSheet}
        onOpenChange={(open) => {
          setOpenCreateSheet(open);

          if (!open) {
            setFile(null);
            formRef.current?.reset();
          }
        }}
      >
        <SheetContent
          className="w-[30vw] sm:max-w-[30vw]! h-dvh p-0"
          onInteractOutside={(event) => {
            event.preventDefault();
          }}
        >
          <form
            ref={formRef}
            onSubmit={() => handleUploadRequest}
            className="flex h-full min-h-0 flex-col"
          >
            <SheetHeader>
              <h1>Create a File</h1>
              <p>Submit an upload file request.</p>
            </SheetHeader>
            <Separator />

            <ScrollArea className="flex-1 min-h-0 px-4 py-4">
              <FieldSet>
                <FieldGroup>
                  <h2>Request Details</h2>
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="e.g., Request for document upload"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="reason">Reason</FieldLabel>
                    <Textarea
                      id="reason"
                      name="reason"
                      placeholder="Describe the purpose or reason for submitting this request..."
                      required
                    />
                  </Field>
                </FieldGroup>
                <Separator />
                <FieldGroup className="grid grid-cols-2">
                  <h2>File Details</h2>
                  <Field className="col-span-2">
                    <FieldLabel htmlFor="fileTitle">File Title</FieldLabel>
                    <Input
                      id="fileTitle"
                      type="text"
                      name="fileTitle"
                      placeholder="e.g., Waste Management Procedure"
                      required
                    />
                  </Field>
                  <Field className="col-span-2">
                    <FieldLabel htmlFor="fileType">File Type</FieldLabel>
                    <Select name="fileType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the file type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>File Type</SelectLabel>
                          {Object.values(FILETYPE).map((type, index) => (
                            <SelectItem key={index} value={type}>
                              {type[0].toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field className="col-span-2">
                    <FieldLabel htmlFor="originator">Originator</FieldLabel>
                    <Input
                      id="originator"
                      type="text"
                      name="originator"
                      placeholder="e.g., Juan Dela Cruz"
                      required
                    />
                  </Field>
                  <Field className="col-span-2">
                    <FieldLabel htmlFor="department">Department</FieldLabel>
                    <Input
                      id="department"
                      type="text"
                      name="department"
                      placeholder="e.g., Information Technology"
                      required
                    />
                  </Field>
                  <Field className="col-span-2">
                    <FieldLabel htmlFor="revisionNumber">
                      Revision Number
                    </FieldLabel>
                    <Input
                      id="revisionNumber"
                      type="text"
                      name="revisionNumber"
                      placeholder="e.g., Rev. 01"
                      required
                    />
                  </Field>
                  <Field className="col-span-2">
                    <FieldLabel htmlFor="revisionDetails">
                      Revision Details
                    </FieldLabel>
                    <Textarea
                      id="revisionDetails"
                      name="revisionDetails"
                      placeholder="Briefly describe the changes made..."
                    />
                  </Field>

                  {/* Disabled Fields */}
                  <Field className="col-span-1">
                    <FieldLabel htmlFor="uploadDate">Upload Date</FieldLabel>
                    <Input id="uploadDate" type="date" disabled />
                    <FieldDescription className="text-gray-400">
                      Automatically set on file upload
                    </FieldDescription>
                  </Field>
                  <Field className="col-span-1">
                    <FieldLabel htmlFor="revisionDate">
                      Revision Date
                    </FieldLabel>
                    <Input id="revisionDate" type="date" disabled />
                    <FieldDescription className="text-gray-400">
                      Revision date unavailable on file upload
                    </FieldDescription>
                  </Field>

                  <Field className="col-span-1">
                    <FieldLabel>Approver</FieldLabel>
                    <Select name="approver" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an Approver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Approvers</SelectLabel>
                          {approvers.map((approver) => {
                            const approverName = formatUserName(
                              approver.firstName,
                              approver.lastName,
                            );
                            return (
                              <SelectItem
                                key={approver.id}
                                value={approverName}
                              >
                                {approverName}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field className="col-span-1">
                    <FieldLabel htmlFor="approvedDate">
                      Approved Date
                    </FieldLabel>
                    <Input id="approvedDate" type="date" disabled />
                    <FieldDescription className="text-gray-400">
                      Automatically set upon approval
                    </FieldDescription>
                  </Field>
                  <Field className="col-span-2">
                    {file ? (
                      <>
                        <FieldLabel>File</FieldLabel>
                        <Attachment>
                          <AttachmentMedia>
                            <FileIcon />
                          </AttachmentMedia>
                          <AttachmentContent>
                            <AttachmentTitle>{file.name}</AttachmentTitle>
                            <AttachmentDescription>
                              {(file.size / 1024).toFixed(2)} KB
                            </AttachmentDescription>
                          </AttachmentContent>
                          <AttachmentActions>
                            <AttachmentAction
                              type="button"
                              onClick={() => setFile(null)}
                            >
                              <XIcon />
                            </AttachmentAction>
                          </AttachmentActions>
                        </Attachment>
                      </>
                    ) : (
                      <>
                        <FieldLabel>File</FieldLabel>
                        {/* DEV-NOTE: Make this into a component */}
                        <label
                          htmlFor="file"
                          className="flex flex-col border border-gray-200 rounded-lg bg-gray-100 items-center py-8 gap-2"
                        >
                          <FileUp />
                          <p>Upload a file</p>
                          <Input
                            id="file"
                            type="file"
                            className="sr-only"
                            onChange={(event) => {
                              setFile(event.target.files?.[0] ?? null);
                            }}
                          />
                        </label>
                        <FieldDescription className="text-gray-400">
                          Select a file to upload
                        </FieldDescription>
                      </>
                    )}
                  </Field>
                </FieldGroup>
              </FieldSet>
            </ScrollArea>
            <Separator />
            <SheetFooter className="flex flex-row">
              <LoadingButton
                name="intent"
                value={"request"}
                className="flex-1"
                loadingDisplayText="Submitting..."
                displayText="Submit as a Request"
                isSpinning={false}
                disabled={false}
              />
              <LoadingButton
                name="intent"
                value={"direct"}
                className="flex-1"
                loadingDisplayText="Submitting..."
                displayText="Direct Upload"
                isSpinning={false}
                disabled={false}
              />
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
