import Header from "~/components/organisms/Header";
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/editRequest";
import { apiFetch } from "~/utils/apiFetch";
import type { RequestType, UserType } from "~/constants/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import formatEnum from "~/utils/formatEnum";
import { REQUESTSTATUS } from "~/constants/enums";
import { formatUserName } from "~/utils/formatUserName";
import type { SubmitEventHandler } from "react";
import LoadingButton from "~/components/primitives/LoadingButton";
import { Textarea } from "~/components/ui/textarea";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ScrollArea } from "~/components/ui/scroll-area";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [fetchedRequest, fetchedUsers] = await Promise.all([
    apiFetch(`/request/${params.id}`),
    apiFetch("/user"),
  ]);

  console.log("USERS", fetchedUsers);

  return { request: fetchedRequest.data, users: fetchedUsers.data } as {
    request: RequestType;
    users: UserType[];
  };
}

export default function editRequest({ loaderData }: Route.ComponentProps) {
  const { request, users } = loaderData;

  const requestStatuses = Object.values(REQUESTSTATUS);

  const navigate = useNavigate();

  const handleEditRequest: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    console.log("FORM DATA", Object.fromEntries(formData.entries()));

    const apiResponse = await apiFetch(`/admin/request/${request.id}`, {
      method: "PATCH",
      body: formData,
    });

    if (!apiResponse.ok) {
      toast.error("Failed to edit request", {
        position: "top-center",
        description: apiResponse.message,
      });

      return;
    }

    console.log("RESPONSE", apiResponse);

    navigate(-1);

    toast.error("Request edited", {
      position: "top-center",
    });
  };

  return (
    <form onSubmit={handleEditRequest} className="flex flex-col gap-4">
      <div className="w-full flex justify-between">
        <Header />
        <LoadingButton
          loadingDisplayText="Saving..."
          displayText="Save and Update"
          isSpinning={false}
        />
      </div>
      <h1>Editing '{request.title}'</h1>
      <ScrollArea className="h-[50em]">
        <div className="flex flex-col gap-4">
          <FieldSet className="border rounded-lg p-4">
            <h2>Request Details</h2>
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input
                  name="title"
                  defaultValue={request.title}
                  placeholder="Title..."
                />
              </Field>
              <Field className="col-span-2">
                <FieldLabel>Reason</FieldLabel>
                <Textarea
                  name="reason"
                  defaultValue={request.reason}
                  placeholder="Reason..."
                />
              </Field>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select defaultValue={request.status} name="status">
                  <SelectTrigger>
                    <SelectValue placeholder="Select request status" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {requestStatuses.map((status, index) => (
                        <SelectItem key={index} value={status}>
                          {formatEnum(status)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Author</FieldLabel>
                <Select
                  defaultValue={request.user?.id.toString() ?? undefined}
                  name="authorId"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {users.map((user, index) => (
                        <SelectItem key={index} value={user.id.toString()}>
                          {formatUserName(user.firstName, user.lastName)}
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
    </form>
  );
}
