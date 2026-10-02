"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";

interface SignatureItem {
  slug: string;
  label: string;
  html: string;
}

interface Props {
  items: SignatureItem[];
}

const DEFAULT_NAME = "Stéphane LAWNICKI";
const DEFAULT_PHONE = "06.16.84.95.61";
const DEFAULT_EMAIL = "direction@sylkconseils.com";
const DEFAULT_ROLE = "Associé Gérant";
const DEFAULT_ROLE_ENTITIES = "Associ&eacute; G&eacute;rant";

function replaceFields(
  html: string,
  name: string,
  phone: string,
  email: string,
  role: string,
  logoWidth: number
) {
  const r = role || DEFAULT_ROLE;
  return html
    .replaceAll(DEFAULT_NAME, name || DEFAULT_NAME)
    .replaceAll(DEFAULT_PHONE, phone || DEFAULT_PHONE)
    .replaceAll(DEFAULT_EMAIL, email || DEFAULT_EMAIL)
    .replaceAll("+33616849561", phone?.replace(/\s/g, "") || "+33616849561")
    .replaceAll(DEFAULT_ROLE, r)
    .replaceAll(DEFAULT_ROLE_ENTITIES, r)
    .replace(/width="\d+"/g, `width="${logoWidth}"`);
}

type Mode = "vertical" | "horizontal";

export function SignaturesClient({ items }: Props) {
  const [mode, setMode] = useState<Mode>("vertical");
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState(DEFAULT_NAME);
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [logoWidth, setLogoWidth] = useState(200);

  const active = items.find((i) => i.slug.includes(mode)) ?? items[0];

  const handleCopy = useCallback(async () => {
    const updated = replaceFields(active.html, name, phone, email, role, logoWidth);
    try {
      const blob = new Blob([updated], { type: "text/html" });
      await navigator.clipboard.write([new ClipboardItem({ "text/html": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [active.html, name, phone, email, role, logoWidth]);

  return (
    <div className="h-screen w-full overflow-hidden relative">
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, #64748b 0%, #1e293b 50%, #0f172a 100%)",
        }}
      />

      <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
        <div className="relative z-30 w-[95vw] md:w-[75vw] max-w-4xl h-[85vh] md:h-[80vh] max-h-[800px]">
          <div className="w-full h-full rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-[15px] border border-slate-200 dark:border-white/15 shadow-2xl flex flex-col overflow-hidden">
            {/* Top bar */}
            <div className="shrink-0 px-4 md:px-6 pt-4 pb-3 border-b border-slate-200/50 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-white/40">
                    Nom
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-32 px-2 py-1 text-xs rounded-md bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-white/30"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-white/40">
                    Tél
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-28 px-2 py-1 text-xs rounded-md bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-white/30"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-white/40">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-40 px-2 py-1 text-xs rounded-md bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-white/30"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-white/40">
                    Poste
                  </label>
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-32 px-2 py-1 text-xs rounded-md bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-white/30"
                  />
                </div>
                <div className="flex items-center gap-1.5 ml-2">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-white/40">
                    Logo
                  </label>
                  <input
                    type="range"
                    min="80"
                    max="400"
                    value={logoWidth}
                    onChange={(e) => setLogoWidth(Number(e.target.value))}
                    className="w-20 h-1 accent-slate-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 dark:text-white/40 w-7 text-right">
                    {logoWidth}px
                  </span>
                </div>
                <div className="flex items-center ml-auto">
                  <button
                    onClick={() => setMode(mode === "vertical" ? "horizontal" : "vertical")}
                    className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
                  >
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${mode === "vertical" ? "bg-blue-500" : "bg-slate-300 dark:bg-white/20"}`}
                    />
                    Verticale
                    <span className="text-slate-300 dark:text-white/20">|</span>
                    Horizontale
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${mode === "horizontal" ? "bg-blue-500" : "bg-slate-300 dark:bg-white/20"}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Signature preview */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex items-start justify-center">
              <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-stone-900 shadow-lg border border-stone-200 dark:border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200/30 dark:border-white/5">
                  <span className="text-xs font-medium text-slate-600 dark:text-white/70">
                    {active.label}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-green-500" /> Copié
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copier
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 overflow-x-auto flex justify-center flex-col items-center">
                  <div className="text-sm text-slate-600 dark:text-white/70 mb-4 w-full max-w-[480px]">
                    Bien cordialement,
                  </div>
                  <div
                    className="min-w-[300px]"
                    dangerouslySetInnerHTML={{
                      __html: replaceFields(active.html, name, phone, email, role, logoWidth),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
