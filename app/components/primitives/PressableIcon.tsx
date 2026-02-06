import type { IconName } from "~/assets/icons/icons";
import Icon from "./Icon";

type PressableIconProps = {
  iconName: IconName;
  onClick: () => void;
};

export default function PressableIcon({
  iconName,
  onClick,
}: PressableIconProps) {
  return (
    <button
      className="flex justify-center items-center cursor-pointer icons"
      onClick={onClick}
    >
      <Icon name={iconName} />
    </button>
  );
}
