import { useNavigate } from "react-router";
import PressableIcon from "~/components/primitives/PressableIcon";

export default function DocumentControl() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center h-full mt-8">
      <div className="flex flex-col w-3/4 px-4 py-4 gap-2 border rounded-lg h-fit">
        <div className="flex items-center gap-2">
          <PressableIcon iconName="arrowleft" onClick={() => navigate(-1)} />
          <h1>Document Control Procedure</h1>
        </div>
      </div>
    </div>
  );
}
