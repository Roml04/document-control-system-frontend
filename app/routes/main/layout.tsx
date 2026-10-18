import {
  FileCheckCorner,
  Files,
  FileStack,
  LogOut,
  UserRound,
} from "lucide-react";
import { Outlet, redirect, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { useSessionStore } from "../../../stores/sessionStore";
import { apiFetch } from "~/utils/apiFetch";
import { toast } from "sonner";
import { allowedRoles } from "~/utils/allowedRoles";
import { formatUserName } from "~/utils/formatUserName";
import avatarFallback from "~/utils/avatarFallback";
import { USERROLE } from "~/constants/enums";

export async function clientLoader() {
  const user = await apiFetch("/me");

  console.log("MAIN LAYOUT | CLIENT LOADER [MAIN]", user);

  if (!user.id) {
    throw redirect("/");
  }
  console.log("AUTHENTICATED");

  if (user.role === USERROLE.GUEST) {
    console.error("UNAUTHORIZED");
    throw redirect("/");
  }

  return { user };
}

export default function layout() {
  const navigate = useNavigate();

  const firstName = useSessionStore((state) => state.firstName);
  const lastName = useSessionStore((state) => state.lastName);
  const role = useSessionStore((state) => state.role);

  const handleLogOut = async () => {
    const apiResponse = await apiFetch("/logout");

    if (!apiResponse.ok) {
      toast.error("Logout failed", {
        position: "top-right",
      });

      return;
    }

    toast.success("Logout successful!", {
      position: "top-right",
    });

    navigate("/");
  };

  return (
    <>
      <SidebarProvider>
        <Sidebar collapsible="icon" variant="sidebar">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Document Control System</SidebarGroupLabel>
              <SidebarMenu>
                {allowedRoles(["sysadmin"]) && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => {
                        navigate("/admin/users");
                      }}
                    >
                      <UserRound />
                      Users
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {allowedRoles("*") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => {
                        navigate(
                          allowedRoles(["sysadmin"])
                            ? "/admin/files"
                            : "/files",
                        );
                      }}
                    >
                      <Files />
                      Files
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {allowedRoles("*") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => {
                        navigate(
                          allowedRoles(["sysadmin"])
                            ? "/admin/requests"
                            : "/requests",
                        );
                      }}
                    >
                      <FileCheckCorner />
                      Requests
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {allowedRoles(["sysadmin"]) && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => {
                        navigate("/admin/versions");
                      }}
                    >
                      <FileStack />
                      Versions
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size={"lg"}>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {avatarFallback(firstName, lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{formatUserName(firstName, lastName)}</p>
                    <h4>{role}</h4>
                  </div>
                </SidebarMenuButton>
                <SidebarMenuAction onClick={handleLogOut}>
                  <LogOut />
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex w-full h-full m-2">
          <SidebarTrigger />
          <div className="w-full m-4">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
