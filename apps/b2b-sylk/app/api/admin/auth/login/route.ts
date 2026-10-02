import { NextRequest, NextResponse } from "next/server";

const ALLOWED_EMAILS = ["sylkconseils@outlook.com", "responsable-neuf@sylkconseils.com"];

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!email || !ALLOWED_EMAILS.includes(email)) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  const adminPin = process.env.ADMIN_PIN;
  if (adminPin) {
    if (password !== adminPin) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
    }
  } else if (!password) {
    return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
  }

  return NextResponse.json({
    user: {
      email,
      name: email.split("@")[0] ?? email,
      createdAt: new Date().toISOString(),
    },
  });
}
