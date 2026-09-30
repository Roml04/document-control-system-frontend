import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentActions,
  AttachmentAction,
} from "~/components/ui/attachment";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "~/components/ui/sheet";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { FileIcon, FileUp, XIcon } from "lucide-react";
import LoadingButton from "~/components/primitives/LoadingButton";
import React, {
  useEffect,
  useRef,
  useState,
  type SubmitEventHandler,
} from "react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { FILETYPE } from "~/constants/enums";
import { formatUserName } from "~/utils/formatUserName";
import { apiFetch } from "~/utils/apiFetch";
import type { UserType } from "~/constants/types";
import { toast } from "sonner";
import { useRevalidator } from "react-router";

type CreateUplSheetType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export async function clientLoader() {
  const [fetchedApprovers] = await Promise.all([
    apiFetch("/user?role=superior"),
  ]);

  return {
    approvers: fetchedApprovers.data,
  } as {
    approvers: UserType[];
  };
}

export default function CreateUplSheet({
  open,
  onOpenChange,
}: CreateUplSheetType) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [approvers, setApprovers] = useState<UserType[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const uploadRequestFormRef = useRef<HTMLFormElement>(null);
  const needsCleanup = useRef(false);

  const revalidator = useRevalidator();

  useEffect(() => {
    const fetchApprovers = async () => {
      const fetchedApprovers = await apiFetch("/user?role=superior");

      setApprovers(fetchedApprovers.data);
    };

    fetchApprovers();
  }, []);

  /**
   * Functions
   */
  const closeSheet = (formRef: React.RefObject<HTMLFormElement | null>) => {
    if (!needsCleanup.current) return;
    needsCleanup.current = false;
    formRef.current?.reset();
    setFile(null);
    revalidator.revalidate();
  };

  const handleUploadFile: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    setIsSpinning(true);
    event.preventDefault();

    try {
      if (!file) {
        toast.error("No file  uploaded", {
          position: "top-center",
        });
        return;
      }

      const formData = new FormData(event.currentTarget);

      formData.append("type", "upl");
      formData.append("file", file);

      const apiResponse = await apiFetch("/request", {
        method: "POST",
        body: formData,
      });

      if (!apiResponse.ok) {
        toast.error("Failed to submit file", {
          description: apiResponse.message,
          position: "top-center",
        });
      }

      needsCleanup.current = true;
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to submit file", {
        description:
          error instanceof Error ? error.message : "An error occurred",
        position: "top-center",
      });
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-[30vw] sm:max-w-[30vw]! h-dvh p-0"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
        onAnimationEnd={(e) => {
          if (
            e.target === e.currentTarget &&
            e.currentTarget.dataset.state === "closed"
          ) {
            needsCleanup.current = true;
            closeSheet(uploadRequestFormRef);
          }
        }}
      >
        <form
          ref={uploadRequestFormRef}
          onSubmit={handleUploadFile}
          className="flex h-full min-h-0 flex-col"
        >
          <SheetHeader>
            <h1>Create an Upload Request</h1>
            <p>An upload request goes through the normal approval process.</p>
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
                  <FieldLabel htmlFor="revisionDate">Revision Date</FieldLabel>
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
                            <SelectItem key={approver.id} value={approverName}>
                              {approverName}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field className="col-span-1">
                  <FieldLabel htmlFor="approvedDate">Approved Date</FieldLabel>
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
              displayText="Submit Request"
              isSpinning={isSpinning}
            />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
