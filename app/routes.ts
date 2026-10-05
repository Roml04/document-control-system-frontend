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
      route("/:id/resubmit", "./routes/main/request/resubmitRequest.tsx"),
    ]),

    ...prefix("/files", [
      index("./routes/main/files.tsx"),
      route("/:id", "./routes/main/file/showFile.tsx"),
    ]),

    ...prefix("/versions", [
      route("/:id/edit", "./routes/main/version/editVersion.tsx"),
    ]),
  ]),

  layout("./routes/admin/layout.tsx", [
    ...prefix("/admin", [
      index("./routes/admin/dashboard.tsx"),

      ...prefix("/users", [
        index("./routes/admin/users.tsx"),
        route("/:id", "./routes/admin/user/showUser.tsx"),
      ]),

      ...prefix("/files", [
        index("./routes/admin/files.tsx"),
        route("/:id", "./routes/admin/file/showFile.tsx"),
        route("/:id/edit", "./routes/admin/file/editFile.tsx"),
      ]),

      ...prefix("/requests", [
        index("./routes/admin/requests.tsx"),
        route("/:id", "./routes/admin/request/showRequest.tsx"),
        route("/:id/edit", "./routes/admin/request/editRequest.tsx"),
      ]),
      ...prefix("/versions", [
        index("./routes/admin/versions.tsx"),
        route("/:id", "./routes/admin/version/viewVersion.tsx"),
        route("/:id/edit", "./routes/admin/version/editVersion.tsx"),
      ]),
    ]),
  ]),
  route("/onlyoffice/:id", "./routes/onlyoffice/editor.tsx"),
] satisfies RouteConfig;
