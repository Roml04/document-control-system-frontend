import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import LoadingButton from "~/components/primitives/LoadingButton";
import { Button } from "~/components/ui/button";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router";

type StrictHeaderPropType = {
  resetOnCLick: () => void;
  buttonLoadingText: string;
  buttonText: string;
  buttonIsSpinning: boolean;
};

export default function StrictHeader({
  resetOnCLick,
  buttonText,
  buttonLoadingText,
  buttonIsSpinning,
}: StrictHeaderPropType) {
  const navigate = useNavigate();
  return (
    <header className="flex justify-between">
      <AlertDialog>
        <AlertDialogTrigger type="button" asChild>
          <Button type="button" variant={"ghost"}>
            <ChevronLeft />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave this page?</AlertDialogTitle>
            <AlertDialogDescription>
              Your unsaved changes will be lost if you leave this page. Are you
              sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay on page</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate(-1)}>
              Leave page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex gap-1">
        <AlertDialog>
          <AlertDialogTrigger type="button" asChild>
            <Button type="button" variant={"ghost"}>
              <RotateCcw />
              Reset
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset your progress?</AlertDialogTitle>
              <AlertDialogDescription>
                Your current progress will be lost. Are you sure you want to
                start over?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep editing</AlertDialogCancel>
              <AlertDialogAction onClick={resetOnCLick}>
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <LoadingButton
          type="submit"
          displayText={buttonText}
          loadingDisplayText={buttonLoadingText}
          isSpinning={buttonIsSpinning}
        />
      </div>
    </header>
  );
}
