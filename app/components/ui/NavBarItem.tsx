import { NavLink } from "react-router";

type NavBarItemProps = {
  item: string;
};

export default function NavBarItem({ item }: NavBarItemProps) {
  const uri = item.toLowerCase();

  return (
    <NavLink
      to={`/${uri}`}
      className={({ isActive }) =>
        `
        px-5 py-2 rounded-t-lg font-medium transition-all duration-200
        ${isActive ? "bg-white text-black" : "text-blue-200"}
        `
      }
    >
      {item}
    </NavLink>
  );
}
