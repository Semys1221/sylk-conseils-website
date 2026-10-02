"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Calendar, ArrowUpRight } from "lucide-react";
import { useTenant } from "../tenant-config";

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.475-.9 1.637-1.85 3.37-1.85 3.605 0 4.268 2.372 4.268 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Footer() {
  const { name, tagline, logo, contact, calendlyUrl, legal, linkedinUrl, domain } = useTenant();

  const legalItems = legal
    ? [
        legal.orias,
        legal.carteTpi,
        legal.rcp,
        legal.capital,
        legal.rcs,
      ].filter(Boolean)
    : [];

  return (
    <footer className="border-t border-deep-200/20 bg-white/80 backdrop-blur-sm overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="flex w-full flex-col justify-between gap-12 lg:flex-row lg:items-start">
          {/* Brand Column */}
          <div className="flex w-full min-w-0 max-w-sm flex-col gap-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src={logo}
                alt={`${name} Logo`}
                width={230}
                height={230}
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-base font-semibold text-deep-800 leading-tight">{name}</p>
                <p className="text-[10px] text-deep-500 font-medium tracking-wider uppercase">
                  {tagline}
                </p>
              </div>
            </Link>
            <p className="text-sm text-deep-700/60 leading-relaxed">
              Cabinet indépendant en gestion de patrimoine — optimisation fiscale, retraite &amp;
              transmission.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-deep-50 flex items-center justify-center text-deep-500 hover:bg-deep-100 hover:text-deep-700 transition-all duration-300"
              >
                <LinkedinIcon />
              </a>
              <a
                href={`mailto:${contact.email}`}
                aria-label="Email"
                className="w-9 h-9 rounded-full bg-deep-50 flex items-center justify-center text-deep-500 hover:bg-deep-100 hover:text-deep-700 transition-all duration-300"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="grid w-full gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
            {/* Navigation Links */}
            <div>
              <h3 className="text-[11px] font-semibold tracking-widest uppercase text-deep-400 mb-5">
                Navigation
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Accueil", href: "/" },
                  { name: "Diagnostic", href: "/funnel" },
                  { name: "Expertises", href: "/expertises" },
                  { name: "Blog", href: "/blog" },
                  { name: "Le Cabinet", href: "/le-cabinet" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-deep-700/60 hover:text-deep-800 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expertises */}
            <div>
              <h3 className="text-[11px] font-semibold tracking-widest uppercase text-deep-400 mb-5">
                Expertises
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Fiscalité", href: "/expertises/fiscalite" },
                  { name: "Patrimoine", href: "/expertises/patrimoine" },
                  { name: "Consultation", href: "/consultation" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-deep-700/60 hover:text-deep-800 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-[11px] font-semibold tracking-widest uppercase text-deep-400 mb-5">
                Contact
              </h3>
              <ul className="space-y-3">
                {legal?.phone && (
                  <li>
                    <a
                      href={`tel:${legal.phone}`}
                      className="inline-flex items-center gap-2 text-sm text-deep-700/60 hover:text-deep-800 transition-colors"
                    >
                      <Phone size={13} className="shrink-0 text-deep-400" />
                      {legal.phone}
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2 text-sm text-deep-700/60 hover:text-deep-800 transition-colors"
                  >
                    <Mail size={13} className="shrink-0 text-deep-400" />
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-deep-600 hover:text-deep-800 transition-colors"
                  >
                    <Calendar size={13} className="shrink-0 text-deep-400" />
                    Réserver un appel
                    <ArrowUpRight size={11} className="text-deep-400" />
                  </a>
                </li>
                <li>
                  <a
                    href={`https://${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-deep-700/60 hover:text-deep-800 transition-colors"
                  >
                    <span className="w-[13px]" />
                    {domain}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="mt-14 pt-6 border-t border-deep-200/20">
          {legalItems.length > 0 && (
            <div className="space-y-2 text-[11px] text-deep-400 leading-relaxed mb-4">
              {legalItems.map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-deep-400">
              &copy; {new Date().getFullYear()} {name}. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-deep-400">
              <Link href="/mentions-legales" className="hover:text-deep-700 transition-colors">
                Mentions Légales
              </Link>
              <span className="w-px h-3 bg-deep-200" />
              <Link href="/cgu" className="hover:text-deep-700 transition-colors">
                CGU
              </Link>
              <span className="w-px h-3 bg-deep-200" />
              <span>Siège social : Lyon</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
