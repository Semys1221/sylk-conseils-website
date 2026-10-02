import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientName = searchParams.get("clientName") ?? "Client";
    const contractType = searchParams.get("type") ?? "convention";

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Contrat - ${clientName}</title></head>
<body style="font-family: serif; max-width: 800px; margin: 40px auto; padding: 20px;">
<h1 style="text-align: center;">Convention d'Entrée en Relation</h1>
<h2 style="text-align: center;">SYLK Conseils</h2>
<hr>
<p><strong>Client :</strong> ${clientName}</p>
<p><strong>Type de contrat :</strong> ${contractType}</p>
<p><strong>Date :</strong> ${new Date().toLocaleDateString("fr-FR")}</p>
<hr>
<h3>Objet</h3>
<p>Convention entre <strong>SYLK Conseils</strong> et <strong>${clientName}</strong> pour la realisation d'une mission de conseil en gestion de patrimoine.</p>
<h3>Prestations incluses</h3>
<ol>
<li>Audit patrimonial complet</li>
<li>Strategie patrimoniale personnalisee</li>
<li>Mise en place des souscriptions</li>
<li>Suivi semestriel et veille fiscale</li>
</ol>
<h3>Signature</h3>
<p>Fait en deux exemplaires, le ${new Date().toLocaleDateString("fr-FR")}</p>
<br>
<p>Client : _________________________________</p>
<p>SYLK Conseils : __________________________</p>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="convention-${clientName.replace(/\s+/g, "_").toLowerCase()}.html"`,
      },
    });
  } catch (error) {
    console.error("contract generate error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
