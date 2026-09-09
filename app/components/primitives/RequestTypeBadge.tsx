import { ArrowUpFromLine, Pen, RotateCcw, X } from "lucide-react";
import { REQUESTTYPE } from "~/constants/enums";
import { Badge } from "../ui/badge";

type RequestTypeBadgePropType = {
  type: REQUESTTYPE;
};

export default function RequestTypeBadge({ type }: RequestTypeBadgePropType) {
  // const className =
  //   "flex justify-center items-center rounded-sm bg-gray-200 aspect-square h-14";

  switch (type) {
    case REQUESTTYPE.UPLOAD:
      return (
        <Badge>
          <ArrowUpFromLine color="#ffffff" />
          Upload
        </Badge>
      );

    case REQUESTTYPE.REVISION:
      return (
        <Badge>
          <Pen color="#ffffff" />
          Revision
        </Badge>
      );

    case REQUESTTYPE.RESUBMISSION:
      return (
        <Badge>
          <RotateCcw color="#ffffff" />
          Resubmission
        </Badge>
      );

    case REQUESTTYPE.DELETE:
      return (
        <Badge>
          <X color="#ffffff" />
          Delete
        </Badge>
      );

    default:
      throw new Error(`Invalid request type ${type}`);
  }
}
