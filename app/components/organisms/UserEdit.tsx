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
import { useRef, useState, type SubmitEventHandler } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
import { apiFetch } from "~/utils/apiFetch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { formatUserName } from "~/utils/formatUserName";
import { useRevalidator } from "react-router";

type UserEditDialogForm = {
  user: UserType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UserEditDialogForm({
  user,
  open,
  onOpenChange,
}: UserEditDialogForm) {
  const [openResetPasswordDialogForm, setOpenResetPasswordDialogForm] =
    useState(false);
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
  const editUserForm = useRef<HTMLFormElement>(null);
  const revalidator = useRevalidator();

  const handleUserEdit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    try {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      console.log("FORM DATA", Object.fromEntries(formData.entries()));

      const apiResponse = await apiFetch(`/admin/user/${user.id}`, {
        method: "PATCH",
        body: formData,
      });

      console.log("API RESPONSE", apiResponse);

      if (!apiResponse.ok) {
        toast.error("Failed to edit user", {
          position: "top-center",
          description: apiResponse.message,
        });
        return;
      }

      onOpenChange(false);
      toast.error("User successfully edited", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to edit user", {
        position: "top-center",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  return (
    <Dialog open={openEditUserDialog} onOpenChange={setOpenEditUserDialog}>
      <DialogContent
        className="sm:max-w-2xl"
        onAnimationEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.currentTarget.dataset.state === "closed"
          ) {
            revalidator.revalidate();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <h1>{`${user.firstName} ${user.lastName}`}</h1>
            <p className="text-muted-foreground">ID #{user.id}</p>
          </div>
          <Separator />
          <form ref={editUserForm} onSubmit={handleUserEdit}>
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
                  {user.role === USERROLE.SYSADMIN && (
                    <FieldDescription>
                      You cannot demote yourself.
                    </FieldDescription>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
          <div>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <div className="flex justify-between">
                    <FieldLabel>Password</FieldLabel>
                    <Button
                      type="button"
                      variant={"link"}
                      onClick={() => setOpenResetPasswordDialogForm(true)}
                    >
                      Reset Password
                    </Button>
                    <ResetPasswordDialogForm
                      user={user}
                      open={openResetPasswordDialogForm}
                      onOpenChange={setOpenResetPasswordDialogForm}
                    />
                  </div>
                </Field>
              </FieldGroup>
            </FieldSet>
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button type="button" onClick={() => setOpenEditUserDialog(true)}>
              Save & Update
            </Button>
            <AlertDialog
              open={openEditUserDialog}
              onOpenChange={setOpenEditUserDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Save changes to this user?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Review your changes before proceeding. The updated user
                    information will be saved and take effect immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => editUserForm.current?.requestSubmit()}
                  >
                    Save
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type ResetPasswordDialogFormPropType = {
  user: UserType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ResetPasswordDialogForm({
  user,
  open,
  onOpenChange,
}: ResetPasswordDialogFormPropType) {
  const handleResetPassword: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (formData.get("password") !== formData.get("password_confirmation")) {
      toast.error("Password do not match", {
        position: "top-center",
      });
      return;
    }

    console.log(
      "FORM DATA | RESET PASS",
      Object.fromEntries(formData.entries()),
    );

    const apiResponse = await apiFetch(`/admin/user/${user.id}/resetpassword`, {
      method: "PATCH",
      body: formData,
    });

    console.log("RESPONSE", apiResponse);

    if (!apiResponse.ok) {
      toast.error("Failed to reset password", {
        position: "top-center",
        description: apiResponse.message,
      });
      return;
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Set a new password for{" "}
            <span className="font-semibold">{`${formatUserName(user.firstName, user.lastName)}`}</span>
            . The new password will replace their current password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleResetPassword}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>New Password</FieldLabel>
                <Input type="password" name="password" minLength={8} required />
              </Field>
              <Field>
                <FieldLabel>Confirm Password</FieldLabel>
                <Input
                  type="password"
                  name="password_confirmation"
                  minLength={8}
                  required
                />
              </Field>
              <div className="flex justify-end">
                <Button>Reset Password</Button>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
}
