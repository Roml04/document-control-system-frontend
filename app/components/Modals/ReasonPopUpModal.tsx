import { useState } from "react";

type ReasonPopUpModalProps = {
  onClose: () => void;
};

export default function ReasonPopUpModal({ onClose }: ReasonPopUpModalProps) {
  function handleSubmit() {
    console.log("Reason:", textAreaValue);
    onClose();
  }

  const [textAreaValue, setTextAreaValue] = useState("");

  return (
    <>
      <div onClick={onClose} className="absolute inset-0 bg-black/10"></div>
      <div
        className={`absolute flex flex-col justify-center w-1/2 px-6 py-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg gap-2`}
      ></div>
    </>
  );
}
