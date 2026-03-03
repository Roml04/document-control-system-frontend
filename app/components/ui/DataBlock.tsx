import { useSessionStore } from "stores/sessionStore";
import { isRoleAllowed } from "~/utils/isRoleAllowed";

enum ACTION {
  SETINTERACTABLEENABLED = "SETINTERACTABLEENABLED",
  SETINTERACTABLEDISABLED = "SETINTERACTABLEDISABLED",
  CANCELUPDATE = "CANCELUPDATE",
  UPDATEDETAIL = "UPDATEDETAIL",
}

type DataBlockProps = {
  title: string;
  value: string;
  placeholder?: string;
  isEditable?: boolean;
  allowedRoles?: string[] | "all";
  styling?: string;
  onChange?: (value: string) => void;
};

export default function DataBlock({
  title,
  value,
  isEditable,
  allowedRoles = "all",
  placeholder,
  styling,
  onChange,
}: DataBlockProps) {
  const role = useSessionStore((state) => state.role);

  return (
    <div
      className={`w-full bg-white rounded-xl transition-all duration-200 ${styling}`}
    >
      <p className="text-sm text-gray-500 tracking-wide">{title}</p>
      {isEditable ? (
        <input
          type="text"
          value={!value ? "" : value}
          placeholder={placeholder}
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
            text-lg ${!isRoleAllowed(allowedRoles, role) ? "text-gray-400" : "text-gray-800"}`}
          title={
            !isRoleAllowed(allowedRoles, role)
              ? "You do not have permission to edit this"
              : ""
          }
        >
          {!value ? "None" : value}
        </p>
      )}
    </div>
  );
}
