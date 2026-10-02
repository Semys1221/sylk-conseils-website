interface FiscalSimulatorInlineProps {
  tmi?: number;
  revenus?: number;
  epargne?: number;
  sessionId?: string;
}

function calculateFiscalEconomy(tmi: number, revenus: number, epargne: number): number {
  const deductionMax = Math.min(revenus * 0.1, 35000);
  const epargneAnnuelle = epargne * 12;
  const deduction = Math.min(epargneAnnuelle, deductionMax);
  return deduction * (tmi / 100);
}

export function FiscalSimulatorInline({
  tmi = 30,
  revenus = 120000,
  epargne = 2000,
  sessionId,
}: FiscalSimulatorInlineProps) {
  const economy = calculateFiscalEconomy(tmi, revenus, epargne);
  const formattedEconomy = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(economy);

  const baseUrl = "https://sylkconseils.com/simulateur-fiscal";
  const simulatorUrl = sessionId
    ? `${baseUrl}?ref=${sessionId}&tmi=${tmi}&revenus=${revenus}&epargne=${epargne}`
    : baseUrl;

  return (
    <table
      role="presentation"
      style={{
        width: "100%",
        maxWidth: "480px",
        margin: "24px auto",
        background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <tr>
        <td style={{ textAlign: "center", paddingBottom: "16px" }}>
          <span
            style={{
              color: "#94a3b8",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Simulateur d'économie fiscale
          </span>
        </td>
      </tr>
      <tr>
        <td>
          <table role="presentation" style={{ width: "100%" }}>
            <tr>
              <td style={{ padding: "8px 0", color: "#64748b", fontSize: "13px" }}>
                Tranche marginale (TMI)
              </td>
              <td
                style={{ textAlign: "right", color: "#ffffff", fontSize: "15px", fontWeight: 600 }}
              >
                {tmi} %
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0", color: "#64748b", fontSize: "13px" }}>
                Revenus imposables
              </td>
              <td
                style={{ textAlign: "right", color: "#ffffff", fontSize: "15px", fontWeight: 600 }}
              >
                {revenus.toLocaleString("fr-FR")} €
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0", color: "#64748b", fontSize: "13px" }}>
                Épargne mensuelle
              </td>
              <td
                style={{ textAlign: "right", color: "#ffffff", fontSize: "15px", fontWeight: 600 }}
              >
                {epargne.toLocaleString("fr-FR")} €
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  padding: "12px 0",
                }}
              >
                <span style={{ color: "#e2e8f0", fontSize: "13px" }}>Économie d'impôt estimée</span>
                <span
                  style={{
                    float: "right",
                    color: "#22c55e",
                    fontSize: "20px",
                    fontWeight: 700,
                  }}
                >
                  {formattedEconomy} / an
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style={{ textAlign: "center", paddingTop: "16px" }}>
          <a
            href={simulatorUrl}
            style={{
              display: "inline-block",
              background: "#ffffff",
              color: "#111111",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 600,
              padding: "14px 32px",
              textDecoration: "none",
            }}
          >
            Calculer mon économie →
          </a>
        </td>
      </tr>
    </table>
  );
}
