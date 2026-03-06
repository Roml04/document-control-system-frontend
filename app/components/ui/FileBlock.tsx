export default function FileBlock({
  filename,
  link,
  isDisabled,
  onChange,
  onEditClick,
  onRemove,
  canUpload,
}: {
  filename: string | null;
  link: string | null;
  isDisabled: boolean;
  onChange?: (file: File) => void;
  onEditClick?: () => void;
  onRemove?: () => void;
  canUpload: boolean;
}) {
  const hasFile = !!link || !!filename;
  const canEdit = !isDisabled && !!onEditClick;
  const canRemove = !isDisabled && !!onRemove;
  const showUpload = !isDisabled && !!onChange && canUpload;

  return (
    <>
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
              {link && (
                <a
                  className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-black hover:text-white transition"
                  href={link}
                  target="_blank"
                >
                  Open
                </a>
              )}

              {canEdit && (
                <button
                  className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-black hover:text-white transition"
                  onClick={onEditClick}
                >
                  Edit
                </button>
              )}

              {canRemove && (
                <button
                  className="px-4 py-2 text-sm rounded-md border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition"
                  onClick={onRemove}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
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
