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
import { ChevronLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router";
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
import { Textarea } from "~/components/ui/textarea";
import { useRef, useState, type SubmitEventHandler } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { FILETYPE, VERSIONSTATUS } from "~/constants/enums";
import formatEnum from "~/utils/formatEnum";
import { formatUserName } from "~/utils/formatUserName";
import { toast } from "sonner";
import FileItem from "~/components/molecules/FileItem";
import type { Route } from "./+types/editVersion";
import { formatDate } from "~/utils/formatDate";
import checkStatus from "~/utils/checkStatus";

type PhaseType = "idle" | "saving" | "submitting";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [versionResponse, userResponse] = await Promise.all([
    apiFetch(`/version/${params.id}`),
    apiFetch(`/user?role=superior`),
  ]);

  console.log("INFO | CLIENT LOADER [ADMIN]", versionResponse);

  return { version: versionResponse.data, superiors: userResponse.data } as {
    version: VersionType;
    superiors: UserType[];
  };
}

export default function editVersion({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<PhaseType>("idle");

  const formRef = useRef<HTMLFormElement>(null);

  const { version, superiors } = loaderData;

  /**
   * Functions
   */
  const checkFileSaveStatus = async () => {
    let isSaved = false;

    while (!isSaved) {
      console.log("INFO | IS FILE SAVED", isSaved);
      isSaved = await checkStatus(version.id);
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

      const formData = new FormData(event.currentTarget);

      formData.append("id", version.id.toString());

      if (file) formData.append("file", file);

      console.log("FORM DATA |", Object.fromEntries(formData.entries()));

      const apiResponse = await apiFetch(`/admin/version/${version.id}`, {
        method: "PATCH",
        body: formData,
      });

      console.log("APIRESPONSE", apiResponse);

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
    <form
      ref={formRef}
      onSubmit={handleEditSubmit}
      className="flex flex-col gap-2"
    >
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
                <AlertDialogAction onClick={() => formRef.current?.click()}>
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
      <ScrollArea className="h-[49em]">
        <div className="flex flex-col gap-2">
          <FieldSet className="border p-4 rounded-lg">
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input
                  defaultValue={version.fileTitle}
                  type="text"
                  name="fileTitle"
                />
              </Field>
              <Field>
                <FieldLabel>Type</FieldLabel>
                <Select name="fileType" defaultValue={version.fileType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose file type" />
                  </SelectTrigger>
                  <SelectContent position="popper">
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
          <FieldSet className="border p-4 rounded-lg">
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel>Originator</FieldLabel>
                <Input
                  type="text"
                  name="originator"
                  defaultValue={version.originator}
                />
              </Field>
              <Field>
                <FieldLabel>Department</FieldLabel>
                <Input
                  type="text"
                  name="department"
                  defaultValue={version.department}
                />
              </Field>
              <Field>
                <FieldLabel>Revision Number</FieldLabel>
                <Input
                  type="text"
                  name="revisionNumber"
                  defaultValue={version.revisionNumber}
                />
              </Field>
              <Field className="col-span-2">
                <FieldLabel>Revision Details</FieldLabel>
                <Textarea
                  name="revisionDetails"
                  defaultValue={version.revisionDetails}
                />
              </Field>
              <Field>
                <FieldLabel>Upload Date</FieldLabel>
                <Input
                  type="datetime-local"
                  name="uploadDate"
                  defaultValue={formatDate(version.uploadDate) ?? ""}
                />
              </Field>
              <Field>
                <FieldLabel>Revision Date</FieldLabel>
                <Input
                  type="datetime-local"
                  name="revisionDate"
                  defaultValue={formatDate(version.revisionDate) ?? ""}
                />
              </Field>
              <Field>
                <FieldLabel>Approver</FieldLabel>
                <Select
                  name="approver"
                  defaultValue={String(version.approver.id)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an approver" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {superiors.map((superior, index) => {
                        return (
                          <SelectItem key={index} value={String(superior.id)}>
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
                  type="datetime-local"
                  name="approvedDate"
                  defaultValue={
                    version.approvedDate && formatDate(version.approvedDate)
                  }
                />
                {!version.approvedDate && (
                  <FieldDescription>
                    This version is not approved yet.
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select name="status" required defaultValue={version.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {Object.values(VERSIONSTATUS).map((status, index) => (
                        <SelectItem key={index} value={status}>
                          {formatEnum(status)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>
      </ScrollArea>
      <FileItem
        version={version}
        mode="edit"
        isReplaceable={true}
        file={file}
        setFile={setFile}
        openEditorOnClick={() => {
          setPhase("saving");
          checkFileSaveStatus();
        }}
      />
    </form>
  );
}
