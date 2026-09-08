import type { ButtonHTMLAttributes } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type LoadingButtonPropType = {
  loadingDisplayText: string;
  displayText: string;
  isSpinning: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function LoadingButton({
  loadingDisplayText,
  displayText,
  isSpinning,
}: LoadingButtonPropType) {
  return (
    <Button type="submit" disabled={isSpinning}>
      {isSpinning && <Spinner />}
      {isSpinning ? loadingDisplayText : displayText}
    </Button>
  );
}
