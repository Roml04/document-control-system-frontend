import { useState } from "react";
import { PopUpModal } from "~/components";
import { Icon } from "~/components";

type DataBlockProps = {
  title: string;
  value: string;
  styling?: string;
};

export default function WasteManagement() {
  function DataBlock({ title, value, styling }: DataBlockProps) {
    return (
      <div className={`flex w-full flex-col px-4 ${styling}`}>
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    );
  }

  const [isVisible, setIsVisible] = useState(false);

  function handleRevisionClick() {
    setIsVisible(true);
  }

  function handleObsoleteClick() {}

  return (
    <>
      <div className="flex justify-center h-full mt-8">
        <div className="flex flex-col w-3/4 py-2 gap-2">
          <div className="flex">
            <Icon name="arrow-left" />
            <h1>Waste Management Procedure</h1>
          </div>
          <div className="flex flex-col w-full p-4 border rounded-lg">
            <h3>File</h3>
            <p className="underline">file.docx</p>
          </div>
          <div className="flex w-full justify-around py-4 border rounded-lg">
            <DataBlock title="Originator" value="Originator Value" />
            <DataBlock
              title="Department"
              value="Department Value"
              styling="border-l border-slate-400"
            />
          </div>
          <div className="flex w-full justify-around py-4 border rounded-lg">
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
          <div className="flex w-full justify-around py-4 border rounded-lg">
            <DataBlock title="Approver" value="Approver Value" />
            <DataBlock
              title="Date"
              value="Date Value"
              styling="border-l border-slate-400"
            />
          </div>
          <div className="flex w-full justify-center gap-2">
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
        </div>
      </div>
      {isVisible && <PopUpModal onClose={() => setIsVisible(false)} />}
    </>
  );
}
