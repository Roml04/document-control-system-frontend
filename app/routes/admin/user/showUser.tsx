import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/showUser";
import type { UserType } from "~/constants/types";
import Header from "~/components/organisms/Header";
import { formatUserName } from "~/utils/formatUserName";
import { Separator } from "~/components/ui/separator";
import formatEnum from "~/utils/formatEnum";
import { PackageOpen, UserRound } from "lucide-react";
import type { REQUESTSTATUS, REQUESTTYPE } from "~/constants/enums";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import avatarFallback from "~/utils/avatarFallback";
import { useNavigate } from "react-router";

export type UserRequestsType = {
  id: number;
  type: REQUESTTYPE;
  title: string;
  reason: string;
  status: REQUESTSTATUS;
  uploadDate: string;
};

const columnStyling = "w-full px-2 content-center";

const columnWidths = {
  id: "col-span-1",
  title: "col-span-3",
  reason: "col-span-3",
  type: "col-span-1",
  status: "col-span-2",
  uploadDate: "col-span-2",
};

const gridStyling = "grid grid-cols-12";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [fetchedUser, fetchedUserRequests] = await Promise.all([
    apiFetch(`/admin/user/${params.id}`),
    apiFetch(`/admin/request/?userid=${params.id}`),
  ]);

  console.log("CLIENT LOADER | ID", params.id);
  console.log("CLIENT LOADER | USER", fetchedUser);
  console.log("CLIENT LOADER | REQUESTS", fetchedUserRequests);

  return {
    user: fetchedUser.data,
    userRequests: fetchedUserRequests.data,
  } as {
    user: UserType;
    userRequests: UserRequestsType[];
  };
}

export default function showUser({ loaderData }: Route.ComponentProps) {
  const { user, userRequests } = loaderData;

  const navigate = useNavigate();

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
            {/* <Avatar size="lg">
              <AvatarImage src="" />
              <AvatarFallback>
                {avatarFallback(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar> */}
            <div className="flex justify-center items-center rounded-sm bg-gray-200 aspect-square h-14">
              <UserRound />
            </div>
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
      <ul className="flex flex-col border rounded-lg h-[40em]">
        <div className="p-4 ">
          <h2>Requests</h2>
        </div>
        <Separator />
        {userRequests.length !== 0 ? (
          <div>
            <div className={`p-4 ${gridStyling}`}>
              <h3 className={`${columnStyling} ${columnWidths.id}`}>ID</h3>
              <h3 className={`${columnStyling} ${columnWidths.title}`}>
                Title
              </h3>
              <h3 className={`${columnStyling} ${columnWidths.reason}`}>
                Reason
              </h3>
              <h3 className={`${columnStyling} ${columnWidths.type}`}>Type</h3>
              <h3 className={`${columnStyling} ${columnWidths.status}`}>
                Status
              </h3>
              <h3 className={`${columnStyling} ${columnWidths.uploadDate}`}>
                Upload Date
              </h3>
            </div>
            {userRequests.map((request, index) => (
              <li
                key={index}
                className={`${gridStyling} p-4 grid hover:bg-accent cursor-pointer`}
                onClick={() => {
                  console.log("REQUEST | ", request);

                  navigate(`/admin/requests/${request.id}`);
                }}
              >
                <p className={`${columnStyling} ${columnWidths.id}`}>
                  {request.id}
                </p>
                <p className={`${columnStyling} ${columnWidths.title}`}>
                  {request.title}
                </p>
                <p className={`${columnStyling} ${columnWidths.reason}`}>
                  {request.reason}
                </p>
                <p className={`${columnStyling} ${columnWidths.type}`}>
                  {request.type.toUpperCase()}
                </p>
                <p className={`${columnStyling} ${columnWidths.status}`}>
                  {formatEnum(request.status)}
                </p>
                <p className={`${columnStyling} ${columnWidths.uploadDate}`}>
                  {request.uploadDate}
                </p>
              </li>
            ))}
          </div>
        ) : (
          <Empty className="h-full">
            <EmptyHeader className="gap-1">
              <EmptyMedia variant={"icon"}>
                <PackageOpen />
              </EmptyMedia>
              <EmptyTitle>
                The user have not submitted any request yet
              </EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
      </ul>
    </div>
  );
}
