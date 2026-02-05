import CardItem from "~/components/CardItem";

export default function Documents() {
  const documentsItems = [
    {
      title: "Waste Management Procedure",
      uri: "/document/waste-management-procedure",
      iconUrl: "app/assets/icons/trash.svg",
    },
    {
      title: "HR Procedure",
      uri: "/document/hr-procedure",
      iconUrl: "app/assets/icons/person.svg",
    },
    {
      title: "Document Control Procedure",
      uri: "/document/document-control-procedure",
      iconUrl: "app/assets/icons/document.svg",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
      {documentsItems.map((item, index) => (
        <CardItem
          key={index}
          title={item.title}
          uri={item.uri}
          iconUrl={item.iconUrl}
        />
      ))}
    </div>
  );
}
