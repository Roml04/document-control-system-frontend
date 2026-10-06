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
import { useNavigate, useRevalidator } from "react-router";
import { useState } from "react";
import { apiFetch } from "~/utils/apiFetch";
import { toast } from "sonner";

const gridStyling = "grid grid-cols-18";
const columnStyling = "content-center";

const columnWidth = {
  id: `${columnStyling} col-span-1 px-4`,
  title: `${columnStyling} col-span-8`,
  type: `${columnStyling} col-span-4`,
  author: `${columnStyling} col-span-4`,
  action: `${columnStyling} col-span-1 flex justify-center items-center`,
};

export function FileListHeader() {
  return (
    <div className={`${gridStyling} py-2 px-4`}>
      <h3 className={`${columnWidth.id}`}>ID</h3>
      <h3 className={`${columnWidth.title}`}>Title</h3>
      <h3 className={`${columnWidth.type}`}>Type</h3>
      <h3 className={`${columnWidth.author}`}>Author</h3>
      <h3 className={`${columnWidth.action}`}>Action</h3>
    </div>
  );
}

type FileListItemPropType = {
  file: FileType & {
    latestVersion: VersionType;
  };
};

export function AdminFileListItem({ file }: FileListItemPropType) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const revalidator = useRevalidator();

  const navigate = useNavigate();

  const handleDeleteFile = async () => {
    try {
      const apiResponse = await apiFetch(`/admin/file/${file.id}`, {
        method: "DELETE",
      });

      if (!apiResponse.ok) {
        toast.error("Failed to delete file", {
          description: apiResponse.message,
          position: "top-center",
        });
      }

      revalidator.revalidate();

      toast.success("File deleted successfully", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to delete file", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  return (
    <li
      className={`${gridStyling} rounded-lg cursor-pointer hover:bg-accent px-4`}
    >
      <div
        onClick={() => {
          navigate(`/admin/files/${file.id}`);
        }}
        className="col-span-17 grid grid-cols-17 py-4"
      >
        <p className={`${columnWidth.id}`}>{file.id}</p>
        <p className={`${columnWidth.title}`}>{file.title}</p>
        <p className={`${columnWidth.type}`}>{file.type}</p>
        <p className={`${columnWidth.author}`}>
          {file.latestVersion.originator}
        </p>
      </div>
      <div className={`col-span-1 grid grid-cols-1 py-4`}>
        <div className={`${columnWidth.action}`}>
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
                    navigate(`/admin/files/${file.id}`);
                  }}
                >
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigate(`/admin/files/${file.id}/edit`);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setOpenDeleteDialog(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
            <AlertDialogAction
              variant={"destructive"}
              onClick={handleDeleteFile}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}
