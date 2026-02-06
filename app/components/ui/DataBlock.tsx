import { useState } from "react";

type DataBlockProps = {
  title: string;
  value: string;
  styling?: string;
  isInteractable?: boolean;
};

export default function DataBlock({
  title,
  value,
  styling,
  isInteractable,
}: DataBlockProps) {
  const [inputValue, setInputValue] = useState(value);

  return (
    <div className={`flex w-full flex-col px-4 outline-none ${styling}`}>
      <h3>{title}</h3>
      {isInteractable ? (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      ) : (
        <p>{inputValue}</p>
      )}
    </div>
  );
}
