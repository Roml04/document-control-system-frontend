import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "~/components/ui/sheet";
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import LoadingButton from "~/components/primitives/LoadingButton";

import { useEffect, useState, type SubmitEventHandler } from "react";
import { toast } from "sonner";
import { apiFetch } from "~/utils/apiFetch";
import type { FileType, UserType, VersionType } from "~/constants/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { allowedRoles } from "~/utils/allowedRoles";
import { useRevalidator } from "react-router";
import { formatUserName } from "~/utils/formatUserName";

type CreateRevSheetType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latestVersionid?: number;
};

type FetchedFilesType = FileType & {
  latestVersion: VersionType[];
};

export default function CreateRevSheet({
  open,
  onOpenChange,
  latestVersionid,
}: CreateRevSheetType) {
  const needsPicker = latestVersionid === undefined;

  const [isSpinning, setIsSpinning] = useState(false);
  const [files, setFiles] = useState<FetchedFilesType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);

  const revalidator = useRevalidator();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await apiFetch("/user");
      setUsers(fetchedUsers.data);
    };

    const fetchFiles = async () => {
      const fetchedFiles = await apiFetch("/file");
      setFiles(fetchedFiles.data);
    };

    fetchUsers();

    if (!needsPicker || !open) return;

    fetchFiles();
  }, [needsPicker, open]);

  const handleSubmitRequest: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    try {
      setIsSpinning(true);
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      formData.append("type", "rev");

      console.log("FORMDATA", Object.fromEntries(formData.entries()));

      const apiResponse = await apiFetch(
        allowedRoles(["sysadmin"]) ? "/admin/request" : "/request",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!apiResponse.ok) {
        toast.error("Failed to submit request", {
          position: "top-center",
          description: apiResponse.message,
        });

        return;
      }

      onOpenChange(false);
      toast.error("Request submitted", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to submit request", {
        position: "top-center",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSpinning(false);
    }
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-[30vw] sm:max-w-[30vw]! h-dvh p-0"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
        onAnimationEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.currentTarget.dataset.state === "closed"
          ) {
            revalidator.revalidate();
          }
        }}
      >
        <form
          onSubmit={handleSubmitRequest}
          className="flex h-full min-h-0 flex-col"
        >
          <SheetHeader>
            <h1>Create a Revision Request</h1>
            <p>
              Creates a revision request that goes through the normal approval
              process.
            </p>
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
                    name="title"
                    type="text"
                    placeholder="e.g., Request for document upload"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="reason">Reason</FieldLabel>
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Describe the purpose or reason for submitting this request..."
                    required
                  />
                </Field>
                {allowedRoles(["sysadmin"]) && needsPicker ? (
                  <>
                    <Field>
                      <FieldLabel>File to Revise</FieldLabel>
                      <Select name="latestVersionId" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a file to revise" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectGroup>
                            <SelectLabel>Files</SelectLabel>
                            {files.map((file, index) => (
                              <SelectItem
                                key={index}
                                value={file.id.toString()}
                              >
                                {file.title}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </>
                ) : (
                  <input
                    type="hidden"
                    name="latestVersionId"
                    value={latestVersionid}
                  />
                )}
                {allowedRoles(["sysadmin"]) && (
                  <Field>
                    <FieldLabel>Author</FieldLabel>
                    <Select name="authorId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an author" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          <SelectLabel>Users</SelectLabel>
                          {users.map((user, index) => (
                            <SelectItem key={index} value={user.id.toString()}>
                              {formatUserName(user.firstName, user.lastName)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </FieldGroup>
            </FieldSet>
          </ScrollArea>
          <Separator />
          <SheetFooter>
            <LoadingButton
              displayText="Submit Request"
              loadingDisplayText="Submitting request..."
              isSpinning={isSpinning}
            />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
