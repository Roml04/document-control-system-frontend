import { useState } from "react";
import { useNavigate } from "react-router";
import { PopUpModal } from "~/components";
import DropDownItem from "~/components/ui/DropDownItem";

export default function Requests() {
  const testData: { title: string; reason: string }[] = [
    {
      title: "For Approval - Revision",
      reason: "Reason",
    },
  ];

  const [isVisible, setIsVisible] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const navigate = useNavigate();

  function handleCancel() {
    setTextAreaValue("");
    setIsVisible(false);
  }

  function handleSubmit() {}

  return (
    <>
      <div className="flex justify-center w-full h-full">
        <div className="flex flex-col w-3/4 px-4 py-4 gap-2 rounded-lg h-fit">
          <h1>Requests</h1>
          <ul className="flex flex-col gap-2">
            {testData.map((item, index) => (
              <DropDownItem
                key={index}
                title={item.title}
                description={item.reason}
                handleApprove={() => navigate("/documents/update")}
                handleDeny={() => setIsVisible(true)}
              />
            ))}
          </ul>
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
    </>
  );
}
