import { useState } from "react";
import { useNavigate } from "react-router";
import { PopUpModal } from "~/components";
import DataBlock from "~/components/ui/DataBlock";
import DropDownItem from "~/components/ui/DropDownItem";

export default function Requests() {
  const testData: { title: string; reason: string }[] = [
    {
      title: "For Approval - Revision of Waste Management",
      reason:
        "Updated guidelines required to comply with new environmental regulations.",
    },
    {
      title: "For Review - Employee Code of Conduct",
      reason:
        "Periodic review to ensure policies remain aligned with company values.",
    },
    {
      title: "For Approval - IT Security Policy Update",
      reason: "Necessary changes due to recent cybersecurity audit findings.",
    },
    {
      title: "For Approval - Revision",
      reason: "Reason",
    },
  ];

  const [isVisible, setIsVisible] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [isSubmitEnabled, setSubmitEnabled] = useState(false);
  const navigate = useNavigate();

  function handleCancel() {
    setTextAreaValue("");
    setIsVisible(false);
  }

  function handleSubmit() {}
  function handleApprove() {
    setSubmitEnabled(true);
  }

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full h-full px-4 py-4 gap-2">
        <div className="flex gap-8 h-full ">
          {/* Request Panel */}
          <div className="flex flex-col w-3/4 gap-2 h-full">
            <h1>Requests</h1>
            <ul className="flex flex-col gap-2 pr-4 pb-10 h-full overflow-y-scroll">
              {testData.map((item, index) => (
                <DropDownItem
                  key={index}
                  title={item.title}
                  description={item.reason}
                  handleApprove={handleApprove}
                  handleDeny={() => setIsVisible(true)}
                />
              ))}
            </ul>
          </div>

          {/* Document Details Panel */}
          <div className="flex flex-col justify-between w-full px-4 border-l border-slate-300">
            <div className="w-full">
              <div>
                <h1>Document Details</h1>
              </div>
              <div className="flex justify-between">
                <div className="flex flex-col w-fit px-4 rounded-lg">
                  <h3>File</h3>
                  <a
                    className="underline cursor-pointer"
                    href=""
                    target="_blank"
                  >
                    <p>file.docx</p>
                  </a>
                </div>
                <button className="w-fit px-4 py-2 ">
                  <p className="w-fit cursor-pointer">Attach File</p>
                </button>
              </div>
              <div className="flex w-full justify-around py-4 rounded-lg">
                <DataBlock
                  title="Originator"
                  value="Originator Value"
                  isInteractable={isSubmitEnabled}
                />
                <DataBlock
                  title="Department"
                  value="Department Value"
                  styling="border-l border-slate-400"
                  isInteractable={isSubmitEnabled}
                />
              </div>
              <div className="flex w-full justify-around py-4 rounded-lg">
                <DataBlock
                  title="Revision Number"
                  value="Revision Number Value"
                  isInteractable={isSubmitEnabled}
                />
                <DataBlock
                  title="Revision Details"
                  value="Revision Details Value"
                  styling="border-l border-slate-400"
                  isInteractable={isSubmitEnabled}
                />
                <DataBlock
                  title="Date"
                  value="Date Value"
                  styling="border-l border-slate-400"
                  isInteractable={isSubmitEnabled}
                />
              </div>
              <div className="flex w-full justify-around py-4 rounded-lg">
                <DataBlock
                  title="Approver"
                  value="Approver Value"
                  isInteractable={isSubmitEnabled}
                />
                <DataBlock
                  title="Date"
                  value="Date Value"
                  styling="border-l border-slate-400"
                  isInteractable={isSubmitEnabled}
                />
              </div>
            </div>

            <div className="flex w-full justify-end gap-2">
              {isSubmitEnabled && (
                <button
                  onClick={() => setSubmitEnabled(false)}
                  className={
                    isSubmitEnabled
                      ? "w-1/5 px-4 py-2 rounded-lg cursor-pointer text-gray-400 hover:text-black"
                      : "w-1/5 px-4 py-2 rounded-lg cursor-pointer text-gray-300"
                  }
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {}}
                className={
                  isSubmitEnabled
                    ? "w-1/5 px-4 py-2 rounded-lg cursor-pointer text-black hover:text-white hover:bg-black"
                    : "w-1/5 px-4 py-2 rounded-lg cursor-pointer text-gray-300"
                }
                disabled={!isSubmitEnabled}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {isVisible && (
        <PopUpModal onClose={() => {}}>
          <h2>Comment</h2>
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
    </div>
  );
}
