import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import type { FileType, VersionType } from "~/constants/types";
import { useNavigate } from "react-router";

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
  editOnClick: () => void;
  deleteOnClick: () => void;
};

export function FileListItem({
  file,
  editOnClick,
  deleteOnClick,
}: FileListItemPropType) {
  const navigate = useNavigate();

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
                <DropdownMenuItem onClick={editOnClick}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={deleteOnClick}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </p>
      </div>
    </li>
  );
}
