import { Icons, type IconName } from "~/assets/icons/icons";

type IconProps = {
  name: IconName;
};

export default function Icon({ name }: IconProps) {
  const IconSrc = Icons[name];
  return <img src={IconSrc}></img>;
}
