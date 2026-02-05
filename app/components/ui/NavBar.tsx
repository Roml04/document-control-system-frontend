import NavBarItem from "../ui/NavBarItem";

export default function NavBar() {
  const navBaritems = ["Documents", "Forms", "Checklist"];

  return (
    <ul className="w-1/2 flex justify-center gap-2">
      {navBaritems.map((item, index) => (
        <NavBarItem item={item} key={index} />
      ))}
    </ul>
  );
}
