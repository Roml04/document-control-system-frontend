import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/register", "./routes/register.tsx"),
  layout("./routes/main/layout.tsx", [
    route("/dashboard", "./routes/main/dashboard.tsx"),

    ...prefix("/requests", [
      index("./routes/main/requests.tsx"),
      route("/:id", "./routes/main/request/showRequest.tsx"),
      route("/:id/review", "./routes/main/request/reviewRequest.tsx"),
    ]),

    ...prefix("/files", [
      index("./routes/main/files.tsx"),
      route("/:id", "./routes/main/file/showFile.tsx"),
    ]),
    ...prefix("/versions", [index("./routes/main/version/editVersion.tsx")]),
  ]),
] satisfies RouteConfig;
