import { FileCheckCorner, Files, LayoutDashboard, LogOut } from "lucide-react";
import { Outlet, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";
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
                      navigate("/dashboard");
                    }}
                  >
                    <LayoutDashboard />
                    Dashboard
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      navigate("/files");
                    }}
                  >
                    <Files />
                    Files
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      navigate("/requests");
                    }}
                  >
                    <FileCheckCorner />
                    Requests
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
                      {`${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>
                      {firstName || lastName
                        ? `${firstName ?? ""} ${lastName ?? ""}`.trim()
                        : "Unknown User"}
                    </p>
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
          <ScrollArea className="w-full m-4">
            <Outlet />
          </ScrollArea>
        </main>
      </SidebarProvider>
    </>
  );
}
