import { NavLink } from "react-router";

type NavBarItemProps = {
  item: string;
};

export default function NavBarItem({ item }: NavBarItemProps) {
  const uri = item.toLowerCase();
  return (
    <NavLink
      to={`/${uri}`}
      className="w-full flex px-4 py-2 border justify-center border-slate-400 rounded-lg"
    >
      {item}
    </NavLink>
  );
}
