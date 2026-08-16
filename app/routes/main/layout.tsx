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

export default function layout() {
  const navigate = useNavigate();

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
                    <AvatarImage src="https://i.pinimg.com/474x/54/74/af/5474afb4b69e42c299fef40ebb733fe9.jpg" />
                    <AvatarFallback>DCS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>Suisei Hoshimachi</p>
                    <h4>Originator</h4>
                  </div>
                </SidebarMenuButton>
                <SidebarMenuAction>
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
