import type { Route } from "./+types/editVersion";
import { apiFetch } from "~/utils/apiFetch";
import type { UserType, VersionType } from "~/constants/types";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import LoadingButton from "~/components/primitives/LoadingButton";
import { Button } from "~/components/ui/button";
import { ChevronLeft, Download, RotateCcw } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
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
import FileTypeBadge from "~/components/primitives/FileTypeBadge";
import { Textarea } from "~/components/ui/textarea";
import {
  useEffect,
  useReducer,
  useState,
  type SubmitEventHandler,
} from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { FILETYPE } from "~/constants/enums";
import formatEnum from "~/utils/formatEnum";
import { formatUserName } from "~/utils/formatUserName";
import { toast } from "sonner";

enum ACTION {
  SETDETAILS = "SETDETAILS",
  RESETDETAILS = "RESETDETAILS",
}

type EditVersionStateType = Omit<
  {
    [K in keyof VersionType]: VersionType[K] | null;
  },
  "fileId" | "requestId" | "status"
>;

type EditVersionActionType = {
  type: ACTION;
  payload: Partial<EditVersionStateType>;
};

type PhaseType = "idle" | "saving" | "submitting";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [versionResponse, userResponse] = await Promise.all([
    apiFetch(`/version/${params.id}`),
    apiFetch(`/user?role=superior`),
  ]);

  console.log("CLIENTLOADER:", versionResponse);

  return { version: versionResponse.data, superiors: userResponse.data } as {
    version: VersionType;
    superiors: UserType[];
  };
}

export default function editVersion({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<PhaseType>("idle");

  const { version, superiors } = loaderData;

  /**
   * Reducer
   */
  const editVersionInitialState = {
    id: version.id,
    fileTitle: version.fileTitle,
    fileType: version.fileType,
    originator: version.originator,
    department: version.department,
    revisionNumber: version.revisionNumber,
    revisionDetails: version.revisionDetails,
    uploadDate: version.uploadDate,
    revisionDate: version.revisionDate,
    approver: version.approver,
    approvedDate: version.approvedDate,
    fileName: version.fileName,
    filePath: version.filePath,
  };

  function editVersionReducer(
    state: EditVersionStateType,
    action: EditVersionActionType,
  ) {
    switch (action.type) {
      case ACTION.SETDETAILS:
        return {
          ...state,
          ...action.payload,
        };

      case ACTION.RESETDETAILS:
        return editVersionInitialState;
      default:
        return state;
    }
  }

  const [editVersionState, dispatchEditVersion] = useReducer(
    editVersionReducer,
    editVersionInitialState,
  );

  /**
   * Functions
   */

  const sendCheckRequest = async (): Promise<boolean> => {
    const apiResponse = await apiFetch(
      `/version/${editVersionState.id}/status`,
    );

    console.log(
      `INFO | RESPONSE FROM /version/${editVersionState.id}/status`,
      apiResponse,
    );

    return apiResponse.saved;
  };

  const checkFileSaveStatus = async () => {
    let isSaved = false;

    while (!isSaved) {
      console.log("INFO | IS FILE SAVED", isSaved);
      isSaved = await sendCheckRequest();
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    setPhase("idle");
  };

  const handleEditSubmit: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    try {
      setPhase("submitting");
      event.preventDefault();

      const apiResponse = await apiFetch(`/version/${editVersionState.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          id: editVersionState.id,
          fileTitle: editVersionState.fileTitle,
          fileType: editVersionState.fileType,
          originator: editVersionState.originator,
          department: editVersionState.department,
          revisionNumber: editVersionState.revisionNumber,
          revisionDetails: editVersionState.revisionDetails,
          approver: editVersionState.approver,
        }),
      });

      if (!apiResponse.ok) {
        return toast.error("Submission failed", {
          position: "top-center",
          description: apiResponse.message,
        });
      }

      navigate(-1);
    } catch (error) {
      toast.error("An error occurred", {
        position: "top-center",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again in a moment",
      });
    } finally {
      setPhase("idle");
    }
  };

  return (
    <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
      <header className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
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
            <AlertDialogTrigger asChild>
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
                    dispatchEditVersion({
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
            displayText="Submit"
            loadingDisplayText={`${formatEnum(phase)}...`}
            isSpinning={phase === "saving" || phase === "submitting"}
          />
        </div>
      </header>
      <div className="flex flex-col gap-2 h-[50em]">
        <div className="flex flex-col border rounded-lg p-4 justify-center gap-4">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <FileTypeBadge
                type={editVersionState.fileType ?? FILETYPE.DOCUMENT}
                size={22}
              />
              <h2>{editVersionState.fileTitle}</h2>
            </div>
            <div className="flex items-center">
              <NavLink
                to={`/onlyoffice/${editVersionState.id}?mode=edit`}
                target="_blank"
                onClick={() => {
                  setPhase("saving");
                  checkFileSaveStatus();
                }}
              >
                <Button type="button" variant={"ghost"}>
                  Open in editor
                </Button>
              </NavLink>
              <Button
                type="button"
                size={"icon-lg"}
                variant={"ghost"}
                title="Download"
              >
                <Download size={18} />
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4 w-full border rounded-lg">
          <FieldSet>
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input
                  type="text"
                  value={editVersionState.fileTitle ?? ""}
                  onChange={(e) => {
                    dispatchEditVersion({
                      type: ACTION.SETDETAILS,
                      payload: { fileTitle: e.target.value },
                    });
                  }}
                />
              </Field>
              <Field>
                <FieldLabel>Type</FieldLabel>
                <Select
                  defaultValue={editVersionState.fileType ?? undefined}
                  onValueChange={(value: FILETYPE) => {
                    dispatchEditVersion({
                      type: ACTION.SETDETAILS,
                      payload: { fileType: value },
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(FILETYPE).map((type, index) => (
                        <SelectItem key={index} value={type}>
                          {formatEnum(type)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>
        <ScrollArea className="border p-4 rounded-lg h-[43em]">
          <FieldSet>
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel>Originator</FieldLabel>
                <Input
                  type="text"
                  value={editVersionState.originator ?? undefined}
                  onChange={(e) => {
                    dispatchEditVersion({
                      type: ACTION.SETDETAILS,
                      payload: { originator: e.target.value },
                    });
                  }}
                />
              </Field>
              <Field>
                <FieldLabel>Department</FieldLabel>
                <Input
                  type="text"
                  value={editVersionState.department ?? undefined}
                  onChange={(e) => {
                    dispatchEditVersion({
                      type: ACTION.SETDETAILS,
                      payload: { department: e.target.value },
                    });
                  }}
                />
              </Field>
              <Field>
                <FieldLabel>Revision Number</FieldLabel>
                <Input
                  type="text"
                  value={editVersionState.revisionNumber ?? undefined}
                  onChange={(e) => {
                    dispatchEditVersion({
                      type: ACTION.SETDETAILS,
                      payload: { revisionNumber: e.target.value },
                    });
                  }}
                />
              </Field>
              <Field className="col-span-2">
                <FieldLabel>Revision Details</FieldLabel>
                <Textarea
                  value={editVersionState.revisionDetails ?? undefined}
                  onChange={(e) => {
                    dispatchEditVersion({
                      type: ACTION.SETDETAILS,
                      payload: { revisionDetails: e.target.value },
                    });
                  }}
                />
              </Field>
              <Field>
                <FieldLabel>Upload Date</FieldLabel>
                <Input
                  type="text"
                  value={editVersionState.uploadDate ?? ""}
                  disabled
                />
                <FieldDescription>
                  No action is needed. This field is filled in automatically.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Revision Date</FieldLabel>
                <Input
                  type="text"
                  value={editVersionState.revisionDate ?? undefined}
                  disabled
                />
                <FieldDescription>
                  No action is needed. This field is filled in automatically.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Approver</FieldLabel>
                <Select
                  defaultValue={editVersionState.approver ?? undefined}
                  onValueChange={(value) => {
                    dispatchEditVersion({
                      type: ACTION.SETDETAILS,
                      payload: { approver: value },
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {superiors.map((superior, index) => {
                        const superiorName = formatUserName(
                          superior.firstName,
                          superior.lastName,
                        );
                        return (
                          <SelectItem key={index} value={superiorName}>
                            {superiorName}
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
                  value={editVersionState.approvedDate ?? ""}
                  disabled
                />
                <FieldDescription>
                  No action is needed. This field is filled in automatically.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </ScrollArea>
      </div>
    </form>
  );
}
