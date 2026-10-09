import { Outlet, redirect, useNavigate } from "react-router";
import { USERROLE } from "~/constants/enums";
import { apiFetch } from "~/utils/apiFetch";
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
import {
  FileCheckCorner,
  Files,
  FileStack,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
import avatarFallback from "~/utils/avatarFallback";
import { useSessionStore } from "../../../stores/sessionStore";
import { toast } from "sonner";
import { formatUserName } from "~/utils/formatUserName";

export async function clientLoader() {
  const user = await apiFetch("/me");

  if (!user) {
    throw redirect("/");
  }

  if (user.role !== USERROLE.SYSADMIN) {
    throw redirect("/dashboard");
  }

  return { user };
}

export default function layout() {
  const navigate = useNavigate();

  const token = useSessionStore((state) => state.token);

  const firstName = useSessionStore((state) => state.firstName);
  const lastName = useSessionStore((state) => state.lastName);
  const role = useSessionStore((state) => state.role);

  const handleLogOut = async () => {
    const apiResponse = await apiFetch("/logout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      return toast.error("Logout failed", {
        position: "top-right",
      });
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
          {/* <SidebarHeader></SidebarHeader> */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Document Control System</SidebarGroupLabel>
              {/* <SidebarGroupContent>GroupContent</SidebarGroupContent> */}
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      navigate("/admin");
                    }}
                  >
                    <LayoutDashboard />
                    Dashboard
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      navigate("/admin/files");
                    }}
                  >
                    <Files />
                    Files
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      navigate("/admin/requests");
                    }}
                  >
                    <FileCheckCorner />
                    Requests
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
