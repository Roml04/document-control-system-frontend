import NavBarItem from "../ui/NavBarItem";

export default function NavBar() {
  const navBaritems = ["Documents", "Forms", "Checklist", "Requests"];

  return (
    <ul className="flex h-fit justify-center rounded-xl px-2">
      {navBaritems.map((item, index) => (
        <NavBarItem item={item} key={index} />
      ))}
    </ul>
  );
}
