import { FileIcon, FileUp, Plus, XIcon } from "lucide-react";
import { useReducer, useState, type SubmitEventHandler } from "react";
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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
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
import type { FileType, UserType } from "~/constants/types";
import { formatUserName } from "~/utils/formatUserName";

enum ACTION {
  SETFIELD = "SETFIELD",
  RESETFORM = "RESETFORM",
}

type UploadFileStateType = {
  title: string;
  reason: string;
  fileTitle: string;
  fileType: string;
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  approver: string;
};

type UploadFileActionType = {
  type: ACTION;
  payload: Partial<UploadFileStateType>;
};

export async function clientLoader() {
  // const apiResponse = await apiFetch("/file");

  const [fileResponse, userResponse] = await Promise.all([
    apiFetch("/file"),
    apiFetch("/user?role=superior"),
  ]);

  console.log("INFO | files.tsx clientLoader fileResponse", fileResponse);
  console.log("INFO | files.tsx clientLoader userResponse", userResponse);

  return {
    files: fileResponse.data,
    approvers: userResponse.data,
  };
}

export default function files({ loaderData }: Route.ComponentProps) {
  /**
   * Mock data
   */

  const fileTypes = ["Document", "Checklist", "Form"];

  let files: FileType[] = [];
  let approvers: UserType[] = [];

  console.log("INFO | LOADER DATA", loaderData.files);

  if (loaderData.files.length !== 0) {
    files = loaderData.files;
  }

  console.log("INFO | FILES", files);

  if (loaderData.approvers.length !== 0) {
    approvers = loaderData.approvers;
  }

  console.log("INFO | APPROVERS", approvers);

  /**
   * Hook initialization
   */
  const [openCreateSheet, setOpenCreateSheet] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  /**
   * Upload file reducer
   */
  const uploadFileInitialState = {
    title: "",
    reason: "",
    fileTitle: "",
    fileType: "",
    originator: "",
    department: "",
    revisionNumber: "",
    revisionDetails: "",
    approver: "",
  };

  function uploadFileReducer(
    state: UploadFileStateType,
    action: UploadFileActionType,
  ) {
    switch (action.type) {
      case ACTION.SETFIELD:
        return {
          ...state,
          ...action.payload,
        };

      case ACTION.RESETFORM:
        return {
          ...uploadFileInitialState,
        };

      default:
        return state;
    }
  }

  const [uploadFileState, uploadFileDispatch] = useReducer(
    uploadFileReducer,
    uploadFileInitialState,
  );

  /**
   * Functions
   */
  const handleUploadRequest: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    try {
      event.preventDefault();

      if (!file) {
        console.log("No file was uploaded");
        console.log("File Object | ", file);
        return toast.error("No file uploaded", {
          position: "top-center",
        });
      }

      console.log("Sending POST request with body:");
      console.log("uploadFileState:", uploadFileState);
      console.log("File:", file);

      const formData = new FormData();

      formData.append("type", "upl");
      formData.append("title", uploadFileState.title);
      formData.append("reason", uploadFileState.reason);
      formData.append("fileTitle", uploadFileState.fileTitle);
      formData.append("fileType", uploadFileState.fileType);
      formData.append("originator", uploadFileState.originator);
      formData.append("department", uploadFileState.department);
      formData.append("revisionNumber", uploadFileState.revisionNumber);
      formData.append("revisionDetails", uploadFileState.revisionDetails);
      formData.append("approver", uploadFileState.approver);
      formData.append("file", file);
      // formData.append("fileId", "1");

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
      resetForm();

      return toast.success("Upload file request submitted", {
        position: "top-center",
      });
    } catch (error) {
      console.log("ERROR |", error);
      toast.error("Failed to submit upload file request", {
        position: "top-center",
      });
    }
  };

  const renderBadge = (type: string) => {
    switch (type) {
      case "document":
        return (
          <Badge
            className="bg-amber-100 text-amber-600 border-amber-600"
            variant={"outline"}
          >
            {type}
          </Badge>
        );

      case "checklist":
        return (
          <Badge
            className="bg-green-100 text-green-600 border-green-600"
            variant={"outline"}
          >
            {type}
          </Badge>
        );

      case "form":
        return (
          <Badge
            className="bg-blue-100 text-blue-600 border-blue-600"
            variant={"outline"}
          >
            {type}
          </Badge>
        );
    }
  };

  const resetForm = () => {
    uploadFileDispatch({
      type: ACTION.RESETFORM,
      payload: {},
    });

    setFile(null);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
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
        <ul className="grid grid-cols-5 gap-4">
          {files.map((file) => (
            <Card key={file.id}>
              <img
                src="https://avatar.vercel.sh/shadcn1"
                className="aspect-video"
              />
              <CardHeader className="flex justify-between gap-8">
                <CardTitle className="truncate" title={file.title}>
                  {file.title}
                </CardTitle>
                {renderBadge(file.type)}
              </CardHeader>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate(`/files/${file.id}`);
                  }}
                >
                  View File
                </Button>
              </CardFooter>
            </Card>
          ))}
        </ul>
      </div>
      <Sheet
        open={openCreateSheet}
        onOpenChange={(open) => {
          setOpenCreateSheet(open);

          if (!open) {
            resetForm();
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
                      value={uploadFileState.title}
                      onChange={(e) =>
                        uploadFileDispatch({
                          type: ACTION.SETFIELD,
                          payload: { title: e.target.value },
                        })
                      }
                      type="text"
                      placeholder="e.g., Request for document upload"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="reason">Reason</FieldLabel>
                    <Textarea
                      id="reason"
                      value={uploadFileState.reason}
                      onChange={(e) =>
                        uploadFileDispatch({
                          type: ACTION.SETFIELD,
                          payload: { reason: e.target.value },
                        })
                      }
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
                      value={uploadFileState.fileTitle}
                      onChange={(e) =>
                        uploadFileDispatch({
                          type: ACTION.SETFIELD,
                          payload: { fileTitle: e.target.value },
                        })
                      }
                      placeholder="e.g., Waste Management Procedure"
                      required
                    />
                  </Field>
                  <Field className="col-span-2">
                    <FieldLabel htmlFor="fileType">File Type</FieldLabel>
                    <Select
                      value={uploadFileState.fileType}
                      onValueChange={(value) =>
                        uploadFileDispatch({
                          type: ACTION.SETFIELD,
                          payload: { fileType: value },
                        })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select the file type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>File Type</SelectLabel>
                          {fileTypes.map((type, index) => (
                            <SelectItem key={index} value={type.toLowerCase()}>
                              {type}
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
                      value={uploadFileState.originator}
                      onChange={(e) =>
                        uploadFileDispatch({
                          type: ACTION.SETFIELD,
                          payload: { originator: e.target.value },
                        })
                      }
                      placeholder="e.g., Juan Dela Cruz"
                      required
                    />
                  </Field>
                  <Field className="col-span-2">
                    <FieldLabel htmlFor="department">Department</FieldLabel>
                    <Input
                      id="department"
                      type="text"
                      value={uploadFileState.department}
                      onChange={(e) =>
                        uploadFileDispatch({
                          type: ACTION.SETFIELD,
                          payload: { department: e.target.value },
                        })
                      }
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
                      value={uploadFileState.revisionNumber}
                      onChange={(e) =>
                        uploadFileDispatch({
                          type: ACTION.SETFIELD,
                          payload: { revisionNumber: e.target.value },
                        })
                      }
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
                      value={uploadFileState.revisionDetails}
                      onChange={(e) =>
                        uploadFileDispatch({
                          type: ACTION.SETFIELD,
                          payload: { revisionDetails: e.target.value },
                        })
                      }
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
                    <Select
                      value={uploadFileState.approver}
                      onValueChange={(value) =>
                        uploadFileDispatch({
                          type: ACTION.SETFIELD,
                          payload: { approver: value },
                        })
                      }
                      required
                    >
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
              <Button type="submit">Submit Request</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
