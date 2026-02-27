enum ACTION {
  SETINTERACTABLEENABLED = "SETINTERACTABLEENABLED",
  SETINTERACTABLEDISABLED = "SETINTERACTABLEDISABLED",
  CANCELUPDATE = "CANCELUPDATE",
  UPDATEDETAIL = "UPDATEDETAIL",
}

type DataBlockProps = {
  title: string;
  value: string;
  isEditable?: boolean;
  styling?: string;
  onChange?: (value: string) => void;
};

export default function DataBlock({
  title,
  value,
  isEditable,
  styling,
  onChange,
}: DataBlockProps) {
  return (
    <div
      className={`w-full bg-white rounded-xl transition-all duration-200 ${styling}`}
    >
      <p className="text-sm text-gray-500 tracking-wide">{title}</p>
      {isEditable ? (
        <input
          type="text"
          value={!value ? "" : value}
          placeholder="None"
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.value);
            }
          }}
          className={`w-full
            font-medium
            bg-slate-50
            border border-gray-300
            rounded-lg
            px-3 py-2
            outline-none
            transition
            focus:bg-white
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
            text-lg`}
        />
      ) : (
        <p
          className={`w-full
            font-medium
            bg-slate-50
            border border-gray-300
            rounded-lg
            px-3 py-2
            outline-none
            transition
            focus:bg-white
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
            text-lg ${!value || !isEditable ? "text-gray-400" : "text-gray-800"}`}
        >
          {!value ? "None" : value}
        </p>
      )}
    </div>
  );
}
