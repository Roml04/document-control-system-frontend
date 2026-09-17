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
import { useReducer, useState, type SubmitEventHandler } from "react";
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

  const { request, superiors, requestType } = loaderData;
  const [isSpinning, setIsSpinning] = useState(false);

  console.log("INFO | request was edited", request);
  /**
   * Reducer function
   */
  const resubRequestInitialState = {
    id: request.id,
    type: request.type,
    title: request.title,
    reason: request.reason,
    status: request.status,
    user: request.user,
    version: request.version,
    wasEdited: request.wasEdited,
  };

  function resubRequestReducer(
    state: ResubRequestStateType,
    action: ResubRequestActionType,
  ) {
    switch (action.type) {
      case ACTION.SETDETAILS:
        return {
          ...state,
          ...action.payload,
        };

      case ACTION.RESETDETAILS:
        return resubRequestInitialState;

      default:
        return state;
    }
  }

  const [resubRequestState, dispatchResubRequest] = useReducer(
    resubRequestReducer,
    resubRequestInitialState,
  );

  /**
   * Functions
   */

  console.log("RELOAD");

  const handleResubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    try {
      setIsSpinning(true);
      event.preventDefault();
      console.log("SUBMITTED");

      if (!resubRequestState.version) {
        toast.error("Failed to resubmit request", {
          position: "top-center",
          description: "The version associated with the request is missing",
        });

        setIsSpinning(false);

        return;
      }

      const formData = new FormData();

      formData.append("title", resubRequestState.title);
      formData.append("reason", resubRequestState.reason);
      formData.append("type", "resub");
      formData.append("versionId", resubRequestState.version.id.toString());

      /**
       * Appends version details if type is upl and if
       * the type is rev and the file was not edited yet
       */
      formData.append("requestId", resubRequestState.id.toString());
      formData.append("fileTitle", resubRequestState.version.fileTitle);
      formData.append("fileType", resubRequestState.version.fileType);
      formData.append("originator", resubRequestState.version.originator);
      formData.append("department", resubRequestState.version.department);
      formData.append(
        "revisionNumber",
        resubRequestState.version.revisionNumber,
      );
      formData.append(
        "revisionDetails",
        resubRequestState.version.revisionDetails,
      );
      formData.append("approver", resubRequestState.version.approver);

      /**
       * File
       */

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

  const handleRevResubmit: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
  };

  switch (requestType) {
    case "upl":
      return (
        <form onSubmit={handleResubmit} className="flex flex-col gap-2">
          <StrictHeader
            resetOnCLick={() => {
              dispatchResubRequest({
                type: ACTION.RESETDETAILS,
                payload: {},
              });
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
                      value={resubRequestState.title ?? ""}
                      onChange={(e) => {
                        dispatchResubRequest({
                          type: ACTION.SETDETAILS,
                          payload: {
                            title: e.target.value,
                          },
                        });
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Reason</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter request reason"
                      value={resubRequestState.reason ?? ""}
                      onChange={(e) => {
                        dispatchResubRequest({
                          type: ACTION.SETDETAILS,
                          payload: {
                            reason: e.target.value,
                          },
                        });
                      }}
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
                      value={resubRequestState.version?.fileTitle}
                      placeholder="Enter file title..."
                      onChange={(e) =>
                        dispatchResubRequest({
                          type: ACTION.SETDETAILS,
                          payload: {
                            version: {
                              ...resubRequestState.version,
                              fileTitle: e.target.value,
                            } as VersionType,
                          },
                        })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Type</FieldLabel>
                    <Select
                      defaultValue={
                        resubRequestState.version?.fileType ?? undefined
                      }
                      onValueChange={(value: FILETYPE) => {
                        dispatchResubRequest({
                          type: ACTION.SETDETAILS,
                          payload: {
                            version: {
                              ...resubRequestState.version,
                              fileType: value,
                            } as VersionType,
                          },
                        });
                      }}
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
                      value={resubRequestState.version?.originator}
                      onChange={(e) => {
                        dispatchResubRequest({
                          type: ACTION.SETDETAILS,
                          payload: {
                            version: {
                              ...resubRequestState.version,
                              originator: e.target.value,
                            } as VersionType,
                          },
                        });
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Department</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter department..."
                      value={resubRequestState.version?.department}
                      onChange={(e) => {
                        dispatchResubRequest({
                          type: ACTION.SETDETAILS,
                          payload: {
                            version: {
                              ...resubRequestState.version,
                              department: e.target.value,
                            } as VersionType,
                          },
                        });
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Revision Number</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter revision number..."
                      value={resubRequestState.version?.revisionNumber}
                      onChange={(e) => {
                        dispatchResubRequest({
                          type: ACTION.SETDETAILS,
                          payload: {
                            version: {
                              ...resubRequestState.version,
                              revisionNumber: e.target.value,
                            } as VersionType,
                          },
                        });
                      }}
                    />
                  </Field>
                  <Field className="col-span-2">
                    <FieldLabel>Revision Detail</FieldLabel>
                    <Textarea
                      placeholder="Enter revision detail..."
                      value={resubRequestState.version?.revisionDetails}
                      onChange={(e) => {
                        dispatchResubRequest({
                          type: ACTION.SETDETAILS,
                          payload: {
                            version: {
                              ...resubRequestState.version,
                              revisionDetails: e.target.value,
                            } as VersionType,
                          },
                        });
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Upload Date</FieldLabel>
                    <Input
                      type="text"
                      disabled
                      value={resubRequestState.version?.uploadDate}
                      onChange={(e) => {}}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Revision Date</FieldLabel>
                    <Input
                      type="text"
                      disabled
                      value={resubRequestState.version?.revisionDate}
                      onChange={() => {}}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Approver</FieldLabel>
                    <Select defaultValue={resubRequestState.version?.approver}>
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
                      value={resubRequestState.version?.approvedDate}
                      onChange={() => {}}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </div>
          </ScrollArea>
          {request.version ? (
            <FileItem version={request.version} mode="edit" />
          ) : (
            <p>No file available</p>
          )}
        </form>
      );

    case "rev":
      return (
        <form onSubmit={handleResubmit} className="flex flex-col gap-2">
          <StrictHeader
            resetOnCLick={() => {
              dispatchResubRequest({
                type: ACTION.RESETDETAILS,
                payload: {},
              });
            }}
            isSpinning={isSpinning}
          />
          <ScrollArea className="h-[49em]">
            <div className="flex flex-col gap-2">
              <FieldSet className="border p-4 flex flex-col rounded-lg gap-4">
                <h2>Request</h2>
                <FieldGroup className="grid grid-cols-2">
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter request title"
                      value={resubRequestState.title ?? ""}
                      onChange={(e) => {
                        dispatchResubRequest({
                          type: ACTION.SETDETAILS,
                          payload: {
                            title: e.target.value,
                          },
                        });
                      }}
                    />
                  </Field>
                  <Field className="col-span-2">
                    <FieldLabel>Reason</FieldLabel>
                    <Textarea
                      placeholder="Enter request reason"
                      value={resubRequestState.reason ?? ""}
                      onChange={(e) => {
                        dispatchResubRequest({
                          type: ACTION.SETDETAILS,
                          payload: {
                            reason: e.target.value,
                          },
                        });
                      }}
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
                        value={resubRequestState.version?.fileTitle}
                        placeholder="Enter file title..."
                        onChange={(e) =>
                          dispatchResubRequest({
                            type: ACTION.SETDETAILS,
                            payload: {
                              version: {
                                ...resubRequestState.version,
                                fileTitle: e.target.value,
                              } as VersionType,
                            },
                          })
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Type</FieldLabel>
                      <Select
                        defaultValue={
                          resubRequestState.version?.fileType ?? undefined
                        }
                        onValueChange={(value: FILETYPE) => {
                          dispatchResubRequest({
                            type: ACTION.SETDETAILS,
                            payload: {
                              version: {
                                ...resubRequestState.version,
                                fileType: value,
                              } as VersionType,
                            },
                          });
                        }}
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
                        value={resubRequestState.version?.originator}
                        onChange={(e) => {
                          dispatchResubRequest({
                            type: ACTION.SETDETAILS,
                            payload: {
                              version: {
                                ...resubRequestState.version,
                                originator: e.target.value,
                              } as VersionType,
                            },
                          });
                        }}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Department</FieldLabel>
                      <Input
                        type="text"
                        placeholder="Enter department..."
                        value={resubRequestState.version?.department}
                        onChange={(e) => {
                          dispatchResubRequest({
                            type: ACTION.SETDETAILS,
                            payload: {
                              version: {
                                ...resubRequestState.version,
                                department: e.target.value,
                              } as VersionType,
                            },
                          });
                        }}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Revision Number</FieldLabel>
                      <Input
                        type="text"
                        placeholder="Enter revision number..."
                        value={resubRequestState.version?.revisionNumber}
                        onChange={(e) => {
                          dispatchResubRequest({
                            type: ACTION.SETDETAILS,
                            payload: {
                              version: {
                                ...resubRequestState.version,
                                revisionNumber: e.target.value,
                              } as VersionType,
                            },
                          });
                        }}
                      />
                    </Field>
                    <Field className="col-span-2">
                      <FieldLabel>Revision Detail</FieldLabel>
                      <Textarea
                        placeholder="Enter revision detail..."
                        value={resubRequestState.version?.revisionDetails}
                        onChange={(e) => {
                          dispatchResubRequest({
                            type: ACTION.SETDETAILS,
                            payload: {
                              version: {
                                ...resubRequestState.version,
                                revisionDetails: e.target.value,
                              } as VersionType,
                            },
                          });
                        }}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Upload Date</FieldLabel>
                      <Input
                        type="text"
                        disabled
                        value={resubRequestState.version?.uploadDate}
                        onChange={(e) => {}}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Revision Date</FieldLabel>
                      <Input
                        type="text"
                        disabled
                        value={resubRequestState.version?.revisionDate}
                        onChange={() => {}}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Approver</FieldLabel>
                      <Select
                        defaultValue={resubRequestState.version?.approver}
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
                        value={resubRequestState.version?.approvedDate}
                        onChange={() => {}}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
              ) : (
                <></>
              )}
            </div>
          </ScrollArea>
          {request.version ? (
            <FileItem version={request.version} mode="edit" />
          ) : (
            <label
              htmlFor="file"
              className="cursor-pointer flex flex-col border border-gray-200 rounded-lg bg-gray-50 items-center py-8 gap-2"
            >
              <FileUp />
              <p>Upload a file</p>
              <Input className="sr-only" type="file" id="file" />
            </label>
          )}
        </form>
      );

    case "del":
      return (
        <form className="flex flex-col gap-2">
          <StrictHeader
            resetOnCLick={() => {
              dispatchResubRequest({
                type: ACTION.RESETDETAILS,
                payload: {},
              });
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
                      value={resubRequestState.title ?? ""}
                      onChange={(e) => {
                        dispatchResubRequest({
                          type: ACTION.SETDETAILS,
                          payload: {
                            title: e.target.value,
                          },
                        });
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Reason</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Enter request reason"
                      value={resubRequestState.reason ?? ""}
                      onChange={(e) => {
                        dispatchResubRequest({
                          type: ACTION.SETDETAILS,
                          payload: {
                            reason: e.target.value,
                          },
                        });
                      }}
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
