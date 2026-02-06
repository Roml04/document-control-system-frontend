import DocumentsPageLayout from "~/components/layout.tsx/DocumentsPageLayout";
import DataBlock from "~/components/ui/DataBlock";

export default function UpdateDocument() {
  return (
    <DocumentsPageLayout pagetitle="Update Document">
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
          onClick={() => {}}
          className="border w-1/5 px-4 py-2 rounded-lg "
        >
          Submit
        </button>
      </div>
    </DocumentsPageLayout>
  );
}
