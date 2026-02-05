import { useState } from "react";

type PopUpModalProps = {
  onClose: () => void;
};

export default function PopUpModal({ onClose }: PopUpModalProps) {
  function handleSubmit() {
    console.log("Reason:", textAreaValue);
    onClose();
  }

  function handleCancel() {
    onClose();
  }

  const [textAreaValue, setTextAreaValue] = useState("");

  return (
    <>
      <div onClick={onClose} className="absolute inset-0 bg-black/10"></div>
      <div
        className={`absolute flex flex-col justify-center w-2/3 px-6 py-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg gap-2`}
      >
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
      </div>
    </>
  );
}
