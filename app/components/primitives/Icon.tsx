import { Icons, type IconName } from "~/assets/icons/icons";

type IconProps = {
  name: IconName;
  size?: string; // values: lg - large, bs - base
};

export default function Icon({ name, size = "bs" }: IconProps) {
  const IconSrc = Icons[name];
  return <img src={IconSrc} className={`icons-${size}`}></img>;
}
