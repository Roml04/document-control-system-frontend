import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/resubmitRequest";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router";
import LoadingButton from "~/components/primitives/LoadingButton";
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
import { FILETYPE } from "~/constants/enums";
import formatEnum from "~/utils/formatEnum";
import type { RequestType, UserType, VersionType } from "~/constants/types";
import { formatUserName } from "~/utils/formatUserName";
import { useReducer, useState, type SubmitEventHandler } from "react";
import { toast } from "sonner";

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

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [apiResponse, superiorResponse] = await Promise.all([
    apiFetch(`/request/${params.id}`),
    apiFetch(`/user?role=superior`),
  ]);

  return {
    request: apiResponse.data,
    superiors: superiorResponse.data,
  } as {
    request: RequestType;
    superiors: UserType[];
  };
}

export default function resubmitRequest({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const { request, superiors } = loaderData;
  const [isSpinning, setIsSpinning] = useState(false);

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

      formData.append("requestId", resubRequestState.id.toString());
      formData.append("type", "resub");
      formData.append("title", resubRequestState.title);
      formData.append("reason", resubRequestState.reason);
      formData.append("versionId", resubRequestState.version.id.toString());
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
      // formData.append("uploadDate", resubRequestState.version.uploadDate);
      // formData.append("revisionDate", resubRequestState.version.revisionDate);
      formData.append("approver", resubRequestState.version.approver);
      // formData.append("approvedDate", resubRequestState.version.approvedDate);
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

  return (
    <form onSubmit={handleResubmit} className="flex flex-col gap-2">
      <header className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger type="button" asChild>
            <Button type="button" variant={"ghost"}>
              <ChevronLeft />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave this page?</AlertDialogTitle>
              <AlertDialogDescription>
                Your unsaved changes will be lost if you leave this page. Are
                you sure you want to continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Stay on page</AlertDialogCancel>
              <AlertDialogAction onClick={() => navigate(-1)}>
                Leave page
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex gap-1">
          <AlertDialog>
            <AlertDialogTrigger type="button" asChild>
              <Button type="button" variant={"ghost"}>
                <RotateCcw />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset your progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your current progress will be lost. Are you sure you want to
                  start over?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep editing</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    dispatchResubRequest({
                      type: ACTION.RESETDETAILS,
                      payload: {},
                    });
                  }}
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <LoadingButton
            type="submit"
            displayText="Resubmit"
            loadingDisplayText="Resubmit"
            isSpinning={isSpinning}
          />
        </div>
      </header>
      {request.version ? (
        <FileItem version={request.version} />
      ) : (
        <p>No file available</p>
      )}
      <ScrollArea className="h-[49em]">
        <div className="flex flex-col gap-2">
          <div className="border p-4 flex flex-col rounded-lg gap-4">
            <FieldSet>
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
          <div className="border p-4 flex flex-col rounded-lg gap-4">
            <FieldSet>
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
        </div>
      </ScrollArea>
    </form>
  );
}
