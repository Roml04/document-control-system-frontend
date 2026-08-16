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
    route("/files", "./routes/main/files.tsx"),
    route("/requests", "./routes/main/requests.tsx"),
    ...prefix("/files", [
      route("/create", "./routes/main/file/createFile.tsx"),
      route("/:id", "./routes/main/file/showFile.tsx"),
      route("/:id/edit", "./routes/main/file/editFile.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
