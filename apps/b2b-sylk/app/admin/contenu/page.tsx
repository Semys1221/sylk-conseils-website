"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminSession } from "@workspace/tenant-ui";
import { LoginForm } from "@/components/dashboard/atomes/login-form";
import { CmsEditor } from "@/components/admin/cms-editor";
import { Loader2 } from "lucide-react";

export default function AdminContenuPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const session = getAdminSession();
    setAuthenticated(Boolean(session?.email));
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="dark min-h-dvh bg-slate-950 flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="dark min-h-dvh bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <p className="text-center text-sm text-slate-400">
            Connectez-vous pour modifier le contenu public du site.
          </p>
          <LoginForm />
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="w-full text-center text-xs text-slate-500 hover:text-slate-300 bg-transparent border-none cursor-pointer"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return <CmsEditor />;
}
