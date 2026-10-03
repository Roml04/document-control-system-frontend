import Header from "~/components/organisms/Header";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import type { UserType } from "~/constants/types";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { USERROLE } from "~/constants/enums";
import formatEnum from "~/utils/formatEnum";
import { ButtonGroup } from "../ui/button-group";
import { useState, type SubmitEventHandler } from "react";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { Dialog, DialogContent } from "../ui/dialog";
import { toast } from "sonner";
import { apiFetch } from "~/utils/apiFetch";

type UserEditForm = {
  user: UserType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UserEditForm({
  user,
  open,
  onOpenChange,
}: UserEditForm) {
  const [openResetPasswordForm, setOpenResetPasswordForm] = useState(false);

  const handleUserEdit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    onOpenChange(false);
  };

  return (
    <form onSubmit={handleUserEdit} className="flex flex-col gap-4">
      <div>
        <h1>USER ID: </h1>
      </div>
      <Separator />
      <FieldSet>
        <FieldGroup className="gap-4">
          <div className="grid grid-cols-2 gap-x-4">
            <Field>
              <FieldLabel>First Name</FieldLabel>
              <Input
                type="text"
                name="firstName"
                defaultValue={user.firstName}
                placeholder="Enter first name"
              />
            </Field>
            <Field>
              <FieldLabel>Last Name</FieldLabel>
              <Input
                type="text"
                name="lastName"
                defaultValue={user.lastName}
                placeholder="Enter first name"
              />
            </Field>
          </div>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="text"
              name="email"
              defaultValue={user.email}
              placeholder="Enter first name"
            />
          </Field>
          <Field>
            <FieldLabel>Role</FieldLabel>
            <Select
              name="role"
              defaultValue={user.role}
              disabled={user.role === USERROLE.SYSADMIN}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  {Object.values(USERROLE).map((role) => (
                    <SelectItem value={role}>{formatEnum(role)}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {user.role === USERROLE.SYSADMIN && (
              <FieldDescription>You cannot demote yourself.</FieldDescription>
            )}
          </Field>
          <Field>
            <div className="flex justify-between">
              <FieldLabel>Password</FieldLabel>
              <Button
                type="button"
                variant={"link"}
                onClick={() => setOpenResetPasswordForm(true)}
              >
                Reset Password
              </Button>
              <Dialog
                open={openResetPasswordForm}
                onOpenChange={setOpenResetPasswordForm}
              >
                <DialogContent>
                  <ResetPasswordForm
                    user={user}
                    open={openResetPasswordForm}
                    onOpenChange={setOpenResetPasswordForm}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Separator />
      <div className="flex justify-end">
        <Button type="submit">Save & Update</Button>
      </div>
    </form>
  );
}

type ResetPasswordFormPropType = {
  user: UserType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ResetPasswordForm({
  user,
  open,
  onOpenChange,
}: ResetPasswordFormPropType) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();

    if (!newPassword.trim()) {
      toast.error("Enter and confirm the password", {
        position: "top-center",
      });

      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Confirm the password", {
        position: "top-center",
      });

      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
      });

      return;
    }

    // const apiResponse = await apiFetch("/", {
    //   method: "PATCH",
    //   body: JSON.stringify({
    //     id: user.id,
    //     newPassword: newPassword,
    //     confirmPassword: confirmPassword,
    //   }),
    // });

    // if (!apiResponse.ok) {
    //   toast.error("Failed to reset password", {
    //     position: "top-center",
    //   });
    //   return;
    // }

    onOpenChange(false);
  };
  return (
    <form onSubmit={handleResetPassword}>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel>New Password</FieldLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Confirm Password</FieldLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </Field>
          <div className="flex justify-end">
            <Button>Reset Password</Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
