import { useState } from "react";
import { PopUpModal } from "~/components";
import DocumentsPageLayout from "~/components/layout.tsx/DocumentsPageLayout";
import DataBlock from "~/components/ui/DataBlock";

export default function WasteManagement() {
  const [isVisible, setIsVisible] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");

  function handleRevisionClick() {
    setIsVisible(true);
  }

  function handleObsoleteClick() {}

  function handleCancel() {
    setTextAreaValue("");
    setIsVisible(false);
  }

  function handleSubmit() {}

  return (
    <>
      <DocumentsPageLayout pagetitle="Waste Management Procedure">
        <div className="flex flex-col w-full p-4 rounded-lg">
          <h3>File</h3>
          <a className="underline cursor-pointer" href="" target="_blank">
            <p>file.docx</p>
          </a>
        </div>
        <div className="flex w-full justify-around py-4 rounded-lg">
          <DataBlock title="Originator" value="Originator Value" />
          <DataBlock
            title="Department"
            value="Department Value"
            styling="border-l border-slate-400"
          />
        </div>
        <div className="flex w-full justify-around py-4 rounded-lg">
          <DataBlock title="Revision Number" value="Revision Number Value" />
          <DataBlock
            title="Revision Details"
            value="Revision Details Value"
            styling="border-l border-slate-400"
          />
          <DataBlock
            title="Date"
            value="Date Value"
            styling="border-l border-slate-400"
          />
        </div>
        <div className="flex w-full justify-around py-4 rounded-lg">
          <DataBlock title="Approver" value="Approver Value" />
          <DataBlock
            title="Date"
            value="Date Value"
            styling="border-l border-slate-400"
          />
        </div>
        <div className="flex w-full justify-end gap-2">
          <button
            onClick={handleRevisionClick}
            className="border w-1/5 px-4 py-2 rounded-lg "
          >
            Revision
          </button>
          <button
            onClick={handleObsoleteClick}
            className="border w-1/5 px-4 py-2 rounded-lg"
          >
            Obsolete
          </button>
        </div>
      </DocumentsPageLayout>
      {isVisible && (
        <PopUpModal onClose={() => {}}>
          <h2>Reason</h2>
          <textarea
            className="px-4 py-2 border rounded-lg resize-y min-h-32 outline-none"
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
          />
          <div className="flex w-full justify-between gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 border rounded-lg cursor-pointer"
            >
              Submit
            </button>
          </div>
        </PopUpModal>
      )}
    </>
  );
}
