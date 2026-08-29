import { FileText, Form, ListTodo } from "lucide-react";
import { FILETYPE } from "~/constants/enums";
import enumFormatter from "~/utils/enumFormatter";

type TypeBadgePropType = {
  type: FILETYPE;
  size: number;
};

export default function TypeBadge({ type, size }: TypeBadgePropType) {
  const className =
    "flex justify-center items-center rounded-sm bg-gray-200 aspect-square h-14";
  // const className = "flex items-center gap-2";
  switch (type) {
    case FILETYPE.DOCUMENT:
      return (
        <div className={className}>
          <FileText size={size} />
          {/* <p>{enumFormatter(type)}</p> */}
        </div>
      );
    case FILETYPE.CHECKLIST:
      return (
        <div className={className}>
          <ListTodo size={size} />
          {/* <p>{enumFormatter(type)}</p> */}
        </div>
      );

    case FILETYPE.FORM:
      return (
        <div className={className}>
          <Form size={size} />
          {/* <p>{enumFormatter(type)}</p> */}
        </div>
      );

    default:
      return <div>Unknown Type</div>;
  }
}
