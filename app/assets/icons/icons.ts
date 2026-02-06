import ArrowLeft from "./arrow-left.svg";
import Document from "./document.svg";
import Person from "./person.svg";
import Trash from "./trash.svg";

export const Icons = {
  arrowleft: ArrowLeft,
  document: Document,
  person: Person,
  trash: Trash,
};

export type IconName = keyof typeof Icons;
