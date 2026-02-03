import NavBarItem from "./NavBarItem";

export default function NavBar() {
  const navBaritems = ["Documents", "Forms", "Checklist"];

  return (
    <ul className="w-1/2 flex justify-center gap-2">
      {navBaritems.map((item) => (
        // throw an error if item does not exist in routes
        <NavBarItem item={item} />
      ))}
    </ul>
  );
}
