import Header from "~/components/organisms/Header";
import type { Route } from "./+types/editUser";
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return params.id;
}

export default function editUser({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <Header />
      <form className="flex flex-col gap-4">
        <div>
          <h1>USER ID: {loaderData}</h1>
        </div>
        <Separator />
        <FieldSet>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                />
              </Field>
              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Enter first name"
                />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="text"
                  name="email"
                  placeholder="Enter first name"
                />
              </Field>
              <Field>
                <FieldLabel>Role</FieldLabel>
                <Input type="text" name="role" placeholder="Enter first name" />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
