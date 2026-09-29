import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "../ui/button";
import type { FileType, VersionType } from "~/constants/types";
import { useNavigate } from "react-router";
import { useState } from "react";

const gridStyling = "grid grid-cols-18 px-4";

const columnSpan = {
  id: "col-span-1",
  title: "col-span-8",
  type: "col-span-4",
  author: "col-span-4",
  action: "col-span-1",
};

const columnStyling = "w-full px-2 content-center";

export function FileListHeader() {
  return (
    <div className={`${gridStyling} place-items-center py-2`}>
      <div className={`${columnSpan.id} ${columnStyling}`}>
        <h3>ID</h3>
      </div>
      <div className={`${columnSpan.title} ${columnStyling}`}>
        <h3>Title</h3>
      </div>
      <div className={`${columnSpan.type} ${columnStyling}`}>
        <h3>Type</h3>
      </div>
      <div className={`${columnSpan.author} ${columnStyling}`}>
        <h3>Author</h3>
      </div>
      <div
        className={`${columnSpan.action} ${columnStyling} flex justify-center`}
      >
        <h3>Action</h3>
      </div>
    </div>
  );
}

type FileListItemPropType = {
  file: FileType & {
    latestVersion: VersionType;
  };
};

export function FileListItem({ file }: FileListItemPropType) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const navigate = useNavigate();

  const handleDeleteFile = async () => {
    /**
     *
     */
  };

  return (
    <li
      className={`${gridStyling} py-3 rounded-lg cursor-pointer hover:bg-accent`}
    >
      <div
        onClick={() => {
          navigate(`/admin/files/${file.id}`);
        }}
        className={`col-span-17 grid grid-cols-17`}
      >
        <p className={`${columnStyling} ${columnSpan.id}`}>{file.id}</p>
        <p className={`${columnStyling} ${columnSpan.title}`}>{file.title}</p>
        <p className={`${columnStyling} ${columnSpan.type}`}>{file.type}</p>
        <p className={`${columnStyling} ${columnSpan.author}`}>
          {file.latestVersion.originator}
        </p>
      </div>
      <div className={`col-span-1`}>
        <p
          className={`${columnStyling} ${columnSpan.action} flex justify-center items-center`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    navigate(`/admin/files/${file.id}/edit`);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setOpenDeleteDialog(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </p>
      </div>
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm file deletion?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-bold">{file.title}</span> and bypass the
              approval process. This action cannot be undone. Do you want to
              proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant={"destructive"}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}
