import OnlyOfficeEditor from "~/components/organisms/OnlyOfficeEditor";
import type { Route } from "./+types/editor";
import { apiFetch } from "~/utils/apiFetch";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const apiResponse = await apiFetch(`/onlyoffice/edit/${params.id}`);

  return apiResponse as {
    config: Record<string, unknown>;
  };
}

export default function editor({ loaderData }: Route.ComponentProps) {
  const { config } = loaderData;

  return (
    <div className="h-full w-full">
      <OnlyOfficeEditor config={config} />
    </div>
  );
}
