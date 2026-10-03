import { PackageOpen, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import type { UserType } from "~/constants/types";
import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/users";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import {
  AdminUserListItem,
  UserListHeader,
} from "~/components/organisms/UserList";

export async function clientLoader() {
  const fetchedUsers = await apiFetch("/user");

  return fetchedUsers.data as UserType[];
}
export default function users({ loaderData }: Route.ComponentProps) {
  const users = loaderData;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-between">
        <h1>Users</h1>
        <Button>
          <Plus color="#ffffff" />
          Add User
        </Button>
      </div>
      <Separator />
      <div className="h-[50em]">
        <UserListHeader />
        {users.length !== 0 ? (
          <ul>
            <ScrollArea className="h-[50em]">
              {users.map((user, index) => (
                <AdminUserListItem key={index} index={index} user={user} />
              ))}
            </ScrollArea>
          </ul>
        ) : (
          <Empty className="h-full">
            <EmptyHeader className="gap-1">
              <EmptyMedia variant={"icon"}>
                <PackageOpen />
              </EmptyMedia>
              <EmptyTitle>No users to display</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  );
}
