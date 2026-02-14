import { useSessionStore } from "stores/sessionStore";
import NavBarItem from "../ui/NavBarItem";
import { isRoleAllowed } from "~/utils/isRoleAllowed";

type NavBarItemsType = {
  title: string;
  allowedRoles: string[] | "all";
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

  const formattedRole = role ? role[0].toUpperCase() + role.slice(1) : "";

  return (
    <div className="flex w-full h-fit justify-between rounded-xl px-2">
      <div className="flex">
        {navBaritems.map((item, index) =>
          isRoleAllowed(item.allowedRoles, role) ? (
            <NavBarItem item={item.title} key={index} />
          ) : (
            ""
          ),
        )}
      </div>
      <div className="flex px-4 py-2">
        <h3 className="text-white">{firstName + " - " + formattedRole}</h3>
      </div>
    </div>
  );
}
