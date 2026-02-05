import { Icons } from "~/assets/icons/icons";
import CardItem from "~/components/ui/CardItem";

export default function Documents() {
  const documentsItems = [
    {
      title: "Waste Management Procedure",
      uri: "/document/waste-management-procedure",
      icon: Icons.Trash,
    },
    {
      title: "HR Procedure",
      uri: "/document/hr-procedure",
      icon: Icons.Person,
    },
    {
      title: "Document Control Procedure",
      uri: "/document/document-control-procedure",
      icon: Icons.Document,
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
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
