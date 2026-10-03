import type { UserType } from "~/constants/types";
import { formatUserName } from "~/utils/formatUserName";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router";

const columnStyling = "w-full px-2 content-center";

const columnWidths = {
  id: `${columnStyling} col-span-1`,
  name: `${columnStyling} col-span-4`,
  role: `${columnStyling} col-span-3`,
  email: `${columnStyling} col-span-3`,
  action: `${columnStyling} col-span-1`,
};

const gridStyling = `grid grid-cols-12`;

export function UserListHeader() {
  return (
    <div className={`${gridStyling} place-items-center py-2 mb-2`}>
      <h3 className={columnWidths.id}>ID</h3>
      <h3 className={columnWidths.name}>Name</h3>
      <h3 className={columnWidths.role}>Role</h3>
      <h3 className={columnWidths.email}>Email</h3>
      <h3 className={columnWidths.action}>Action</h3>
    </div>
  );
}

type AdminUserListItemPropType = {
  index: number;
  user: UserType;
};

export function AdminUserListItem({ index, user }: AdminUserListItemPropType) {
  const navigate = useNavigate();
  return (
    <li className="grid grid-cols-12 cursor-pointer rounded-lg hover:bg-accent">
      <div
        className={`col-span-11 py-5 grid grid-cols-11`}
        onClick={() => console.log("NAVIGATED TO /users/:id")}
      >
        <p className={columnWidths.id}>{user.id}</p>
        <p className={columnWidths.name}>
          {formatUserName(user.firstName, user.lastName)}
        </p>
        <p className={columnWidths.role}>{user.role}</p>
        <p className={columnWidths.email}>{user.email}</p>
      </div>
      <div className={columnWidths.action}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>View</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}
