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
    <>
      <div className="w-full grid grid-cols-5 gap-2 auto-rows-[16rem]">
        {isRoleAllowed(["superior"], role) && (
          <NavLink
            to={"/documents/create"}
            className={"rounded-lg hover:bg-slate-200"}
          >
            <div className="flex w-full h-full justify-center items-center flex-col px-4 py-4">
              <Icon name="plus" size="lg" />
              <p className="text-center">Add a Document</p>
            </div>
          </NavLink>
        )}
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
    </>
  );
}
