import { readFileSync } from "node:fs";
import { join } from "node:path";

export type DeployPhase = "queued" | "building" | "ready" | "error" | "unknown";

type VercelTargetConfig = {
  projectId: string;
  teamId: string;
  projectName: string;
};

function readLinkedProjectJson(): Partial<VercelTargetConfig> | null {
  try {
    const raw = readFileSync(join(process.cwd(), ".vercel", "project.json"), "utf8");
    const parsed = JSON.parse(raw) as {
      projectId?: string;
      orgId?: string;
      projectName?: string;
    };
    return {
      projectId: parsed.projectId,
      teamId: parsed.orgId,
      projectName: parsed.projectName,
    };
  } catch {
    return null;
  }
}

function getVercelTargetConfig():
  | { ok: true; config: VercelTargetConfig }
  | { ok: false; error: string } {
  const linked = readLinkedProjectJson();
  const projectId =
    process.env.VERCEL_PROJECT_ID?.trim() || linked?.projectId?.trim() || "";
  const teamId =
    process.env.VERCEL_TEAM_ID?.trim() ||
    process.env.VERCEL_ORG_ID?.trim() ||
    linked?.teamId?.trim() ||
    "";
  const projectName =
    process.env.VERCEL_PROJECT_NAME?.trim() ||
    linked?.projectName?.trim() ||
    "sylk_conseils_website";

  if (!projectId || !teamId) {
    return {
      ok: false,
      error:
        "Configuration Vercel incomplète : définissez VERCEL_PROJECT_ID et VERCEL_TEAM_ID (ou VERCEL_ORG_ID) sur le projet.",
    };
  }

  return { ok: true, config: { projectId, teamId, projectName } };
}

export function mapVercelState(state: string | undefined): DeployPhase {
  switch (state) {
    case "QUEUED":
    case "INITIALIZING":
      return "queued";
    case "BUILDING":
    case "UPLOADING":
      return "building";
    case "READY":
      return "ready";
    case "ERROR":
    case "CANCELED":
      return "error";
    default:
      return "unknown";
  }
}

export async function triggerProductionDeploy(): Promise<
  | {
      ok: true;
      jobId?: string;
      deploymentId?: string;
      phase: DeployPhase;
      url?: string;
    }
  | {
      ok: false;
      status: number;
      error: string;
    }
> {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL?.trim();
  if (hookUrl) {
    const hookRes = await fetch(hookUrl, { method: "POST" });
    if (!hookRes.ok) {
      const text = await hookRes.text().catch(() => "");
      return {
        ok: false,
        status: 502,
        error: `Le Deploy Hook a échoué (${hookRes.status})${text ? `: ${text.slice(0, 200)}` : ""}`,
      };
    }

    let jobId: string | undefined;
    try {
      const payload = (await hookRes.json()) as { job?: { id?: string; state?: string } };
      jobId = payload.job?.id;
    } catch {
      /* hook may return empty body */
    }

    const token = process.env.VERCEL_TOKEN?.trim();
    if (token) {
      await new Promise((r) => setTimeout(r, 1500));
      const latest = await fetchLatestDeployment(token);
      if (latest) {
        return {
          ok: true,
          jobId,
          deploymentId: latest.id,
          phase: mapVercelState(latest.readyState ?? latest.state),
          url: latest.url ? `https://${latest.url}` : undefined,
        };
      }
    }

    return { ok: true, jobId, phase: "queued" };
  }

  const token = process.env.VERCEL_TOKEN?.trim();
  if (token) {
    return triggerRedeployViaApi(token);
  }

  return {
    ok: false,
    status: 503,
    error:
      "Déploiement indisponible : connectez le dépôt Git et ajoutez VERCEL_DEPLOY_HOOK_URL, ou définissez VERCEL_TOKEN (server-only) pour redéployer le dernier build.",
  };
}

/** Re-runs the last ready deployment (same source tree). Does not upload local files; use Git or `vercel deploy` for new code. */
async function triggerRedeployViaApi(
  token: string,
): Promise<
  | {
      ok: true;
      deploymentId?: string;
      phase: DeployPhase;
      url?: string;
    }
  | { ok: false; status: number; error: string }
> {
  const target = getVercelTargetConfig();
  if (!target.ok) {
    return { ok: false, status: 503, error: target.error };
  }
  const { projectId, teamId, projectName } = target.config;

  const sourceId = await fetchRedeploySourceDeploymentId(token, projectId, teamId);
  if (!sourceId) {
    return {
      ok: false,
      status: 502,
      error:
        "Aucun déploiement prêt à redéployer. Lancez d'abord un déploiement depuis la CLI ou connectez Git.",
    };
  }

  const res = await fetch(
    `https://api.vercel.com/v13/deployments?forceNew=1&teamId=${teamId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deploymentId: sourceId,
        target: "production",
        name: projectName,
        project: projectId,
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      status: 502,
      error: `Redéploiement Vercel échoué (${res.status})${text ? `: ${text.slice(0, 240)}` : ""}`,
    };
  }

  const data = (await res.json()) as {
    id?: string;
    url?: string;
    readyState?: string;
    state?: string;
  };

  return {
    ok: true,
    deploymentId: data.id,
    phase: mapVercelState(data.readyState ?? data.state),
    url: data.url ? `https://${data.url}` : undefined,
  };
}

export async function getDeploymentStatus(deploymentId: string): Promise<{
  phase: DeployPhase;
  url?: string;
  error?: string;
} | null> {
  const token = process.env.VERCEL_TOKEN?.trim();
  if (!token) return null;

  const target = getVercelTargetConfig();
  const teamQuery =
    target.ok && target.config.teamId
      ? `?teamId=${encodeURIComponent(target.config.teamId)}`
      : "";

  const res = await fetch(
    `https://api.vercel.com/v13/deployments/${deploymentId}${teamQuery}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );
  if (!res.ok) return null;

  const data = (await res.json()) as {
    readyState?: string;
    state?: string;
    url?: string;
    errorMessage?: string;
  };

  return {
    phase: mapVercelState(data.readyState ?? data.state),
    url: data.url ? `https://${data.url}` : undefined,
    error: data.errorMessage,
  };
}

async function fetchLatestDeployment(token: string): Promise<{
  id: string;
  readyState?: string;
  state?: string;
  url?: string;
} | null> {
  const target = getVercelTargetConfig();
  if (!target.ok) return null;
  const { projectId, teamId } = target.config;

  const res = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1&teamId=${teamId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    deployments?: Array<{ uid?: string; id?: string; readyState?: string; state?: string; url?: string }>;
  };
  const dep = data.deployments?.[0];
  if (!dep) return null;
  return {
    id: dep.uid ?? dep.id ?? "",
    readyState: dep.readyState,
    state: dep.state,
    url: dep.url,
  };
}

async function fetchRedeploySourceDeploymentId(
  token: string,
  projectId: string,
  teamId: string,
): Promise<string | null> {
  const res = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=10&teamId=${teamId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    deployments?: Array<{ uid?: string; id?: string; readyState?: string; state?: string }>;
  };
  const ready = data.deployments?.find((d) => d.readyState === "READY" || d.state === "READY");
  const dep = ready ?? data.deployments?.[0];
  if (!dep) return null;
  return dep.uid ?? dep.id ?? null;
}
