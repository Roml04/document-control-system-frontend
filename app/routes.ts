import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/requests", "./routes/Requests.tsx"),
  route("/documents", "./routes/Documents.tsx"),
  route("/forms", "./routes/Forms.tsx"),
  route("/checklist", "./routes/Checklist.tsx"),
] satisfies RouteConfig;
