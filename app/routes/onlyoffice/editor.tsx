import OnlyOfficeEditor from "~/components/organisms/OnlyOfficeEditor";
import type { Route } from "./+types/editor";
import { apiFetch } from "~/utils/apiFetch";

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode");

  console.log("INFO | MODE", mode);

  const apiResponse = await apiFetch(
    mode === "edit"
      ? `/onlyoffice/edit/${params.id}`
      : `/onlyoffice/view/${params.id}`,
  );

  console.log("INFO | PARAMS ID", params.id);
  console.log("INFO | RESPONSE", apiResponse);
  return apiResponse as {
    config: Record<string, unknown>;
  };
}

export default function editor({ loaderData }: Route.ComponentProps) {
  const { config } = loaderData;

  console.log("INFO | CONFIG", config);

  return (
    <div className="h-full w-full">
      <OnlyOfficeEditor config={config} />
    </div>
  );
}
