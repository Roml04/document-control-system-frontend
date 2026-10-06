import React, { useState } from "react";
import type { VersionType } from "~/constants/types";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import formatEnum from "~/utils/formatEnum";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate, useRevalidator } from "react-router";
import { apiFetch } from "~/utils/apiFetch";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { allowedRoles } from "~/utils/allowedRoles";

const gridStyling = "grid grid-cols-27";

const columnStyling = "w-full content-center truncate";

const columnWidths = {
  id: `col-span-1 ${columnStyling} px-4`,
  fileTitle: `col-span-6 ${columnStyling}`,
  fileType: `col-span-2 ${columnStyling}`,
  status: `col-span-2 ${columnStyling}`,
  originator: `col-span-3 ${columnStyling}`,
  uploadDate: `col-span-4 ${columnStyling}`,
  revisionDate: `col-span-4 ${columnStyling}`,
  approvedDate: `col-span-4 ${columnStyling} `,
  action: `col-span-1 ${columnStyling} flex justify-center items-center`,
};

export default function VersionListHeader() {
  return (
    <div className={`${gridStyling} py-2 px-4`}>
      <h3 className={columnWidths.id}>ID</h3>
      <h3 className={columnWidths.fileTitle}>File Title</h3>
      <h3 className={columnWidths.fileType}>File Type</h3>
      <h3 className={columnWidths.status}>Status</h3>
      <h3 className={columnWidths.originator}>Originator</h3>
      <h3 className={columnWidths.uploadDate}>Upload Date</h3>
      <h3 className={columnWidths.revisionDate}>Revision Date</h3>
      <h3 className={columnWidths.approvedDate}>Approved Date</h3>
      <h3 className={columnWidths.action}>Action</h3>
    </div>
  );
}

type VersionListItemPropType = {
  version: VersionType;
};

export function VersionListItem({ version }: VersionListItemPropType) {
  const navigate = useNavigate();

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const revalidator = useRevalidator();

  const handleDeleteVersion = async () => {
    const apiResponse = await apiFetch(`/admin/version/${version.id}`, {
      method: "DELETE",
    });

    if (!apiResponse.ok) {
      toast.error("Failed to delete version", {
        position: "top-center",
        description: apiResponse.message,
      });
      return;
    }

    revalidator.revalidate();
    toast.success("Version deleted", {
      position: "top-center",
    });
  };

  return (
    <li
      className={`${gridStyling} cursor-pointer rounded-lg hover:bg-accent px-4`}
    >
      <div
        className={`col-span-26 grid grid-cols-26 py-4`}
        onClick={() => navigate(`/admin/versions/${version.id}`)}
      >
        <p className={columnWidths.id}>{version.id}</p>
        <p className={columnWidths.fileTitle}>{version.fileTitle}</p>
        <p className={columnWidths.fileType}>{formatEnum(version.fileType)}</p>
        <p className={columnWidths.status}>{formatEnum(version.status)}</p>
        <p className={columnWidths.originator}>{version.originator}</p>
        <p className={columnWidths.uploadDate}>{version.uploadDate}</p>
        <p className={columnWidths.revisionDate}>{version.revisionDate}</p>
        <p className={columnWidths.approvedDate}>
          {version.approvedDate ?? "--"}
        </p>
      </div>
      <div className={`${columnWidths.action} py-4`}>
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
                  allowedRoles(["sysadmin"])
                    ? navigate(`/admin/versions/${version.id}`)
                    : navigate(`/versions/${version.id}`);
                }}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/admin/versions/${version.id}/edit`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setOpenDeleteAlert(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm version deletion?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete{" "}
                <span className="font-bold">version ID #{version.id}</span>.
                This action cannot be undone. Do you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant={"destructive"}
                onClick={handleDeleteVersion}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}
