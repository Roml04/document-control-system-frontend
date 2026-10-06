import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type LoadingButtonPropType = {
  loadingDisplayText: string;
  displayText: string;
  isSpinning: boolean;
} & ComponentProps<typeof Button>;

export default function LoadingButton({
  loadingDisplayText,
  displayText,
  isSpinning,
  disabled,
  type = "submit",
  ...props
}: LoadingButtonPropType) {
  return (
    <Button type={type} disabled={isSpinning || disabled} {...props}>
      {isSpinning && <Spinner />}
      {isSpinning ? loadingDisplayText : displayText}
    </Button>
  );
}
