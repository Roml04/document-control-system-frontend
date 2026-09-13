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
import type { RequestType, UserType } from "~/constants/types";
import { formatUserName } from "~/utils/formatUserName";

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

  console.log("INFO | SUPERIORS", superiors);

  console.log("INFO | LOADER DATA", loaderData);
  return (
    <div className="flex flex-col gap-2">
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
                    // dispatchEditVersion({
                    //   type: ACTION.RESETDETAILS,
                    //   payload: {},
                    // });
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
            isSpinning={false}
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
                  <Input type="text" placeholder="Enter title..." />
                </Field>
                <Field>
                  <FieldLabel>Reason</FieldLabel>
                  <Input type="text" placeholder="Enter reason..." />
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
                  <Input type="text" placeholder="Enter file title" />
                </Field>
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <Select>
                    <SelectTrigger>
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
                  <Input type="text" placeholder="Enter title..." />
                </Field>
                <Field>
                  <FieldLabel>Department</FieldLabel>
                  <Input type="text" placeholder="Enter reason..." />
                </Field>
                <Field>
                  <FieldLabel>Revision Number</FieldLabel>
                  <Input type="text" placeholder="Enter reason..." />
                </Field>
                <Field className="col-span-2">
                  <FieldLabel>Revision Detail</FieldLabel>
                  <Textarea placeholder="Enter reason..." />
                </Field>
                <Field>
                  <FieldLabel>Upload Date</FieldLabel>
                  <Input type="text" placeholder="Enter reason..." disabled />
                </Field>
                <Field>
                  <FieldLabel>Revision Date</FieldLabel>
                  <Input type="text" placeholder="Enter reason..." disabled />
                </Field>
                <Field>
                  <FieldLabel>Approver</FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Approver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Approver</SelectLabel>
                        {superiors.map((superior, index) => {
                          console.log("SUPERIOR", superior);
                          return (
                            <SelectItem
                              key={index}
                              value={formatUserName(
                                superior.firstName,
                                superior.lastName,
                              )}
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
                  <Input type="text" placeholder="Enter reason..." disabled />
                </Field>
              </FieldGroup>
            </FieldSet>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
