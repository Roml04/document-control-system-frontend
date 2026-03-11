import { NavLink } from "react-router";
import { useSessionStore } from "stores/sessionStore";
import { CardItem, Icon } from "~/components";
import { isRoleAllowed } from "~/utils/isRoleAllowed";
import type { Route } from "./+types/Documents";
import { apiFetch } from "~/utils/apiFetch";
import type { DocumentType } from "~/constants/types";

export async function clientLoader() {
  const { role: userRole } = useSessionStore.getState();

  const apiResponse = await apiFetch("/document", {
    method: "GET",
  });

  if (!apiResponse.ok) {
    return alert(apiResponse.message);
  }

  return apiResponse.data;
}

export default function Documents({ loaderData }: Route.ComponentProps) {
  // const documents = useLoaderData<DocumentsType[]>();
  const role = useSessionStore((state) => state.role);

  const documents: Partial<DocumentType>[] = loaderData;

  return (
    <div className="flex flex-col gap-4 w-full mt-8 mx-16">
      <div className="flex justify-between">
        <div>
          <h1>Documents</h1>
          <p>Manage and organize your procedures and policies.</p>
        </div>
        <div className="flex items-center">
          {isRoleAllowed(["superior"], role) && (
            <NavLink
              to={"/documents/create"}
              className={"rounded-lg h-fit hover:bg-slate-200 py-2"}
            >
              <div className="flex w-full h-fit justify-center items-center px-8 rounded-lg gap-2">
                <Icon name="plus" size="bs" />
                <p className="text-center">Add a Document</p>
              </div>
            </NavLink>
          )}
        </div>
      </div>
      <div className="w-full grid grid-cols-3 gap-2 auto-rows-[16rem]">
        {documents.map((document) => (
          <CardItem key={document.id} title="Title" uri="" icon="document" />
        ))}
      </div>
    </div>
  );
}
