import {
  createContext,
  use,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type DocuDetailContextType = {
  docuDetail: string;
  setDocuDetail: Dispatch<SetStateAction<string>>;
};

export const DocuDetailContext = createContext<DocuDetailContextType | null>(
  null,
);

export default function DocuDetailContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [docuDetail, setDocuDetail] = useState("Unknown");

  return (
    <DocuDetailContext value={{ docuDetail, setDocuDetail }}>
      {children}
    </DocuDetailContext>
  );
}

export function useDocuDetail() {
  const context = use(DocuDetailContext);

  if (!context)
    throw new Error(
      "useDocuDetail must be used within DocuDetailContextProvider",
    );

  return context;
}
