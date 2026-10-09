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
    ...prefix("/requests", [
      index("./routes/main/requests.tsx", {
        id: "index-request-main",
      }),
      route("/:id", "./routes/main/request/showRequest.tsx", {
        id: "show-request-main",
      }),
      route("/:id/review", "./routes/main/request/reviewRequest.tsx", {
        id: "review-request-main",
      }),
      route("/:id/resubmit", "./routes/main/request/resubmitRequest.tsx", {
        id: "resubmit-request-main",
      }),
    ]),

    ...prefix("/files", [
      index("./routes/main/files.tsx", {
        id: "index-files-main",
      }),
      route("/:id", "./routes/main/file/showFile.tsx", {
        id: "show-file-main",
      }),
    ]),

    ...prefix("/versions", [
      route("/:id", "./routes/main/version/showVersion.tsx", {
        id: "show-version-main",
      }),
      route("/:id/edit", "./routes/main/version/editVersion.tsx", {
        id: "edit-version-main",
      }),
    ]),
  ]),

  layout("./routes/admin/layout.tsx", [
    ...prefix("/admin", [
      ...prefix("/users", [
        index("./routes/admin/users.tsx"),
        route("/:id", "./routes/admin/user/showUser.tsx"),
      ]),

      ...prefix("/files", [
        index("./routes/main/files.tsx", {
          id: "index-files-admin",
        }),
        route("/:id", "./routes/main/file/showFile.tsx", {
          id: "show-file-admin",
        }),
        route("/:id/edit", "./routes/admin/file/editFile.tsx"),
      ]),

      ...prefix("/requests", [
        index("./routes/main/requests.tsx", {
          id: "index-request-admin",
        }),
        route("/:id", "./routes/main/request/showRequest.tsx", {
          id: "show-request-admin",
        }),
        route("/:id/review", "./routes/main/request/reviewRequest.tsx", {
          id: "review-request-admin",
        }),
        route("/:id/resubmit", "./routes/main/request/resubmitRequest.tsx", {
          id: "resubmit-request-admin",
        }),
        route("/:id/edit", "./routes/admin/request/editRequest.tsx"),
      ]),

      ...prefix("/versions", [
        index("./routes/admin/versions.tsx"),
        route("/:id", "./routes/main/version/showVersion.tsx", {
          id: "show-version-admin",
        }),
        route("/:id/edit", "./routes/main/version/editVersion.tsx", {
          id: "edit-version-admin",
        }),
      ]),
    ]),
  ]),
  route("/onlyoffice/:id", "./routes/onlyoffice/editor.tsx"),
] satisfies RouteConfig;
