import { useState } from "react";
import { NavLink, useLoaderData } from "react-router";
import { useSessionStore } from "stores/sessionStore";
import { type IconName } from "~/assets/icons/icons";
import { CardItem, Icon, PopUpModal } from "~/components";
import type { DOCUMENTTYPES } from "~/constants/document.enum";
import { apiFetch } from "~/utils/apiFetch";
import { isRoleAllowed } from "~/utils/isRoleAllowed";

type DocumentsType = {
  id: number;
  name: string;
  type: DOCUMENTTYPES;
  file_path: string;
};

export async function clientLoader() {
  const response = await apiFetch("/document", {
    method: "GET",
  });

  const documents = await response.json();
  console.log("Documents.tsx | DOCUMENTS:", documents);

  return documents;
}

export default function Documents() {
  const documents = useLoaderData<DocumentsType[]>();
  const role = useSessionStore((state) => state.role);

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
        {documents.map((document, index) => (
          <CardItem
            key={index}
            title={document.name}
            uri={`/documents/${document.id}`}
            icon="document"
            // icon={documentsIcon[document.type] as IconName}
          />
        ))}
      </div>
    </div>
  );
}
