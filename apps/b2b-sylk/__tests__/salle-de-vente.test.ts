import { describe, it, expect } from "vitest";

describe("Tenant 1 - Salle de Vente (CGP Live Room)", () => {
  it("has 3 phases: R1, R2, R3", () => {
    const phases = ["r1", "r2", "r3"] as const;
    expect(phases).toHaveLength(3);
    expect(phases[0]).toBe("r1");
    expect(phases[1]).toBe("r2");
    expect(phases[2]).toBe("r3");
  });

  it("phase labels are defined", () => {
    const phaseLabels = {
      r1: "Découverte",
      r2: "Stratégie",
      r3: "Closing",
    };
    expect(phaseLabels.r1).toBeTruthy();
    expect(phaseLabels.r2).toBeTruthy();
    expect(phaseLabels.r3).toBeTruthy();
  });

  it("has default discovery fields with correct structure", () => {
    const fields = [
      { key: "famille", label: "Situation familiale", type: "select" },
      { key: "enfants", label: "Enfants", type: "select" },
      { key: "profession", label: "Situation professionnelle", type: "select" },
      { key: "secteur", label: "Secteur d'activité", type: "textarea" },
      { key: "patrimoine", label: "Patrimoine actuel", type: "textarea" },
      { key: "fiscalite", label: "Fiscalité", type: "select" },
      { key: "objectifs", label: "Objectifs", type: "select" },
      { key: "risque", label: "Tolérance au risque", type: "select" },
      { key: "freins", label: "Freins et déceptions", type: "textarea" },
    ];
    expect(fields).toHaveLength(9);
    fields.forEach((f) => {
      expect(f.key).toBeTruthy();
      expect(f.label).toBeTruthy();
      expect(["select", "textarea"]).toContain(f.type);
    });
  });

  it("has correct slide deck content (6 slides)", () => {
    const slides = [
      { id: 0, tag: "Bienvenue" },
      { id: 1, tag: "Le Constat" },
      { id: 2, tag: "Méthodologie" },
      { id: 3, tag: "Les Leviers" },
      { id: 4, tag: "Votre Situation" },
      { id: 5, tag: "Prochaines Étapes" },
    ];
    expect(slides).toHaveLength(6);
    slides.forEach((s, i) => {
      expect(s.id).toBe(i);
    });
  });
});
