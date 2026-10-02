"use client";

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { Book, Zap, Trees, Sunset } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Logo } from "@/components/dashboard/atomes/logo";

type NavLink =
  | { href: string; label: string }
  | {
      label: string;
      items: { href: string; label: string; description: string; icon: LucideIcon }[];
    };

const navLinks: NavLink[] = [
  { href: "/", label: "Accueil" },
  {
    label: "Expertises",
    items: [
      {
        href: "/expertises/patrimoine",
        label: "Stratégie patrimoniale",
        description: "Structuration et optimisation de votre patrimoine",
        icon: Book,
      },
      {
        href: "/expertises/fiscalite",
        label: "Optimisation fiscale",
        description: "Solutions fiscales adaptées à votre situation",
        icon: Zap,
      },
      {
        href: "/expertises/transmission",
        label: "Transmission",
        description: "Préparez et sécurisez la transmission de vos biens",
        icon: Trees,
      },
      {
        href: "/expertises/retraite",
        label: "Retraite",
        description: "Anticipez et construisez votre stratégie retraite",
        icon: Sunset,
      },
    ],
  },
  { href: "/le-cabinet", label: "Cabinet" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "bg-[#0a0a0f]/85 backdrop-blur-md" : "bg-[#0a0a0f]/60 backdrop-blur-sm"
      }`}
    >
      <div className="flex h-14 items-center justify-between mx-auto max-w-[1600px] px-4 md:px-6 py-2">
        <a href="/" className="group">
          <Logo />
        </a>

        <div className="flex items-center gap-8">
          <div className="max-md:hidden">
            <NavigationMenu>
              <NavigationMenuList>
                {navLinks.map((link) => {
                  const hasItems = "items" in link;
                  return (
                    <NavigationMenuItem
                      key={hasItems ? "expertises" : (link as { href: string }).href}
                    >
                      {hasItems ? (
                        <>
                          <NavigationMenuTrigger className="text-white/50 hover:text-white/80 px-3 py-1.5 text-sm font-normal">
                            {link.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="bg-[#0a0a0f] border border-white/[0.08]">
                            <ul className="w-80 p-3">
                              {(
                                link as {
                                  items: {
                                    href: string;
                                    label: string;
                                    description: string;
                                    icon: LucideIcon;
                                  }[];
                                }
                              ).items.map((item) => (
                                <li key={item.href}>
                                  <NavigationMenuLink asChild>
                                    <a
                                      href={item.href}
                                      className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/[0.08] hover:text-white"
                                    >
                                      <item.icon className="size-5 shrink-0 text-white/60" />
                                      <div>
                                        <div className="text-sm font-semibold text-white/90">
                                          {item.label}
                                        </div>
                                        {item.description && (
                                          <p className="text-sm leading-snug text-white/50">
                                            {item.description}
                                          </p>
                                        )}
                                      </div>
                                    </a>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink
                          href={(link as { href: string }).href}
                          className="inline-flex h-9 w-max items-center justify-center rounded-md px-3 py-1.5 text-sm font-normal text-white/50 transition-colors hover:text-white/80"
                        >
                          {link.label}
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <Popover>
            <PopoverTrigger className="group size-8 md:hidden inline-flex items-center justify-center rounded-md text-white/50 hover:text-white/80 transition-colors focus:outline-none">
              <svg
                className="pointer-events-none"
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12L20 12"
                  className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                />
                <path
                  d="M4 12H20"
                  className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                />
                <path
                  d="M4 12H20"
                  className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                />
              </svg>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-64 p-1 md:hidden bg-[#0a0a0f]/95 border-white/[0.08]"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) =>
                  "items" in link ? (
                    <div key="expertises" className="flex flex-col gap-1 pt-1 pb-1">
                      <span className="px-3 py-1.5 text-xs font-semibold text-white/40 tracking-wider uppercase">
                        {link.label}
                      </span>
                      {(
                        link as {
                          items: {
                            href: string;
                            label: string;
                            description: string;
                            icon: LucideIcon;
                          }[];
                        }
                      ).items.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white hover:bg-white/[0.08]"
                        >
                          <item.icon className="size-4 shrink-0 text-white/50" />
                          {item.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <a
                      key={(link as { href: string }).href}
                      href={(link as { href: string }).href}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white hover:bg-white/[0.08]"
                    >
                      {(link as { label: string }).label}
                    </a>
                  )
                )}
              </nav>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
