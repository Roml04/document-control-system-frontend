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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import UserEditForm from "./UserEditForm";

const columnStyling = "w-full content-center";

const columnWidths = {
  id: `${columnStyling} col-span-1 px-4`,
  name: `${columnStyling} col-span-4`,
  role: `${columnStyling} col-span-3`,
  email: `${columnStyling} col-span-3`,
  action: `col-span-1 flex justify-center items-center`,
};

const gridStyling = `grid grid-cols-12`;

export function UserListHeader() {
  return (
    <div className={`${gridStyling} place-items-center py-2 px-4`}>
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
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
  const navigate = useNavigate();
  return (
    <li
      className={`${gridStyling} cursor-pointer rounded-lg hover:bg-accent px-4`}
    >
      <div
        className={`col-span-11 grid grid-cols-11 py-4`}
        onClick={() => navigate(`/admin/users/${user.id}`)}
      >
        <p className={columnWidths.id}>{user.id}</p>
        <p className={columnWidths.name}>
          {formatUserName(user.firstName, user.lastName)}
        </p>
        <p className={columnWidths.role}>{user.role}</p>
        <p className={columnWidths.email}>{user.email}</p>
      </div>
      <div
        className={`col-span-1 grid grid-cols-1 py-4 ${columnWidths.action}`}
      >
        <div className={`flex justify-center`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setOpenEditUserDialog(true)}
                  // onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
            <Dialog
              open={openEditUserDialog}
              onOpenChange={setOpenEditUserDialog}
            >
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <UserEditForm
                  user={user}
                  open={openEditUserDialog}
                  onOpenChange={setOpenEditUserDialog}
                />
              </DialogContent>
            </Dialog>
          </DropdownMenu>
        </div>
      </div>
    </li>
  );
}
