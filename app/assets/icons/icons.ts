export const Icons = {
  ArrowLeft: "/icons/arrow-left.svg",
  Document: "/icons/document.svg",
  Person: "/icons/person.svg",
  Trash: "/icons/trash.svg",
} as const;

export type IconKey = keyof typeof Icons;
