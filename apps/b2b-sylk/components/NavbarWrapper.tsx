"use client";

import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/navbar").then((m) => m.Navbar), {
  ssr: false,
});

export function NavbarWrapper() {
  return <Navbar />;
}
