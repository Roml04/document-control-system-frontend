import { FileIcon, FileUp, XIcon } from "lucide-react";
import { useEffect, useRef, useState, type SubmitEventHandler } from "react";
import { useRevalidator } from "react-router";
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
import { FILETYPE } from "~/constants/enums";
import type { UserType } from "~/constants/types";
import { apiFetch } from "~/utils/apiFetch";
import { formatUserName } from "~/utils/formatUserName";
import LoadingButton from "../primitives/LoadingButton";

type SubmitIntent = "request" | "direct";

type AddPublishfFileSheetPropType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddPublishFileSheet({
  open,
  onOpenChange,
}: AddPublishfFileSheetPropType) {
  // const addPublishFormRef = useRef<HTMLFormElement>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [approvers, setApprovers] = useState<UserType[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const revalidator = useRevalidator();

  const needsCleanup = useRef(false);

  useEffect(() => {
    const fetchApprovers = async () => {
      const fetchedApprovers = await apiFetch("/user?role=superior");

      console.log("FETCHED APPROVERS", fetchedApprovers);

      setApprovers(fetchedApprovers.data);
    };

    if (open) {
      fetchApprovers();
    }
  }, [needsCleanup, open]);

  const finishClose = () => {
    if (!needsCleanup.current) return;
    console.log("needsCleanup", needsCleanup.current);
    needsCleanup.current = false;
    setFile(null);
    revalidator.revalidate();
  };

  const handleUploadFile: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    setIsSpinning(true);
    event.preventDefault();

    try {
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

      console.log("FORMDATA", Object.fromEntries(formData.entries()));
      console.log("LKJSDLFKJSDLFKJSLDKFJLSDKFJ");

      const apiResponse = await apiFetch(
        intent === "request" ? "/request" : "/admin/file",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!apiResponse.ok) {
        console.log("INFO | MESSAGE", apiResponse.message);
        return toast.error("Submission failed [1]", {
          description: apiResponse.message,
          position: "top-center",
        });
      }

      needsCleanup.current = true;
      console.log("needsCleanup", needsCleanup.current);
      onOpenChange(false);

      toast.success("File submitted", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Submission failed [2]", {
        description: error instanceof Error ? error.message : undefined,
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
            finishClose();
          }
        }}
      >
        <form
          // ref={addPublishFormRef}
          onSubmit={handleUploadFile}
          className="flex h-full min-h-0 flex-col"
        >
          <SheetHeader>
            <h1>Add and Publish a File</h1>
            <p>Directly upload a file. This bypasses the approval process</p>
          </SheetHeader>
          <Separator />

          <ScrollArea className="flex-1 min-h-0 px-4 py-4">
            <FieldSet>
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
                    <SelectContent position="popper">
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
                  <Input id="uploadDate" name="uploadDate" type="date" />
                  <FieldDescription className="text-gray-400">
                    Automatically set on file upload
                  </FieldDescription>
                </Field>
                <Field className="col-span-1">
                  <FieldLabel htmlFor="revisionDate">Revision Date</FieldLabel>
                  <Input id="revisionDate" name="revisionDate" type="date" />
                  <FieldDescription className="text-gray-400">
                    Revision date unavailable on file upload
                  </FieldDescription>
                </Field>

                <Field className="col-span-1">
                  <FieldLabel>Approver</FieldLabel>
                  <Select name="approverId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an Approver" />
                    </SelectTrigger>
                    <SelectContent position="popper">
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
                              value={approver.id.toString()}
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
                  <FieldLabel htmlFor="approvedDate">Approved Date</FieldLabel>
                  <Input id="approvedDate" name="approvedDate" type="date" />
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
              value={"direct"}
              className="flex-1"
              loadingDisplayText="Processing..."
              displayText="Add and Publish"
              isSpinning={isSpinning}
            />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
