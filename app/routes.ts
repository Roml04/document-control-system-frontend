import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/register", "routes/register.tsx"),
  layout("./routes/layout.tsx", [
    route("/documents", "./routes/Documents.tsx"),
    route("/forms", "./routes/Forms.tsx"),
    route("/checklist", "./routes/Checklist.tsx"),
    route("/requests", "./routes/Requests.tsx"),
  ]),

  layout("./routes/documents/layout.tsx", [
    route("/documents/:documentId", "./routes/documents/DocumentPage.tsx"),
    // route("/document/hr-procedure", "./routes/documents/HRProcedure.tsx"),
    // route(
    //   "/document/document-control-procedure",
    //   "./routes/documents/DocumentControl.tsx",
    // ),
  ]),

  // apply layout to these routes
  ...prefix("/error", [
    route("/401", "./routes/error/401.tsx"),
    route("/500", "./routes/error/RequestFailed.tsx"),
  ]),
] satisfies RouteConfig;
