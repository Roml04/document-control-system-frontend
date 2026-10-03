import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/showUser";
import type { UserType } from "~/constants/types";
import Header from "~/components/organisms/Header";
import { formatUserName } from "~/utils/formatUserName";
import { Separator } from "~/components/ui/separator";
import formatEnum from "~/utils/formatEnum";
import { Button } from "~/components/ui/button";
import { Pencil, UserRound } from "lucide-react";
import { AdminRequestListItem } from "~/components/organisms/RequestList";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const fetchedUser = await apiFetch(`/admin/user/${params.id}`);

  console.log("CLIENT LOADER", fetchedUser);

  return fetchedUser.data as UserType;
}

export default function showUser({ loaderData }: Route.ComponentProps) {
  const user = loaderData;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateCreated = new Date(user.createdAt);

  return (
    <div className="flex flex-col gap-4">
      <Header />
      <div className="border p-4 rounded-lg flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <UserRound color="#000000" />
            <h1>{formatUserName(user.firstName, user.lastName)}</h1>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-3 gap-y-4">
          <div>
            <p className="text-muted-foreground">ID</p>
            <p>{user.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">First Name</p>
            <p>{user.firstName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Name</p>
            <p>{user.lastName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Role</p>
            <p>{formatEnum(user.role)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Created At</p>
            <p>{`${months[dateCreated.getMonth()]} ${dateCreated.getDay()}, ${dateCreated.getFullYear()}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
