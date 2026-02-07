import ArrowLeft from "./arrow-left.svg";
import ArrowDropDown from "./arrow-drop-down.svg";
import ArrowDropUp from "./arrow-drop-up.svg";
import Close from "./close.svg";
import Document from "./document.svg";
import Person from "./person.svg";
import Trash from "./trash.svg";

export const Icons = {
  arrowleft: ArrowLeft,
  arrowdropdown: ArrowDropDown,
  arrowdropup: ArrowDropUp,
  close: Close,
  document: Document,
  person: Person,
  trash: Trash,
};

export type IconName = keyof typeof Icons;
