import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/resubmitRequest";
import { useNavigate } from "react-router";
import FileCard from "~/components/primitives/FileCard";
import FileItem from "~/components/molecules/FileItem";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { FILETYPE, REQUESTTYPE } from "~/constants/enums";
import formatEnum from "~/utils/formatEnum";
import type { RequestType, UserType, VersionType } from "~/constants/types";
import { formatUserName } from "~/utils/formatUserName";
import { useReducer, useRef, useState, type SubmitEventHandler } from "react";
import { toast } from "sonner";
import StrictHeader from "~/components/organisms/StrictHeader";
import { FileUp } from "lucide-react";

enum ACTION {
  SETDETAILS = "SETDETAILS",
  RESETDETAILS = "RESETDETAILS",
}

type ResubRequestStateType = Omit<
  {
    [K in keyof RequestType]: RequestType[K];
  },
  "commenters"
>;

type ResubRequestActionType = {
  type: ACTION;
  payload: Partial<ResubRequestStateType>;
};

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  const [apiResponse, superiorResponse] = await Promise.all([
    apiFetch(`/request/${params.id}`),
    apiFetch(`/user?role=superior`),
  ]);

  console.log("INFO | API RESPONSE", apiResponse);

  return {
    request: apiResponse.data,
    superiors: superiorResponse.data,
    requestType: type,
  } as {
    request: RequestType;
    superiors: UserType[];
    requestType: string;
  };
}

export default function resubmitRequest({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const { request, superiors, requestType } = loaderData;
  const [isSpinning, setIsSpinning] = useState(false);

  const canEditVersion =
    request.type === REQUESTTYPE.UPLOAD ||
    (request.type === REQUESTTYPE.REVISION && !!request.wasEdited === true);

  /**
   * Functions
   */
  const handleResubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    try {
      setIsSpinning(true);
      event.preventDefault();
      console.log("SUBMITTED");

      if (!request.version) {
        toast.error("Failed to resubmit request", {
          position: "top-center",
          description: "The associated version is missing",
        });

        return;
      }

      const formData = new FormData(event.currentTarget);

      formData.append("requestId", `${request.id}`);
      formData.append("versionId", `${request.version.id}`);
      formData.append("type", "resub");

      if (file) formData.append("file", file);

      console.log("INFO | Form Data", Object.fromEntries(formData.entries()));

      const apiResponse = await apiFetch("/request", {
        method: "POST",
        body: formData,
      });

      if (!apiResponse.ok) {
        toast.error("Failed to resubmit request", {
          position: "top-center",
          description: apiResponse.message,
        });

        setIsSpinning(false);
        return;
      }

      toast.success("Successfully resubmitted request", {
        position: "top-center",
      });

      navigate(-1);
    } catch (error) {
      toast.error("Failed to resubmit request", {
        position: "top-center",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSpinning(false);
    }
  };

  switch (requestType) {
    case "upl":
      return (
        <form onSubmit={handleResubmit} className="flex flex-col gap-2">
          <StrictHeader
            resetOnCLick={() => {
              formRef.current?.reset();
            }}
            isSpinning={isSpinning}
          />
          <ScrollArea className="h-[49em]">
            <div className="flex flex-col gap-2">
              <FieldSet className="border p-4 flex flex-col rounded-lg gap-4">
                <h2>Request</h2>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter request title"
                      name="title"
                      defaultValue={request.title}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Reason</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter request reason"
                      name="reason"
                      defaultValue={request.reason}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet className="border p-4 flex flex-col rounded-lg gap-4">
                <h2>File</h2>
                <FieldGroup className="grid grid-cols-2">
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      type="text"
                      name="fileTitle"
                      defaultValue={request.version?.fileTitle}
                      placeholder="Enter file title..."
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Type</FieldLabel>
                    <Select
                      defaultValue={request.version?.fileType ?? undefined}
                      name="fileType"
                    >
                      <SelectTrigger type="button">
                        <SelectValue placeholder="Select file type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>File Type</SelectLabel>
                          {Object.values(FILETYPE).map((type, index) => (
                            <SelectItem key={index} value={type.toLowerCase()}>
                              {formatEnum(type)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <Separator />
                <FieldGroup className="grid grid-cols-2">
                  <Field>
                    <FieldLabel>Originator</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter originator..."
                      name="originator"
                      defaultValue={request.version?.originator}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Department</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter department..."
                      name="department"
                      defaultValue={request.version?.department}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Revision Number</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter revision number..."
                      name="revisionNumber"
                      defaultValue={request.version?.revisionNumber}
                    />
                  </Field>
                  <Field className="col-span-2">
                    <FieldLabel>Revision Detail</FieldLabel>
                    <Textarea
                      placeholder="Enter revision detail..."
                      name="revisionDetails"
                      defaultValue={request.version?.revisionDetails}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Upload Date</FieldLabel>
                    <Input
                      type="text"
                      disabled
                      name="uploadDate"
                      defaultValue={request.version?.uploadDate}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Revision Date</FieldLabel>
                    <Input
                      type="text"
                      disabled
                      name="revisionDate"
                      defaultValue={request.version?.revisionDate}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Approver</FieldLabel>
                    <Select
                      defaultValue={request.version?.approver}
                      name="approver"
                    >
                      <SelectTrigger type="button">
                        <SelectValue placeholder="Select an approver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Approver</SelectLabel>
                          {superiors.map((superior, index) => {
                            return (
                              <SelectItem
                                key={index}
                                value={formatUserName(
                                  superior.firstName,
                                  superior.lastName,
                                )}
                                onChange={() => {}}
                              >
                                {formatUserName(
                                  superior.firstName,
                                  superior.lastName,
                                )}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Approved Date</FieldLabel>
                    <Input
                      type="text"
                      disabled
                      name="approvedDate"
                      defaultValue={request.version?.approvedDate}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </div>
          </ScrollArea>
          {request.version ? (
            <FileItem
              version={request.version}
              isReplaceable={canEditVersion}
              mode="edit"
              file={file}
              setFile={setFile}
            />
          ) : (
            <p>No file available</p>
          )}
        </form>
      );

    case "rev":
      return (
        <form
          ref={formRef}
          onSubmit={handleResubmit}
          className="flex flex-col gap-2"
        >
          <StrictHeader
            resetOnCLick={() => {
              formRef.current?.reset();
            }}
            isSpinning={isSpinning}
          />
          <ScrollArea className="h-[49em]">
            <div className="flex flex-col gap-2">
              <FieldSet className="border p-4 flex flex-col rounded-lg gap-4">
                <h2>Request</h2>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter request title"
                      name="title"
                      defaultValue={request.title}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Reason</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter request reason"
                      name="reason"
                      defaultValue={request.reason}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              {request.wasEdited ? (
                <FieldSet className="border p-4 flex flex-col rounded-lg gap-4">
                  <h2>File</h2>
                  <FieldGroup className="grid grid-cols-2">
                    <Field>
                      <FieldLabel>Title</FieldLabel>
                      <Input
                        type="text"
                        name="fileTitle"
                        defaultValue={request.version?.fileTitle}
                        placeholder="Enter file title..."
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Type</FieldLabel>
                      <Select
                        defaultValue={request.version?.fileType ?? undefined}
                        name="fileType"
                      >
                        <SelectTrigger type="button">
                          <SelectValue placeholder="Select file type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>File Type</SelectLabel>
                            {Object.values(FILETYPE).map((type, index) => (
                              <SelectItem
                                key={index}
                                value={type.toLowerCase()}
                              >
                                {formatEnum(type)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                  <Separator />
                  <FieldGroup className="grid grid-cols-2">
                    <Field>
                      <FieldLabel>Originator</FieldLabel>
                      <Input
                        type="text"
                        placeholder="Enter originator..."
                        name="originator"
                        defaultValue={request.version?.originator}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Department</FieldLabel>
                      <Input
                        type="text"
                        placeholder="Enter department..."
                        name="department"
                        defaultValue={request.version?.department}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Revision Number</FieldLabel>
                      <Input
                        type="text"
                        placeholder="Enter revision number..."
                        name="revisionNumber"
                        defaultValue={request.version?.revisionNumber}
                      />
                    </Field>
                    <Field className="col-span-2">
                      <FieldLabel>Revision Detail</FieldLabel>
                      <Textarea
                        placeholder="Enter revision detail..."
                        name="revisionDetails"
                        defaultValue={request.version?.revisionDetails}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Upload Date</FieldLabel>
                      <Input
                        type="text"
                        disabled
                        name="uploadDate"
                        defaultValue={request.version?.uploadDate}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Revision Date</FieldLabel>
                      <Input
                        type="text"
                        disabled
                        name="revisionDate"
                        defaultValue={request.version?.revisionDate}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Approver</FieldLabel>
                      <Select
                        defaultValue={request.version?.approver}
                        name="approver"
                      >
                        <SelectTrigger type="button">
                          <SelectValue placeholder="Select an approver" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Approver</SelectLabel>
                            {superiors.map((superior, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  value={formatUserName(
                                    superior.firstName,
                                    superior.lastName,
                                  )}
                                  onChange={() => {}}
                                >
                                  {formatUserName(
                                    superior.firstName,
                                    superior.lastName,
                                  )}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Approved Date</FieldLabel>
                      <Input
                        type="text"
                        disabled
                        name="approvedDate"
                        defaultValue={request.version?.approvedDate}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              ) : (
                <></>
              )}
            </div>
          </ScrollArea>
          <FileItem
            version={request.version}
            mode={request.wasEdited ? "edit" : "view"}
            isReplaceable={canEditVersion}
            file={file}
            setFile={setFile}
          />
        </form>
      );

    case "del":
      return (
        <form className="flex flex-col gap-2">
          <StrictHeader
            resetOnCLick={() => {
              formRef.current?.reset();
            }}
            isSpinning={isSpinning}
          />
          {request.version ? (
            <FileItem version={request.version} mode="edit" />
          ) : (
            <p>No file available</p>
          )}
          <ScrollArea className="h-[49em]">
            <div className="flex flex-col gap-2">
              <FieldSet className="border p-4 flex flex-col rounded-lg gap-4">
                <h2>Request</h2>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter request title"
                      name="title"
                      defaultValue={request.title}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Reason</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter request reason"
                      name="reason"
                      defaultValue={request.reason}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </div>
          </ScrollArea>
        </form>
      );
  }
}
