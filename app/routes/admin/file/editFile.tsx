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
import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/editFile";
import type { UserType, VersionType } from "~/constants/types";
import { useRef, useState, type SubmitEventHandler } from "react";
import FileItem from "~/components/molecules/FileItem";
import StrictHeader from "~/components/organisms/StrictHeader";
import { toast } from "sonner";

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

export default function editFile({ loaderData }: Route.ComponentProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<PhaseType>("idle");

  const { version, superiors } = loaderData;

  const navigate = useNavigate();

  const sendCheckRequest = async (): Promise<boolean> => {
    const apiResponse = await apiFetch(`/version/${version.id}/status`);

    console.log(
      `INFO | RESPONSE FROM /version/${version.id}/status`,
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

  const handleFileEdit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    setPhase("submitting");
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);

      formData.append("id", version.id.toString());

      if (file) formData.append("file", file);

      console.log(Object.fromEntries(formData.entries()));

      const apiResponse = await apiFetch(`/admin/file/${version.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!apiResponse.ok) {
        toast.error("Failed to edit file", {
          description: apiResponse.message,
          position: "top-center",
        });
      }

      toast.success("File edited successfully", {
        position: "top-center",
      });

      navigate(-1);
    } catch (error) {
      toast.error("Failed to submit edits", {
        description:
          error instanceof Error ? error.message : "An error occurred",
        position: "top-center",
      });
    } finally {
      setPhase("idle");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleFileEdit}
      className="flex flex-col gap-2"
    >
      <StrictHeader
        resetOnCLick={() => formRef.current?.reset()}
        buttonLoadingText={`${formatEnum(phase)}...`}
        buttonText="Save & Publish"
        buttonIsSpinning={phase === "saving" || phase === "submitting"}
      />
      <ScrollArea className="h-[49em]">
        <div className="flex flex-col gap-2">
          <FieldSet className="border p-4 rounded-lg">
            <h2>File Details</h2>
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
          <FieldSet className="border p-4 rounded-lg">
            <h2>Version Details</h2>
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
                  type="text"
                  defaultValue={version.uploadDate ?? ""}
                  name="uploadDate"
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
                  defaultValue={version.revisionDate ?? ""}
                  name="revisionDate"
                  disabled
                />
                <FieldDescription>
                  No action is needed. This field is filled in automatically.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Approver</FieldLabel>
                <Select name="approver" defaultValue={version.approver}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an approver" />
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
                  defaultValue={version.approvedDate ?? "Not approved yet"}
                  name="approvedDate"
                  disabled
                />
                <FieldDescription>
                  No action is needed. This field is filled in automatically.
                </FieldDescription>
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
