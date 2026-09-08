import FileTypeBadge from "./FileTypeBadge";
import { Separator } from "../ui/separator";
import type { FileType, VersionType } from "~/constants/types";
import { useNavigate } from "react-router";
import { formatDateTime } from "~/utils/formatDateTime";

type FileCardPropType = {
  file: FileType & {
    latestVersion: VersionType;
  };
};

export default function FileCard({ file }: FileCardPropType) {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col gap-2 border p-4 rounded-lg cursor-pointer active:bg-muted"
      onClick={() => {
        navigate(`/files/${file.id}`);
      }}
    >
      <div className="flex">
        <FileTypeBadge type={file.type} size={20} />
        <div className="flex w-full justify-center px-3 flex-col">
          <h3 className="truncate">{file.title}</h3>
          <p className="truncate">{file.type}</p>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-9 w-full py-2">
        <div className="col-span-2">
          <p>Rev. no.</p>
          <p className="truncate">{file.latestVersion.revisionNumber}</p>
        </div>
        <div className="col-span-4">
          <p>Rev. date</p>
          <p className="truncate">
            {formatDateTime(file.latestVersion.revisionDate)}
          </p>
        </div>
        <div className="flex flex-col items-end truncate col-span-3">
          <p>Author</p>
          <p className="truncate">{file.latestVersion.originator}</p>
        </div>
      </div>
    </div>
  );
}
