type IconProps = {
  name: string;
};

export default function Icon({ name }: IconProps) {
  return <img src={`./app/assets/icons/${name}.svg`}></img>;
}
