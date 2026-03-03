import { NavLink } from "react-router";
import { CardItem, Icon } from "~/components";

export default function Forms() {
  return (
    <div className="flex flex-col gap-4 w-full mt-8 mx-16">
      <div className="flex justify-between">
        <div>
          <h1>Forms</h1>
          <p>Organize and control your forms with ease.</p>
        </div>
      </div>
      <div className="w-full grid grid-cols-3 gap-2 auto-rows-[16rem]"></div>
    </div>
  );
}
