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
            onSubmit={handleUploadRequest}
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
            <SheetFooter>
              <LoadingButton
                loadingDisplayText="Submitting..."
                displayText="Submit"
                isSpinning={isSpinning}
              />
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
