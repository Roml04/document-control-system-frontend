import type { Route } from "./+types/editVersion";
import { Separator } from "~/components/ui/separator";
import { apiFetch } from "~/utils/apiFetch";
import type { VersionType } from "~/constants/types";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import LoadingButton from "~/components/primitives/LoadingButton";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";
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

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const apiResponse = await apiFetch(`/version/${params.id}`);
  console.log("INFO | VERSION", apiResponse);
  // const apiResponse = await apiFetch(`/version/${params.id}/onlyoffice/edit`);
  return { version: apiResponse.data } as { version: VersionType };
}

export default function editVersion({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const { version } = loaderData;

  const textValue = "Test Value";
  const fileName = "Document";

  return (
    <div className="flex flex-col gap-2">
      <header>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant={"ghost"}>
              <ChevronLeft />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Discard progress?</AlertDialogTitle>
              <AlertDialogDescription>
                Any progress made in this page would not be saved and will be
                lost forever.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => navigate(-1)}>
                Proceed
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>
      <div className="flex flex-col gap-2 h-[55em]">
        <h1>Editing {fileName}</h1>
        <Separator />
        <div className="flex gap-4 h-full">
          <div className="flex justify-center items-center w-3/4 border rounded-lg">
            {/* <OnlyOfficeEditor config={config} /> */}

            <NavLink to={`/onlyoffice/edit/${version.id}`} target="_blank">
              Edit
            </NavLink>
          </div>
          <div className="flex flex-col w-1/4 h-full justify-between border p-4 rounded-lg">
            <ScrollArea className="h-full">
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input type="text" value={fileName} onChange={() => {}} />
                  </Field>
                </FieldGroup>
                <FieldSeparator />
                <FieldGroup className="flex flex-col">
                  <Field>
                    <FieldLabel>Originator</FieldLabel>
                    <Input type="text" value={textValue} onChange={() => {}} />
                  </Field>
                  <Field>
                    <FieldLabel>Department</FieldLabel>
                    <Input type="text" value={textValue} onChange={() => {}} />
                  </Field>
                  <Field>
                    <FieldLabel>Revision Number</FieldLabel>
                    <Input type="text" value={textValue} onChange={() => {}} />
                  </Field>
                  <Field>
                    <FieldLabel>Revision Detail</FieldLabel>
                    <Input type="text" value={textValue} onChange={() => {}} />
                  </Field>
                  <Field>
                    <FieldLabel>Upload Date</FieldLabel>
                    <Input type="text" value={textValue} disabled />
                  </Field>
                  <Field>
                    <FieldLabel>Revision Date</FieldLabel>
                    <Input type="text" value={textValue} disabled />
                  </Field>
                  <Field>
                    <FieldLabel>Approver</FieldLabel>
                    <Input type="text" value={textValue} onChange={() => {}} />
                  </Field>
                  <Field>
                    <FieldLabel>Approved Date</FieldLabel>
                    <Input type="text" value={textValue} disabled />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </ScrollArea>
            <LoadingButton
              type="submit"
              displayText="Submit"
              loadingDisplayText="Submitting revision..."
              isSpinning={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
