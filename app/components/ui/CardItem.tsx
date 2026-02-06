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
    <NavLink to={uri} className={"rounded-lg hover:bg-slate-200"}>
      <div className="flex w-full h-full justify-center items-center flex-col px-4 py-4">
        <Icon name={icon} size="lg" />
        <p className="text-center">{title}</p>
      </div>
    </NavLink>
  );
}
