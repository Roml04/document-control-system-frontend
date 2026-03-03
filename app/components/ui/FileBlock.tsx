export default function FileBlock({
  filename,
  link,
  isDisabled,
  onChange,
  onEditClick,
  canUpload,
}: {
  filename: string;
  link: string | null;
  isDisabled: boolean;
  onChange?: (file: File) => void;
  onEditClick?: () => void;
  canUpload: boolean;
}) {
  const hasFile = !!link;
  const canEdit = !isDisabled && !!onEditClick;
  const showUpload = (!isDisabled && !!onChange) || canUpload;

  return (
    <>
      {/* CASE A: HAS FILE */}
      {hasFile ? (
        <div className="flex items-center justify-between w-full p-4 rounded-lg border border-slate-300 bg-slate-50">
          <div className="flex items-center w-full justify-between gap-3">
            <div className="flex gap-2 items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-slate-200 text-slate-600"></div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-500">File</span>
                <p className="font-medium text-gray-500">{filename}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Open is always allowed if file exists */}
              <a
                className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-black hover:text-white transition"
                href={link}
                target="_blank"
              >
                Open
              </a>

              {/* Edit only if allowed */}
              {canEdit && (
                <button
                  className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-black hover:text-white transition"
                  onClick={onEditClick}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* CASE B1: NO FILE BUT CAN UPLOAD */}
          {showUpload ? (
            <label
              htmlFor="fileInput"
              className="flex justify-center cursor-pointer items-center px-4 py-12 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50"
            >
              <span className="text-gray-400">Click here to upload a file</span>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={(event) => {
                  if (event.target.files?.[0] && onChange) {
                    onChange(event.target.files[0]);
                  }
                }}
              />
            </label>
          ) : (
            <div className="flex justify-center items-center px-4 py-12 border border-slate-200 rounded-lg bg-slate-50 text-gray-400">
              No file uploaded
            </div>
          )}
        </>
      )}
    </>
  );
}
