import { Sheet, SheetContent, SheetFooter, SheetHeader } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import LoadingButton from "../primitives/LoadingButton";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { SubmitEventHandler } from "react";
import { useRevalidator } from "react-router";
import { USERROLE } from "~/constants/enums";
import formatEnum from "~/utils/formatEnum";
import { apiFetch } from "~/utils/apiFetch";
import { toast } from "sonner";

type CreateUserSheetPropType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateUserSheet({
  open,
  onOpenChange,
}: CreateUserSheetPropType) {
  const revalidator = useRevalidator();

  const handleCreateUser: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    console.log(Object.fromEntries(formData.entries()));

    const apiResponse = await apiFetch("/admin/user", {
      method: "POST",
      body: formData,
    });

    if (!apiResponse.ok) {
      toast.error("Failed to create user", {
        position: "top-center",
        description: apiResponse.message,
      });

      return;
    }

    console.log("API RESPONSE", apiResponse);

    onOpenChange(false);
    toast.success("user created succesfully", {
      position: "top-center",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-[30vw] sm:max-w-[30vw]! h-dvh p-0"
        onInteractOutside={(event) => event.preventDefault()}
        onAnimationEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.currentTarget.dataset.state === "closed"
          ) {
            revalidator.revalidate();
          }
        }}
      >
        <form
          onSubmit={handleCreateUser}
          className="flex h-full min-h-0 flex-col"
        >
          <SheetHeader>
            <h1>Create a user</h1>
            <p>Add a new user and assign their account details and role.</p>
          </SheetHeader>
          <ScrollArea className="flex-1 min-h-0 px-4 py-4">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel>First Name</FieldLabel>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="e.g., Juan"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="e.g., Dela cruz"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Select name="role" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role..." />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        {Object.values(USERROLE).map((role, index) => (
                          <SelectItem key={index} value={role}>
                            {formatEnum(role)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    name="email"
                    placeholder="e.g., juandelacruz@example.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    type="password"
                    name="password"
                    minLength={8}
                    placeholder="Enter a password..."
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </ScrollArea>
          <Separator />
          <SheetFooter>
            <LoadingButton
              displayText="Create User"
              loadingDisplayText="Creating user..."
              isSpinning={false}
            />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
