import { useReducer, type SubmitEventHandler } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { apiFetch } from "~/utils/apiFetch";
import { toast } from "sonner";
import { useNavigate } from "react-router";

enum ACTION {
  SETSTATE = "SETSTATE",
  RESETSTATE = "RESETSTATE",
}

type RegisterStateType = {
  firstName: string;
  lastName: string;
  department: string;
  email: string;
  password: string;
};

type RegisterActionType = {
  type: ACTION;
  payload: Partial<RegisterStateType>;
};

export default function register() {
  const navigate = useNavigate();

  const registerInitialState = {
    firstName: "",
    lastName: "",
    department: "",
    email: "",
    password: "",
  };

  function registerReducer(
    state: RegisterStateType,
    action: RegisterActionType,
  ) {
    switch (action.type) {
      case ACTION.SETSTATE:
        return {
          ...state,
          ...action.payload,
        };

      case ACTION.RESETSTATE:
        return {
          ...registerInitialState,
        };

      default:
        return state;
    }
  }

  const [registerState, registerDispatch] = useReducer(
    registerReducer,
    registerInitialState,
  );

  const handleRegister: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const apiResponse = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        firstName: registerState.firstName,
        lastName: registerState.lastName,
        department: registerState.department,
        email: registerState.email,
        password: registerState.password,
      }),
    });

    if (!apiResponse.ok) {
      return toast.error("Registration Failed!", {
        description: apiResponse.message,
        position: "top-right",
      });
    }

    toast.success("Account registered!", {
      description:
        "An administrator will review and assign your role. You can sign in once approved.",
      position: "top-right",
    });

    navigate("/");
  };

  return (
    <form
      onSubmit={handleRegister}
      className="w-full h-full flex justify-center items-center"
    >
      <Card className="w-md">
        <CardHeader>
          <CardTitle>Register an Account</CardTitle>
          <CardDescription>
            Register to access the document control system
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="flex flex-col gap-6">
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    value={registerState.firstName}
                    onChange={(e) => {
                      registerDispatch({
                        type: ACTION.SETSTATE,
                        payload: { firstName: e.target.value },
                      });
                    }}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={registerState.lastName}
                    onChange={(e) => {
                      registerDispatch({
                        type: ACTION.SETSTATE,
                        payload: { lastName: e.target.value },
                      });
                    }}
                    required
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="department">Department</FieldLabel>
                <Input
                  id="department"
                  type="text"
                  placeholder="Enter your department..."
                  value={registerState.department}
                  onChange={(e) => {
                    registerDispatch({
                      type: ACTION.SETSTATE,
                      payload: { department: e.target.value },
                    });
                  }}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email..."
                  value={registerState.email}
                  onChange={(e) => {
                    registerDispatch({
                      type: ACTION.SETSTATE,
                      payload: { email: e.target.value },
                    });
                  }}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password..."
                  value={registerState.password}
                  onChange={(e) => {
                    registerDispatch({
                      type: ACTION.SETSTATE,
                      payload: { password: e.target.value },
                    });
                  }}
                  required
                />
              </Field>
            </FieldGroup>
            <Button type="submit">Register</Button>
            {/* <Button onClick={handleRegister}>Register</Button> */}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
