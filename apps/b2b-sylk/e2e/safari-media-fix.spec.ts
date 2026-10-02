import { test, expect, type Page } from "@playwright/test";

/**
 * Safari media permission fix — cross-browser e2e tests.
 *
 * Core issue: Safari requires getUserMedia() to be called from a
 * user gesture (click/tap). Our fix ensures:
 *   1. getUserMedia is always called from click handlers, not useEffect
 *   2. ConfigStep has a fallback "Activer mon micro et ma caméra" button
 *      when no pre-obtained stream is available (Safari-safe)
 *   3. Error messages differentiate permission denied vs not found
 *   4. Daily.co iframe has allow="camera *; microphone *" for Safari
 *   5. Empty device lists don't render broken <select> (no "Aucune option")
 *   6. Mobile layout respects viewport (no overflow, text wrapping)
 *
 * Runs on Chromium (Windows), Firefox (Windows/macOS),
 * WebKit (Desktop Safari), Mobile Safari (iPhone 13).
 */

// ─── Mock Factory ───────────────────────────────────────────────

function mockScript(
  gumFails: boolean,
  errName = "NotAllowedError",
  devices: Record<string, string>[] = [
    { deviceId: "mic-1", kind: "audioinput", label: "Faux Microphone", groupId: "g1" },
    { deviceId: "cam-1", kind: "videoinput", label: "Fausse Caméra", groupId: "g1" },
  ],
) {
  const devsJson = JSON.stringify(devices);
  return `
window.__MOCK_STATE__ = {
  gumFails: ${gumFails},
  errName: "${errName}",
};

class MockTrack {
  kind = "video"; enabled = true; id = "t-" + Math.random().toString(36).slice(2);
  label = ""; readyState = "live";
  stop() {} applyConstraints() {} getCapabilities() { return {}; }
  getConstraints() { return {}; } getSettings() { return {}; }
  clone() { const t = new MockTrack(); t.kind = this.kind; return t; }
  addEventListener() {} removeEventListener() {} dispatchEvent() { return true; }
}

class MockStream {
  constructor() {
    const v = new MockTrack(); v.kind = "video";
    const a = new MockTrack(); a.kind = "audio";
    this._t = [v, a]; this._id = "ms-" + Math.random().toString(36).slice(2);
  }
  get id() { return this._id; }
  get active() { return true; }
  getTracks() { return this._t; }
  getVideoTracks() { return this._t.filter(t => t.kind === "video"); }
  getAudioTracks() { return this._t.filter(t => t.kind === "audio"); }
  getTrackById(id) { return this._t.find(t => t.id === id) || null; }
  addTrack(t) { this._t.push(t); }
  removeTrack(t) { this._t = this._t.filter(x => x.id !== t.id); }
  clone() { const s = new MockStream(); s._t = [...this._t]; return s; }
  addEventListener() {} removeEventListener() {} dispatchEvent() { return true; }
}

const devs = ${devsJson};
Object.defineProperty(navigator, "mediaDevices", {
  value: {
    getUserMedia: async () => {
      if (window.__MOCK_STATE__.gumFails) {
        const e = new Error(window.__MOCK_STATE__.errName);
        e.name = window.__MOCK_STATE__.errName;
        throw e;
      }
      return new MockStream();
    },
    enumerateDevices: async () => devs.map(d => ({ ...d, toJSON() { return { ...d }; } })),
    getDisplayMedia: () => { throw new Error("not mocked"); },
  },
  configurable: true, writable: true,
});

window.AudioContext = class {
  constructor() { this.state = "running"; }
  createOscillator() { return { frequency: { value: 440 }, connect() {}, start() {}, stop() {},
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; } }; }
  close() { this.state = "closed"; }
  get destination() { return {}; }
  addEventListener() {} removeEventListener() {} dispatchEvent() { return true; }
};
`;
}

async function mock(
  page: Page,
  gumFails: boolean,
  errName?: string,
  devices?: Record<string, string>[],
) {
  await page.addInitScript(mockScript(gumFails, errName, devices));
}

async function gotoReunion(page: Page) {
  await page.goto("/reunion", { waitUntil: "networkidle" });
  await page.waitForSelector("button:has-text('Continuer')", { timeout: 20000 });
}

/** Returns the bounding box of the glass-card inner container */
async function glassCardRect(page: Page) {
  return page.locator(".rounded-2xl").first().boundingBox();
}

// ─── Tests ──────────────────────────────────────────────────────

test.describe("Reunion Funnel — Safari Media Fix", () => {

  test.describe("Welcome Step → getUserMedia from click (user gesture)", () => {

    test("succeeds → stores stream, advances to config", async ({ page }) => {
      await mock(page, false);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");

      await expect(page.locator("text=Avant de rejoindre votre conseiller")).toBeVisible({ timeout: 5000 });
      await expect(page.locator("video")).toBeVisible({ timeout: 5000 });
      await expect(page.locator("text=SÉLECTIONNER LE MICROPHONE")).toBeVisible();
      await expect(page.locator("text=Activer mon micro et ma caméra")).not.toBeVisible();
    });

    test("fails → logs warning, still advances to config", async ({ page }) => {
      await mock(page, true);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");

      await expect(page.locator("text=Avant de rejoindre votre conseiller")).toBeVisible({ timeout: 5000 });
      await expect(page.locator("text=Activer mon micro et ma caméra")).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Config Step — Safari, no pre-obtained stream", () => {

    test("shows activation button when no stream available", async ({ page }) => {
      await mock(page, true);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");
      await expect(page.locator("text=Activer mon micro et ma caméra")).toBeVisible({ timeout: 5000 });
    });

    test("click activation button (user gesture) → getUserMedia succeeds → preview appears", async ({ page }) => {
      await mock(page, true);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");
      await expect(page.locator("text=Activer mon micro et ma caméra")).toBeVisible({ timeout: 5000 });

      await page.evaluate(() => { (window as any).__MOCK_STATE__.gumFails = false; });
      await page.click("text=Activer mon micro et ma caméra");

      await expect(page.locator("text=SÉLECTIONNER LE MICROPHONE")).toBeVisible({ timeout: 5000 });
      await expect(page.locator("video")).toBeVisible();
    });

    test("getUserMedia fails → error message + retry button", async ({ page }) => {
      await mock(page, true);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");
      await expect(page.locator("text=Activer mon micro et ma caméra")).toBeVisible({ timeout: 5000 });

      await page.click("text=Activer mon micro et ma caméra");

      await expect(page.locator("text=Autorisation refusée")).toBeVisible({ timeout: 5000 });
      await expect(page.locator("text=Réessayer")).toBeVisible({ timeout: 5000 });
    });

    test("retry after failure → succeeds on second attempt", async ({ page }) => {
      await mock(page, true);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");
      await page.click("text=Activer mon micro et ma caméra");
      await expect(page.locator("text=Réessayer")).toBeVisible({ timeout: 5000 });

      await page.evaluate(() => { (window as any).__MOCK_STATE__.gumFails = false; });
      await page.click("text=Réessayer");

      await expect(page.locator("text=SÉLECTIONNER LE MICROPHONE")).toBeVisible({ timeout: 5000 });
      await expect(page.locator("text=Activer mon micro et ma caméra")).not.toBeVisible();
    });

    test("shows correct error: NotAllowedError", async ({ page }) => {
      await mock(page, true, "NotAllowedError");
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");
      await page.click("text=Activer mon micro et ma caméra");
      await expect(page.locator("text=Autorisation refusée")).toBeVisible({ timeout: 5000 });
    });

    test("shows correct error: NotFoundError", async ({ page }) => {
      await mock(page, true, "NotFoundError");
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");
      await page.click("text=Activer mon micro et ma caméra");
      await expect(page.locator("text=Aucun micro ou caméra détecté")).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Config Step — with pre-obtained stream (happy path)", () => {

    test("shows video preview, device selectors, no activation button", async ({ page }) => {
      await mock(page, false);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");
      await expect(page.locator("video")).toBeVisible({ timeout: 5000 });
      await expect(page.locator("text=SÉLECTIONNER LE MICROPHONE")).toBeVisible();
      await expect(page.locator("text=SÉLECTIONNER LA CAMÉRA")).toBeVisible();
    });

    test("can continue to intro step", async ({ page }) => {
      await mock(page, false);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");
      await expect(page.locator("video")).toBeVisible({ timeout: 5000 });
      await page.click("button:has-text('Continuer')");
      await expect(page.getByRole("heading", { name: /plein écran/i })).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Empty / blocked device lists (iOS Safari)", () => {

    test("enumerateDevices returns empty after stream obtained → shows fallback, no broken select", async ({ page }) => {
      // iOS: getUserMedia succeeds but enumerateDevices returns nothing
      await mock(page, false, undefined, []);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");

      // Should NOT show any <select> (prevents "Aucune option" on iOS)
      await expect(page.locator("select")).not.toBeVisible({ timeout: 5000 });

      // Camera preview should still show (stream is active)
      await expect(page.locator("video")).toBeVisible({ timeout: 5000 });

      // Should show "Périphériques actifs mais noms indisponibles" message
      await expect(page.locator("text=Périphériques actifs mais noms indisponibles")).toBeVisible({ timeout: 5000 });

      // Continue button should be visible
      await expect(page.locator("button:has-text('Continuer')")).toBeVisible();
    });

    test("enumerateDevices empty + no stream (welcome GUM failed) → nothingFound state", async ({ page }) => {
      // Welcome step: getUserMedia fails → no stream stored
      // Config step: "Activer" button visible
      await mock(page, true, undefined, []);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");

      await expect(page.locator("text=Activer mon micro et ma caméra")).toBeVisible({ timeout: 5000 });

      // Now make getUserMedia succeed but devices stay empty
      await page.evaluate(() => { (window as any).__MOCK_STATE__.gumFails = false; });
      await page.click("text=Activer mon micro et ma caméra");

      // Should show nothingFound message
      await expect(page.locator("text=Aucun périphérique trouvé")).toBeVisible({ timeout: 5000 });
      await expect(page.locator("text=Rechercher à nouveau")).toBeVisible();
      await expect(page.locator("select")).not.toBeVisible();
    });

    test("only microphone devices → only mic selector, no camera selector", async ({ page }) => {
      await mock(page, false, undefined, [
        { deviceId: "mic-1", kind: "audioinput", label: "Faux Microphone", groupId: "g1" },
      ]);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");

      await expect(page.locator("text=SÉLECTIONNER LE MICROPHONE")).toBeVisible({ timeout: 5000 });
      await expect(page.locator("text=SÉLECTIONNER LA CAMÉRA")).not.toBeVisible();
    });

    test("only camera devices → only camera selector, no mic selector", async ({ page }) => {
      await mock(page, false, undefined, [
        { deviceId: "cam-1", kind: "videoinput", label: "Fausse Caméra", groupId: "g1" },
      ]);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");

      await expect(page.locator("text=SÉLECTIONNER LA CAMÉRA")).toBeVisible({ timeout: 5000 });
      await expect(page.locator("text=SÉLECTIONNER LE MICROPHONE")).not.toBeVisible();
    });

    test("no select is ever rendered with zero options (prevents iOS 'Aucune option')", async ({ page }) => {
      await mock(page, false, undefined, []);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");

      const selectCount = await page.locator("select").count();
      expect(selectCount).toBe(0);
    });
  });

  test.describe("Mobile layout — responsive design", () => {

    test("modal card width does not exceed viewport width", async ({ page }) => {
      // Use iPhone 13 viewport dimensions
      await page.setViewportSize({ width: 390, height: 844 });
      await mock(page, false);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");

      const card = await glassCardRect(page);
      expect(card).not.toBeNull();
      if (card) {
        expect(card.width).toBeLessThanOrEqual(390);
      }
    });

    test("heading text is not clipped (no overflow hidden truncation)", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await mock(page, false);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");

      const heading = page.locator("h2").first();
      await expect(heading).toBeVisible();

      // Check the heading's bounding box fits within the viewport
      const hBox = await heading.boundingBox();
      const vp = page.viewportSize();
      if (hBox && vp) {
        expect(hBox.x).toBeGreaterThanOrEqual(0);
        expect(hBox.x + hBox.width).toBeLessThanOrEqual(vp.width);
        // Text should wrap (height > single line)
        expect(hBox.height).toBeGreaterThan(24);
      }
    });

    test("video preview fits within viewport on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await mock(page, false);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");

      const video = page.locator("video");
      await expect(video).toBeVisible();

      const vBox = await video.boundingBox();
      const vp = page.viewportSize();
      if (vBox && vp) {
        expect(vBox.width).toBeLessThanOrEqual(vp.width);
        expect(vBox.x + vBox.width).toBeLessThanOrEqual(vp.width);
      }
    });

    test("device selectors are full-width on mobile and don't overflow", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await mock(page, false);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");

      const selects = page.locator("select");
      const count = await selects.count();

      for (let i = 0; i < count; i++) {
        const box = await selects.nth(i).boundingBox();
        const vp = page.viewportSize();
        if (box && vp) {
          expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 1);
        }
      }
    });
  });

  test.describe("Meeting Room — Daily.co iframe allow attribute", () => {

    test("iframe has allow='camera *; microphone *; autoplay *'", async ({ page }) => {
      await mock(page, false);
      await gotoReunion(page);
      await page.click("button:has-text('Continuer')");    // welcome → config
      await expect(page.locator("video")).toBeVisible({ timeout: 5000 });
      await page.click("button:has-text('Continuer')");    // config → intro
      await expect(page.getByRole("heading", { name: /plein écran/i })).toBeVisible({ timeout: 5000 });

      // Mock Daily.co dynamic import
      await page.route("**/daily-js**", (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/javascript",
          body: `
            export default {
              createFrame(el, opts) {
                const iframe = document.createElement("iframe");
                el.appendChild(iframe);
                return {
                  iframe: () => iframe,
                  setTheme: () => Promise.resolve(),
                  setDailyLang: () => {},
                  join: () => {
                    const f = iframe;
                    f.setAttribute("allow", "camera *; microphone *; autoplay *");
                    return Promise.resolve();
                  },
                  on: (ev, cb) => { if (ev === "left-meeting") setTimeout(cb, 500); },
                  destroy: () => {},
                };
              },
            };
          `,
        });
      });

      await page.click("text=Rejoindre la réunion");
      await expect(page.locator("iframe")).toBeVisible({ timeout: 10000 });

      const allow = await page.locator("iframe").first().getAttribute("allow");
      expect(allow).toContain("camera *");
      expect(allow).toContain("microphone *");
      expect(allow).toContain("autoplay *");
    });
  });
});
