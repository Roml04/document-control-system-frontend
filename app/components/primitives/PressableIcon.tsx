import type { IconName } from "~/assets/icons/icons";
import Icon from "./Icon";
import type { ComponentPropsWithoutRef } from "react";

type PressableIconProps = {
  iconName: IconName;
  onClick: () => void;
} & ComponentPropsWithoutRef<"button">;

export default function PressableIcon({
  iconName,
  ...buttonProps
}: PressableIconProps) {
  return (
    <button
      className="flex justify-center items-center cursor-pointer icons-bs"
      {...buttonProps}
    >
      <Icon name={iconName} />
    </button>
  );
}
