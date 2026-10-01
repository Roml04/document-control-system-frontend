import {
  ChevronDown,
  FileIcon,
  FileUp,
  PackageOpen,
  Plus,
  XIcon,
} from "lucide-react";
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
import { ButtonGroup } from "~/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useRevalidator } from "react-router";
import CreateUplSheet from "~/components/organisms/CreateUplSheet";

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
  const uploadRequestFormRef = useRef<HTMLFormElement>(null);
  const addPublishFormRef = useRef<HTMLFormElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [openUplRequestSheet, setOpenUplRequestSheet] = useState(false);
  const [openAddPublishSheet, setOpenAddPublishSheet] = useState(false);

  const [isSpinning, setIsSpinning] = useState(false);

  const revalidator = useRevalidator();

  const { files, approvers } = loaderData;

  const needsCleanup = useRef(false);

  const finishClose = (formRef: React.RefObject<HTMLFormElement | null>) => {
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

      if (intent === "request") {
        needsCleanup.current = true;
        setOpenUplRequestSheet(false);
      } else {
        needsCleanup.current = true;
        setOpenAddPublishSheet(false);
      }

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
    <>
      <div className="flex flex-col gap-4 h-[55em]">
        <div className="flex justify-between">
          <h1>Files</h1>
          <ButtonGroup>
            <Button onClick={() => setOpenUplRequestSheet(true)}>
              Create Upload Request
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <ChevronDown color="#ffffff" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => setOpenAddPublishSheet(true)}
                  >
                    Add & Publish
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </div>
        <Separator />
        <FileListHeader />
        {files.length > 0 ? (
          <ScrollArea className="h-[52em] w-full ">
            <ul>
              {files.map((file, index) => {
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
      <CreateUplSheet
        open={openUplRequestSheet}
        onOpenChange={setOpenUplRequestSheet}
      />
      <Sheet
        open={openAddPublishSheet}
        onOpenChange={(open) => {
          setOpenAddPublishSheet(open);

          if (!open) {
            setFile(null);
            addPublishFormRef.current?.reset();
          }
        }}
      >
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
              finishClose(addPublishFormRef);
            }
          }}
        >
          <form
            ref={addPublishFormRef}
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
                    <Input id="uploadDate" name="uploadDate" type="date" />
                    <FieldDescription className="text-gray-400">
                      Automatically set on file upload
                    </FieldDescription>
                  </Field>
                  <Field className="col-span-1">
                    <FieldLabel htmlFor="revisionDate">
                      Revision Date
                    </FieldLabel>
                    <Input id="revisionDate" name="revisionDate" type="date" />
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
    </>
  );
}
