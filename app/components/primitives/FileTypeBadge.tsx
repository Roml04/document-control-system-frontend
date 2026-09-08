import { FileText, Form, ListTodo } from "lucide-react";
import { FILETYPE } from "~/constants/enums";

type FileTypeBadgePropType = {
  type: FILETYPE;
  size?: number;
};

export default function FileTypeBadge({ type, size }: FileTypeBadgePropType) {
  const className = `flex justify-center items-center rounded-sm bg-gray-200 aspect-square h-14`;
  switch (type) {
    case FILETYPE.DOCUMENT:
      return (
        <div className={className}>
          <FileText size={size} />
        </div>
      );
    case FILETYPE.CHECKLIST:
      return (
        <div className={className}>
          <ListTodo size={size} />
        </div>
      );

    case FILETYPE.FORM:
      return (
        <div className={className}>
          <Form size={size} />
        </div>
      );

    default:
      return <div>Unknown Type</div>;
  }
}
