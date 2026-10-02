"use client";

import { Home, Filter, Globe, Calendar, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  { label: "Accueil", href: "/analytics", icon: Home },
  { label: "Pipeline", href: "/analytics/pipeline", icon: Filter },
  { label: "Website", href: "/analytics/website", icon: Globe },
  { label: "Rendez-vous", href: "/analytics/rendez-vous", icon: Calendar },
  { label: "Settings", href: "/analytics/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarGroupLabel className="text-sm font-semibold tracking-tight">
          Analytics
        </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    render={<Link href={item.href} />}
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
      <SidebarFooter className="border-t border-sidebar-border pt-2">
        <p className="px-2 text-xs text-sidebar-foreground/50">SYLK Conseils</p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
