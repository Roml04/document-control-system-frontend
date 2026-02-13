import { useSessionStore } from "stores/sessionStore";
import NavBarItem from "../ui/NavBarItem";

type NavBarItemsType = {
  title: string;
  allowedRoles: string | string[];
}[];

export default function NavBar() {
  const navBaritems: NavBarItemsType = [
    { title: "Documents", allowedRoles: "all" },
    { title: "Forms", allowedRoles: "all" },
    { title: "Checklist", allowedRoles: "all" },
    {
      title: "Requests",
      allowedRoles: ["originator", "coordinator", "superior", "admin"],
    },
  ];

  const firstName = useSessionStore((state) => state.firstName);
  const role = useSessionStore((state) => state.role);

  const formattedRole = role[0].toUpperCase() + role.slice(1);

  return (
    <div className="flex w-full h-fit justify-between rounded-xl px-2">
      <div className="flex">
        {navBaritems.map((item, index) => (
          <NavBarItem item={item.title} key={index} />
        ))}
      </div>
      <div className="flex px-4 py-2">
        <h3 className="text-white">{firstName + " | " + formattedRole}</h3>
      </div>
    </div>
  );
}
