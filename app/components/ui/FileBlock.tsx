export default function FileBlock({
  filename,
  onEditClick,
  onChange,
  isDisabled,
  link,
}: {
  filename: string;
  onEditClick?: () => void;
  onChange?: (event: File) => void;
  isDisabled: boolean;
  link: string | null;
}) {
  const hasFile = !!link;

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
              <a
                className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-black hover:text-white transition"
                href={link}
                target="_blank"
              >
                Open
              </a>
              {!isDisabled && (
                <button
                  className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-black hover:text-white transition"
                  onClick={onEditClick}
                  disabled={isDisabled}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
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
                console.log("HELOOOOOOOOOOOOO");
                onChange(event.target.files[0]);
              }
            }}
          />
        </label>
      )}
    </>
  );
}
