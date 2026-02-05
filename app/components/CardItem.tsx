import { NavLink } from "react-router";

type CardItemProps = {
  title: string;
  uri: string;
  iconUrl: string;
};

export default function CardItem({ title, uri, iconUrl }: CardItemProps) {
  console.log("iconUrl:", iconUrl);

  return (
    <NavLink to={uri} className={"border border-slate-400 rounded-lg"}>
      <div className="flex w-full h-full justify-center items-center flex-col px-4 py-4">
        <img src={iconUrl} alt="" className="icons" />
        <p className="w-full h-full text-center">{title}</p>
      </div>
    </NavLink>
  );
}
