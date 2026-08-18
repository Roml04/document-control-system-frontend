import { useState, type SubmitEventHandler } from "react";
import { NavLink, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Field, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { apiFetch } from "~/utils/apiFetch";
import { toast } from "sonner";
import { Spinner } from "~/components/ui/spinner";
import { useSessionStore } from "../../stores/sessionStore";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);

  /**
   * Session Store
   */
  const updateSession = useSessionStore((state) => state.updateSession);

  const handleLogin: SubmitEventHandler<HTMLFormElement> = async (event) => {
    try {
      event.preventDefault();

      setIsSpinning(true);

      const apiResponse = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!apiResponse.ok) {
        return toast.error("Login failed", {
          description: apiResponse.message,
          position: "top-right",
        });
      }

      const { userId, firstName, lastName, role, token } = apiResponse.data;

      console.log(apiResponse.data);

      updateSession({
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        role: role,
        token: token,
      });

      toast.success("Login successful!", {
        position: "top-right",
      });

      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed", {
        position: "top-right",
        description:
          "We could not complete your log in request right now. Please try again in a moment.",
      });
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full h-full flex justify-center items-center"
    >
      <Card className="w-md">
        <CardHeader>
          <CardTitle>Login to your DCS Account</CardTitle>
          <CardDescription>Sign in to your DCS account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email..."
                onChange={(e) => {
                  setEmail(e.target.value);
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
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </Field>

            <Button type="submit" disabled={isSpinning}>
              {isSpinning && <Spinner />}
              {isSpinning ? "Logging in..." : "Login"}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-center">
            <p>
              Don't have an account yet?{" "}
              <span className="hover:underline">
                <NavLink to={"/register"}>Register</NavLink>
              </span>
            </p>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
