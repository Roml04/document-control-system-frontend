import { NavLink } from "react-router";

type NavBarItemProps = {
  item: string;
};

export default function NavBarItem({ item }: NavBarItemProps) {
  const uri = item.toLowerCase();
  console.log("URI:", uri);
  return (
    <NavLink to={`/${uri}`} className="w-1/4 px-4 border border-slate-400">
      {item}
    </NavLink>
  );
}
