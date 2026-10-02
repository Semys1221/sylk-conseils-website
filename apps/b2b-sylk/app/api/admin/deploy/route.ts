import { NextRequest, NextResponse } from "next/server";
import {
  getDeploymentStatus,
  triggerProductionDeploy,
} from "@/lib/cms/vercel-deploy";
import { verifyAdminCredentials } from "@/lib/cms/verify-admin";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const auth = verifyAdminCredentials({
      email: body.email,
      password: body.password,
    });
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const result = await triggerProductionDeploy();
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      jobId: result.jobId,
      deploymentId: result.deploymentId,
      phase: result.phase,
      url: result.url,
      pollingAvailable: Boolean(process.env.VERCEL_TOKEN?.trim() && result.deploymentId),
    });
  } catch (error) {
    console.error("admin/deploy POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const email = request.headers.get("x-admin-email") ?? undefined;
  const password = request.headers.get("x-admin-pin") ?? undefined;
  const auth = verifyAdminCredentials({ email, password });
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const deploymentId = request.nextUrl.searchParams.get("deploymentId");
  if (!deploymentId) {
    return NextResponse.json({ error: "deploymentId requis" }, { status: 400 });
  }

  const status = await getDeploymentStatus(deploymentId);
  if (!status) {
    return NextResponse.json(
      {
        error:
          "Statut indisponible — ajoutez VERCEL_TOKEN (optionnel) pour le suivi du déploiement.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ deploymentId, ...status });
}
