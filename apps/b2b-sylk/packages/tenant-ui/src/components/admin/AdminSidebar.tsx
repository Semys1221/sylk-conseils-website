"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTenant } from "../../tenant-config";
import { useAdminStore, type AdminView } from "../../stores/admin-store";
import { LayoutDashboard, Globe, TrendingUp, Calendar, Settings, LogOut } from "lucide-react";

interface AdminSidebarProps {
  user: { name: string; email: string };
  onSignOut: () => void;
}

const NAV: { id: AdminView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "accueil", label: "Accueil", icon: LayoutDashboard },
  { id: "website", label: "Website", icon: Globe },
  { id: "pipeline", label: "Pipeline", icon: TrendingUp },
  { id: "rendez-vous", label: "Rendez-vous", icon: Calendar },
  { id: "parametres", label: "Paramètres", icon: Settings },
];

export function AdminSidebar({ user, onSignOut }: AdminSidebarProps) {
  const tenant = useTenant();
  const { activeView, setActiveView } = useAdminStore();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => setActiveView("parametres")}
              className="cursor-pointer"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-foreground/70">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-2 px-2">
          <Avatar className="size-6 rounded">
            <AvatarFallback className="rounded text-[10px] font-bold">
              {tenant.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-sidebar-foreground/70">{tenant.name}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeView === item.id}
                    onClick={() => setActiveView(item.id)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onSignOut} className="text-destructive">
              <LogOut />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
