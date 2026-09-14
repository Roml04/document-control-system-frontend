import formatEnum from "~/utils/formatEnum";
import FileTypeBadge from "../primitives/FileTypeBadge";
import { NavLink } from "react-router";
import { Button } from "../ui/button";
import { downloadFile } from "~/utils/downloadFile";
import { Download } from "lucide-react";
import type { VersionType } from "~/constants/types";

export default function FileItem({ version }: { version: VersionType }) {
  return (
    <div className="flex justify-between border p-4 rounded-lg">
      <div className="flex gap-2 items-center">
        <div className="flex justify-center items-center rounded-sm bg-gray-200 aspect-square h-12">
          <FileTypeBadge type={version.fileType} size={22} />
        </div>
        <div className="flex flex-col">
          <h3>{version.fileTitle}</h3>
          <p>{formatEnum(version.fileType)}</p>
        </div>
      </div>
      <div className="flex items-center">
        <NavLink to={`/onlyoffice/${version.id}?mode=view`} target="_blank">
          <Button variant={"ghost"} type="button">
            Open in editor
          </Button>
        </NavLink>
        <Button
          type="button"
          size={"icon-lg"}
          variant={"ghost"}
          title="Download"
          onClick={() => {
            downloadFile(version.id, version.fileName);
          }}
        >
          <Download size={18} />
        </Button>
      </div>
    </div>
  );
}
