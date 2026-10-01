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
import { Button } from "~/components/ui/button";
import type { SubmitEventHandler } from "react";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  // const apiResponse = await apiFetch(`/request/${params.id}`);

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

  const handleEditRequest: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    console.log("FORM DATA", Object.fromEntries(formData.entries()));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full flex justify-between">
        <Header />
      </div>
      <form onSubmit={handleEditRequest} className="w-1/3 flex flex-col gap-4">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                name="title"
                defaultValue={request.title}
                placeholder="Title..."
              />
            </Field>
            <Field>
              <FieldLabel>Reason</FieldLabel>
              <Input
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
        <div className="w-full flex justify-end">
          <Button>Save</Button>
        </div>
      </form>
    </div>
  );
}
