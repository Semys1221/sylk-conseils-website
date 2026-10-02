# Sylk Conseils B2B — White Theme Design System (Institutional)

**Product:** `apps/b2b-sylk` — cabinet d'expertise comptable & conseil  
**Theme:** Light / white institutional (private banking & advisory adjacency)  
**Stack:** shadcn/ui + Tailwind (`app/globals.css`, `tailwind.config.ts`)

## Reference sourcing

| Source | Status |
|--------|--------|
| Mobbin MCP (Composio) | Connected; search requires paid Mobbin plan |
| Pinterest MCP | Connected; searches only the linked account's pins |
| Inspo MCP + web research | Used for Public.com, McKinsey DESIGN.md, Lazard case study, Mobbin public links |

**References:** [Public.com](https://public.com), [McKinsey DESIGN.md](https://www.webdesignhot.com/design.md/mckinsey/), [Lazard / Brunswick case study](https://durabledigital.com/stories/case-studies/lazard/), [Origin advisors flow (Mobbin)](https://mobbin.com/explore/flows/f3a729dc-f5bb-4c84-991d-f54ddcfb8d77), [JPMorgan nav collection (Mobbin)](https://mobbin.com/collections/2b3ce106-17d4-4ca8-b052-6837d98ee020/web/screens)

---

## Brand principles

1. **Trust through restraint** — Whitespace, limited palette, no gradient hero on marketing pages.
2. **Discretion** — Boutique cabinet tone; factual stats, not hype.
3. **Precision** — Strict grid, consistent section rhythm, tabular figures for numbers.
4. **Heritage + clarity** — Serif for authority; sans for nav, forms, long reading.
5. **Human proof** — Founder portrait and testimonials as documentary, not stock clichés.

---

## Color tokens

Implement in `:root` (light). Map to shadcn semantic names.

### Backgrounds

| Token | Hex | Usage |
|-------|-----|--------|
| `--background` | `#FFFFFF` | Page base |
| `--surface-subtle` / `muted` | `#F7F8F9` | Alternate sections |
| `--surface-elevated` / `card` | `#FFFFFF` | Cards on subtle bands |
| `--surface-inset` | `#F3F4F5` | Stat wells, fields |

### Text

| Token | Hex |
|-------|-----|
| `--foreground` | `#0B1F33` |
| `--muted-foreground` | `#5C6570` |
| `--foreground-subtle` | `#8A929C` |

### Accent (navy + brass)

| Token | Hex | Usage |
|-------|-----|--------|
| `--primary` | `#0B1F33` | Filled buttons |
| `--primary-foreground` | `#FFFFFF` | On primary |
| `--accent` | `#9A7B4F` | Brass highlights |
| `--accent-muted` | `#E8E0D4` | Soft accent bg |
| `--accent-digital` | `#1E4FD6` | Links, focus (optional) |

### Borders & nav

| Token | Hex |
|-------|-----|
| `--border` / `--input` | `#D9DDE0` |
| `--ring` | `#1E4FD6` or `#9A7B4F` |
| `--nav-background` (optional) | `#051C2C` |
| `--nav-foreground` | `#FFFFFF` |

---

## Typography

**Pairing:** Instrument Serif (display) + Source Sans 3 (UI/body).  
**Alternative:** keep Playfair for italic emphasis only.

| Role | Font | Size | Weight | Line height |
|------|------|------|--------|-------------|
| Hero / H1 | Instrument Serif | 56–72px | 400 | 1.05–1.08 |
| H2 | Instrument Serif | 40px | 400 | 1.12 |
| H3–H4 | Source Sans 3 | 28 / 22px | 600 | 1.2–1.25 |
| Body | Source Sans 3 | 16px | 400 | 1.6 |
| Lead | Source Sans 3 | 18–20px | 400 | 1.55 |
| Overline | Source Sans 3 | 12px | 600 | 1.4, +0.12em uppercase |

---

## Spacing & layout

- Container: `1280px`; wide grid `1400px` (expertises).
- Section padding: `96px` → `128px` vertical; `24–32px` horizontal.
- Grid: 12 cols, 24px gutter; hero 5/7 or 6/6 split.
- Base rhythm: 8px steps (8, 16, 24, 32, 48, 64, 96).

---

## Radius, shadow, border

- Radius: `4px` buttons/inputs; cards max `8px`.
- Shadow: none default; hover `0 1px 2px rgba(11,31,51,0.06)` max.
- Prefer `1px solid var(--border)` over heavy shadow.
- Reduce glass / mesh on public marketing pages.

---

## Components (summary)

- **Button:** Primary filled navy; secondary bordered white; ghost link with brass underline on hover.
- **Card:** White + border, 32–40px padding, 8px radius.
- **Nav:** White + bottom border, or optional dark band `#051C2C`.
- **Stat block:** Inset or bordered tiles on `#F7F8F9`.
- **CTA band:** Subtle surface, serif headline, single primary action.
- **PageHero:** White, serif H1, border-bottom instead of gradient.

---

## Motion

- 140ms hover, 240ms reveal; ease `cubic-bezier(0.2, 0, 0, 1)`.
- Max 8–16px fade-up; respect `prefers-reduced-motion`.
- No scale on primary CTAs.

---

## Mapping to current site

| Area | Direction |
|------|-----------|
| Home hero | White split layout; navy serif; portrait on neutral ground (not blue gradient) |
| Cabinet section | Flat `#F7F8F9`; bordered stats; rectangular CTA |
| Expertise banner | Light editorial or restrained photo (not dark full-bleed) |
| `/le-cabinet`, `/expertises` | Serif H1, prose ~760px, border-led cards |
| Funnel | Same tokens; softer white modal surface |

**Implementation order:** `app/globals.css` → `components/landing-funnel.tsx` → `expertises` + `tenant-ui` PageHero/Nav/Footer.

---

## Figma

- Frame 1440px; color/text styles from tables above.
- Pin Public hero, McKinsey tokens, Lazard modules.
- Avoid: full-page dark hero, blue glow, 32px+ card radius, strong shadows.
