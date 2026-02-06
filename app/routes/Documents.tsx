import type { IconName } from "~/assets/icons/icons";
import CardItem from "~/components/ui/CardItem";

export default function Documents() {
  const documentsItems: { title: string; uri: string; icon: IconName }[] = [
    {
      title: "Waste Management Procedure",
      uri: "/document/waste-management-procedure",
      icon: "trash",
    },
    {
      title: "HR Procedure",
      uri: "/document/hr-procedure",
      icon: "person",
    },
    {
      title: "Document Control Procedure",
      uri: "/document/document-control-procedure",
      icon: "document",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 auto-rows-[16rem]">
      {documentsItems.map((item, index) => (
        <CardItem
          key={index}
          title={item.title}
          uri={item.uri}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
