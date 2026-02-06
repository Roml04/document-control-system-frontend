import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("./routes/layout.tsx", [
    route("/documents", "./routes/Documents.tsx"),
    route("/forms", "./routes/Forms.tsx"),
    route("/checklist", "./routes/Checklist.tsx"),
    route("/requests", "./routes/Requests.tsx"),
    route("/documents/update", "./routes/documents/UpdateDocument.tsx"),
  ]),

  layout("./routes/documents/layout.tsx", [
    route(
      "/document/waste-management-procedure",
      "./routes/documents/WasteManagement.tsx",
    ),
    route("/document/hr-procedure", "./routes/documents/HRProcedure.tsx"),
    route(
      "/document/document-control-procedure",
      "./routes/documents/DocumentControl.tsx",
    ),
  ]),
] satisfies RouteConfig;
