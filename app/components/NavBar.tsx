import NavBarItem from "./NavBarItem";

export default function NavBar() {
  const navBaritems = ["Documents", "Forms", "Checklist", "Requests"];

  return (
    <div className="flex w-full px-4 pt-2 border justify-center border-red-400">
      <ul>
        {navBaritems.map((item) => (
          // throw an error if item does not exist in routes
          <NavBarItem item={item} />
        ))}
      </ul>
    </div>
  );
}
