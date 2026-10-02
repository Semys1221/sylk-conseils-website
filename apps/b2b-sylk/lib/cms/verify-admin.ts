const ALLOWED_EMAILS = ["sylkconseils@outlook.com", "responsable-neuf@sylkconseils.com"];

export type AdminCredentials = {
  email?: string;
  password?: string;
};

export function verifyAdminCredentials({ email, password }: AdminCredentials): {
  ok: true;
  email: string;
} | {
  ok: false;
  status: number;
  error: string;
} {
  const normalized = email?.trim().toLowerCase() ?? "";
  if (!normalized || !ALLOWED_EMAILS.includes(normalized)) {
    return { ok: false, status: 403, error: "Accès non autorisé" };
  }

  const adminPin = process.env.ADMIN_PIN;
  if (adminPin) {
    if (password !== adminPin) {
      return { ok: false, status: 401, error: "Identifiants invalides" };
    }
  } else if (!password) {
    return { ok: false, status: 400, error: "Mot de passe requis" };
  }

  return { ok: true, email: normalized };
}
