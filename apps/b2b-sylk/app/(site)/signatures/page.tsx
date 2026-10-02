import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { SignaturesClient } from "./client";

const KEEP = ["signature_A_verticale", "signature_B_horizontale"];

const LABELS: Record<string, string> = {
  signature_A_verticale: "A — Verticale classique",
  signature_B_horizontale: "B — Horizontale (2 colonnes)",
};

export default function SignaturesPage() {
  const dir = join(process.cwd(), "public", "signatures");

  const items = KEEP.map((slug) => {
    const html = readFileSync(join(dir, `${slug}.html`), "utf-8");
    return { slug, label: LABELS[slug] ?? slug, html };
  });

  return <SignaturesClient items={items} />;
}
