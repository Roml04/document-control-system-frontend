import { useNavigate } from "react-router";

export default function FileBlock({
  documentId,
  onEditClick,
}: {
  documentId: number | null;
  onEditClick: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center w-full justify-between gap-3">
      <div className="flex gap-2 items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-md bg-slate-200 text-slate-600"></div>
        <div className="flex flex-col">
          <span className="text-sm text-slate-500">File</span>
          <span className="font-medium text-gray-500">document-name.docx</span>
        </div>
      </div>

      <div className="flex gap-2">
        <a
          className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-black hover:text-white transition"
          href=""
          target="_blank"
        >
          Open
        </a>
        <button
          className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-black hover:text-white transition"
          onClick={onEditClick}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
