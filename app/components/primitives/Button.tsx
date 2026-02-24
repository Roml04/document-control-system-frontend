export enum BUTTONTYPES {
  DANGER = "px-6 py-2 rounded-lg cursor-pointer text-red-400 hover:text-red-600",
  CONFIRM = "px-6 py-2 rounded-lg cursor-pointer text-black hover:text-white hover:bg-black",
  CANCEL = "px-6 py-2 rounded-lg cursor-pointer text-gray-400 hover:text-black",
  DISABLED = "px-6 py-2 rounded-lg cursor-pointer text-gray-300",
}

type ButtonTypes = {
  type: BUTTONTYPES;
  text: string;
  handleOnClick: () => void;
  styling?: string;
  isEnabled?: boolean;
};

export default function Button({
  type,
  text,
  handleOnClick,
  styling = "",
  isEnabled = true,
}: ButtonTypes) {
  const btnClasses = type + " " + styling;

  return (
    <button
      className={btnClasses}
      onClick={() => {
        if (isEnabled) {
          handleOnClick();
        }
      }}
    >
      {text}
    </button>
  );
}
