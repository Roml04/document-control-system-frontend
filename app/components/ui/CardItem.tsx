import { NavLink } from "react-router";
import { Icon } from "../primitives";
import type { IconName } from "~/assets/icons/icons";

type CardItemProps = {
  title: string;
  uri: string;
  icon: IconName;
};

export default function CardItem({ title, uri, icon }: CardItemProps) {
  return (
    <NavLink to={uri} className={"border border-slate-400 rounded-lg"}>
      <div className="flex w-full h-full justify-center items-center flex-col px-4 py-4">
        <Icon name={icon} />
        <p className="w-full h-full text-center">{title}</p>
      </div>
    </NavLink>
  );
}
