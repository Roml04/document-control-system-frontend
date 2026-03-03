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
    <NavLink
      to={uri}
      className={
        "rounded-lg h-fit hover:bg-slate-200 border border-slate-300 p-4"
      }
    >
      <div className="flex w-full justify-center flex-col p-4 gap-2">
        <Icon name={icon} size="lg" />
        <h3>{title}</h3>
      </div>
    </NavLink>
  );
}
