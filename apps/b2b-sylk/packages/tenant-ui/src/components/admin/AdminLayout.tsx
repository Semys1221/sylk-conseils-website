"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { clearAdminSession, getAdminSession } from "../../lib/admin-session";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const session = getAdminSession();
    if (session?.email) {
      setAuthenticated(true);
      setUser({ name: session.name || session.email, email: session.email });
    } else {
      setAuthenticated(false);
      router.replace("/login");
    }
  }, [router]);

  const handleSignOut = async () => {
    clearAdminSession();
    router.push("/login");
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated || !user) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar user={user} onSignOut={handleSignOut} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
