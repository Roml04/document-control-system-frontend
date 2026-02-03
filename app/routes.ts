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
  ]),
  route("/requests", "./routes/Requests.tsx"),
] satisfies RouteConfig;
