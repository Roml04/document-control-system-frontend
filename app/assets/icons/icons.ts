import ArrowLeft from "./arrow-left.svg";
import Document from "./document.svg";
import Person from "./person.svg";
import Trash from "./trash.svg";
import ArrowDropDown from "./arrow-drop-down.svg";
import ArrowDropUp from "./arrow-drop-up.svg";

export const Icons = {
  arrowleft: ArrowLeft,
  arrowdropdown: ArrowDropDown,
  arrowdropup: ArrowDropUp,
  document: Document,
  person: Person,
  trash: Trash,
};

export type IconName = keyof typeof Icons;
