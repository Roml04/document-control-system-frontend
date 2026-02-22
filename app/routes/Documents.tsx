import { useLoaderData } from "react-router";
import { Icons, type IconName } from "~/assets/icons/icons";
import { CardItem } from "~/components";
import { apiFetch } from "~/utils/apiFetch";
import type { DOCUMENTTYPES } from "./Requests";
import type { Route } from "../+types/root";

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

  const documents: DocumentsType[] = await response.json();
  console.log("Documents.tsx | DOCUMENTS:", documents);

  return documents;
}

export default function Documents() {
  const documents = useLoaderData<DocumentsType[]>();
  console.log("Documents.tsx | PARAMS:", documents);

  const documentsIcon = {
    wastemanagement: "trash",
    hrprocedure: "person",
    documentcontrol: "document",
  };

  return (
    <div className="grid grid-cols-5 gap-2 auto-rows-[16rem]">
      {documents.map((document, index) => {
        return (
          <CardItem
            key={index}
            title={document.name}
            uri={`/documents/${document.id}`}
            icon={documentsIcon[document.type] as IconName}
          />
        );
      })}
    </div>
  );
}
