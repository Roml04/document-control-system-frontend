import formatEnum from "~/utils/formatEnum";
import FileTypeBadge from "../primitives/FileTypeBadge";
import { NavLink } from "react-router";
import { Button } from "../ui/button";
import { downloadFile } from "~/utils/downloadFile";
import { Download, Replace, X } from "lucide-react";
import type { VersionType } from "~/constants/types";
import { useRef } from "react";
import { FILETYPE } from "~/constants/enums";

type FileItemType = {
  version: VersionType | null;
  mode: "view" | "edit";
  isReplaceable?: boolean;
  file?: File | null;
  setFile?: (file: File | null) => void;
};

export default function FileItem({
  version,
  mode,
  isReplaceable,
  file,
  setFile,
}: FileItemType) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (file) {
    return (
      <div className="flex border p-4 rounded-lg justify-between w-full">
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center rounded-sm bg-gray-200 aspect-square h-12">
            <FileTypeBadge type={FILETYPE.DOCUMENT} size={22} />
          </div>
          <div className="flex flex-col">
            <h3>{file.name}</h3>
            <p>{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        </div>
        <div className="flex items-center">
          <Button
            type="button"
            size={"icon-lg"}
            variant={"ghost"}
            title="Download"
            onClick={() => {
              const url = URL.createObjectURL(file);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = file.name;
              anchor.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download size={18} />
          </Button>
          {isReplaceable && setFile ? (
            <div>
              <Button
                type="button"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                variant={"ghost"}
                size={"icon-lg"}
                title="Replace file"
              >
                <Replace />
              </Button>
              <input
                ref={fileInputRef}
                id="replaceFile"
                className="sr-only"
                onChange={(e) => {
                  setFile?.(e.target.files?.[0] ?? null);
                }}
                type="file"
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
  if (!version) {
    return (
      <div className="flex border p-4 rounded-lg justify-between w-full">
        No file available
      </div>
    );
  }

  return (
    <div className="flex border p-4 rounded-lg justify-between w-full">
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
        <NavLink to={`/onlyoffice/${version.id}?mode=${mode}`} target="_blank">
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
        {isReplaceable && setFile ? (
          <div>
            <Button
              type="button"
              onClick={() => {
                fileInputRef.current?.click();
              }}
              variant={"ghost"}
              size={"icon-lg"}
              title="Replace file"
            >
              <Replace />
            </Button>
            <input
              ref={fileInputRef}
              id="replaceFile"
              className="sr-only"
              onChange={(e) => {
                setFile?.(e.target.files?.[0] ?? null);
              }}
              type="file"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
