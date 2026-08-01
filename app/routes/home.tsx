import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Field } from "~/components/ui/field";

export default function Home() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Field></Field>
        </CardContent>
      </Card>
    </div>
  );
}
