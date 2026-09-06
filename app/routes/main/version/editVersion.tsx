import type { Route } from "./+types/editVersion";
import { apiFetch } from "~/utils/apiFetch";
import type { VersionType } from "~/constants/types";
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
import type { SubmitEventHandler } from "react";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const apiResponse = await apiFetch(`/version/${params.id}`);
  console.log("INFO | VERSION", apiResponse);
  return { version: apiResponse.data } as { version: VersionType };
}

export default function editVersion({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { version } = loaderData;

  /**
   * Functions
   */
  const handleEditSubmit: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    console.log("Submitted!");
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
              <Button variant={"ghost"}>
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
                <AlertDialogAction onClick={() => {}}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <LoadingButton
            type="submit"
            displayText="Submit"
            loadingDisplayText="Submitting revision..."
            isSpinning={false}
          />
        </div>
      </header>
      <div className="flex flex-col gap-2 h-[50em]">
        <div className="flex flex-col border rounded-lg p-4 justify-center gap-4">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <FileTypeBadge type={version.fileType} size={22} />
              <h2>{version.fileTitle}</h2>
            </div>
            <div className="flex items-center">
              <NavLink to={`/onlyoffice/edit/${version.id}`} target="_blank">
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
                  value={version.fileTitle}
                  onChange={() => {}}
                />
              </Field>
              <Field>
                <FieldLabel>Type</FieldLabel>
                <Input
                  type="text"
                  value={version.fileType}
                  onChange={() => {}}
                />
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
                  value={version.originator}
                  onChange={() => {}}
                />
              </Field>
              <Field>
                <FieldLabel>Department</FieldLabel>
                <Input
                  type="text"
                  value={version.department}
                  onChange={() => {}}
                />
              </Field>
              <Field>
                <FieldLabel>Revision Number</FieldLabel>
                <Input
                  type="text"
                  value={version.revisionNumber}
                  onChange={() => {}}
                />
              </Field>
              <Field className="col-span-2">
                <FieldLabel>Revision Detail</FieldLabel>
                <Textarea value={version.revisionDetails} onChange={() => {}} />
              </Field>
              <Field>
                <FieldLabel>Upload Date</FieldLabel>
                <Input type="text" value={version.uploadDate} disabled />
                <FieldDescription>
                  No action is needed. This field is filled in automatically.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Revision Date</FieldLabel>
                <Input type="text" value={version.revisionDate} disabled />
                <FieldDescription>
                  No action is needed. This field is filled in automatically.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Approver</FieldLabel>
                <Input
                  type="text"
                  value={version.approver}
                  onChange={() => {}}
                />
              </Field>
              <Field>
                <FieldLabel>Approved Date</FieldLabel>
                <Input type="text" value={version.approvedDate} disabled />
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
