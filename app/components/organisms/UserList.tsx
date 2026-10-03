import type { UserType } from "~/constants/types";
import { formatUserName } from "~/utils/formatUserName";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router";

const columnStyling = "w-full px-2 content-center";

const columnWidths = {
  id: `${columnStyling} col-span-1`,
  name: `${columnStyling} col-span-4`,
  role: `${columnStyling} col-span-3`,
  email: `${columnStyling} col-span-3`,
  action: `px-2 col-span-1`,
};

const gridStyling = `grid grid-cols-12`;

export function UserListHeader() {
  return (
    <div className={`${gridStyling} place-items-center py-2 px-4 mb-2`}>
      <h3 className={columnWidths.id}>ID</h3>
      <h3 className={columnWidths.name}>Name</h3>
      <h3 className={columnWidths.role}>Role</h3>
      <h3 className={columnWidths.email}>Email</h3>
      <h3 className={columnWidths.action}>Action</h3>
    </div>
  );
}

type AdminUserListItemPropType = {
  user: UserType;
};

export function AdminUserListItem({ user }: AdminUserListItemPropType) {
  const navigate = useNavigate();
  return (
    <li
      className={`${gridStyling} cursor-pointer rounded-lg py-4 px-4 hover:bg-accent`}
    >
      <div
        className={`col-span-11 grid grid-cols-11`}
        onClick={() => navigate(`/admin/users/${user.id}`)}
      >
        <p className={columnWidths.id}>{user.id}</p>
        <p className={columnWidths.name}>
          {formatUserName(user.firstName, user.lastName)}
        </p>
        <p className={columnWidths.role}>{user.role}</p>
        <p className={columnWidths.email}>{user.email}</p>
      </div>
      <div className={`col-span-1 grid grid-cols-1 ${columnWidths.action}`}>
        <div className={`flex justify-center`}>
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
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </li>
  );
}
