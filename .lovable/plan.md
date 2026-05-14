## Notes before the audit

- The `/privacy-policy` page already exists at `src/pages/PrivacyPolicy.tsx` and is routed in `src/App.tsx`. No new page needs to be created. If you want a Polish (PL) version, tell me and I'll add it as a separate route or as a language toggle.
- This is a read-only audit per your request. Below is every finding from `src/pages/Index.tsx`, `src/components/site/Navbar.tsx` (note: `src/components/Navbar.tsx` does not exist — the Navbar lives under `components/site/`), `src/App.css`, and `src/index.css`.

---

## 1) Fixed pixel widths / min-widths > 390px

**src/App.css**
- L2 — `#root { max-width: 1280px; }` — global wrapper, capped wider than mobile but with `margin: 0 auto`, so safe-ish; still a hardcoded layout width.

**src/pages/Index.tsx**
- L182 — `className="... max-w-[1400px] ..."` — main two-column row container (1400px max).
- L270, L293 — `className="grid min-h-[500px] grid-cols-1 md:grid-cols-2"` — sections with `min-h-[500px]` (height, not width — flagged for completeness).
- L272, L308 — `className="min-h-[300px] bg-cover bg-center"` — image columns (height only).
- L316 — `className="mx-auto max-w-[1200px] text-center"` — stats container.
- L338 — inline `style={{ ..., maxWidth: 1100, ... }}` — CTA card max-width 1100px.
- L345 — `className="max-w-[620px]"` — CTA heading column.

**src/components/site/Navbar.tsx**
- L66 — inline modal `style={{ maxWidth: "560px", width: "100%" }}` — modal max 560px (paired with `width: 100%`, so OK on mobile).
- L298 — solutions mega dropdown inline `style={{ ..., width: "100%", ... }}` — fine, but the inner grid below uses fixed columns.
- L307 — inline `style={{ gridTemplateColumns: "320px 1fr", ... }}` — **fixed 320px first column** inside the desktop mega dropdown. Desktop-only (`hidden lg:block` parent), so it does not hit mobile, but it is a hardcoded > 390px layout width.
- L469 — `className="... max-w-7xl ..."` on mobile nav row (max-w-7xl = 1280px) — capped, with `mx-auto`.
- L491–493 — `<SheetContent ... className="w-full max-w-md ...">` — mobile drawer max 28rem (448px), with `w-full` so it shrinks on narrow screens.

**src/index.css**
- None. No fixed pixel widths/min-widths > 390px on layout containers.

---

## 2) Elements styled wider than 100vw

None found in any of the four files. Nothing uses `vw`-based widths, negative margins pulling beyond viewport, or `width: 100vw` combined with padding that would overflow.

---

## 3) Flex rows / grids without `flex-wrap` or a responsive breakpoint

**src/pages/Index.tsx**
- L246 — inline `style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}` — "Get A Quote" + phone row. **No `flex-wrap`, no md: breakpoint** — both children stay side-by-side at every width. (Font sizes were reduced earlier so it currently fits, but the row itself has no wrap fallback.)
- L321 — `className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"` — has responsive breakpoints (single column on mobile by default). OK.
- L335 — `className="flex flex-col items-start gap-10 md:flex-row ..."` — has breakpoint. OK.
- L353 — `className="flex flex-col md:flex-row items-stretch md:items-center w-full md:w-auto"` — has breakpoint. OK.

**src/components/site/Navbar.tsx**
- L250 — `className="flex items-center justify-end gap-3"` — top utility bar (Company News | Careers | Contact). Parent is `hidden lg:block`, so desktop-only. No wrap, but never reaches mobile — low risk.
- L267 — `className="relative hidden lg:flex items-center justify-between"` — desktop main nav. Desktop-only. No wrap.
- L274 — `className="flex items-center" style={{ gap: "28px" }}` — desktop nav links cluster. Desktop-only.
- L300–310 — inline-style `display: "grid", gridTemplateColumns: "320px 1fr"` — mega dropdown. **Fixed two-column grid, no responsive fallback.** Desktop-only (parent `hidden lg:block`), but if ever shown < 360px + 320px it would overflow.
- L364–369 — inline `gridTemplateColumns: "1fr 1fr"` — sub-items grid in mega dropdown. Desktop-only, no responsive fallback.
- L431 — `className="flex items-center" style={{ gap: "12px", marginLeft: "16px" }}` — desktop CTA cluster. Desktop-only.
- L469 — mobile nav `flex ... justify-between` — only logo + hamburger, two items, OK.

**src/App.css / src/index.css**
- None.

---

## 4) `overflow-x:hidden` / `overflow:hidden` on `body` / `html` / `#root`

- **None.** Neither `src/index.css` nor `src/App.css` sets `overflow` on `html`, `body`, or `#root`. This means horizontal overflow from any child element will produce a page-level horizontal scrollbar on mobile (not silently masked, but also not prevented).

The only `overflow-hidden` in `Index.tsx` is L181 on a single `<section>` (`className="bg-white overflow-hidden"`), which is scoped to that section.

---

## 5) Hardcoded px values in width / max-width / min-width on layout containers

(Consolidated; many already listed above.)

**src/App.css**
- L2 — `#root { max-width: 1280px; padding: 2rem; }` — global. The `padding: 2rem` (32px) on `#root` shrinks usable width by 64px on every page; fine on mobile but worth knowing.

**src/pages/Index.tsx**
- L182 — `max-w-[1400px]`
- L184 — `md:w-[60%]` (percentage, not px — informational)
- L202 — inline `width: 48, height: 48` (icon, not a layout container)
- L225 — `md:w-[40%]` (percentage)
- L316 — `max-w-[1200px]`
- L338 — inline `maxWidth: 1100`
- L345 — `max-w-[620px]`

**src/components/site/Navbar.tsx**
- L66 — inline `maxWidth: "560px"` (modal, paired with `width: 100%`)
- L271 — inline `style={{ height: "56px", width: "auto" }}` (logo image)
- L307 — inline `gridTemplateColumns: "320px 1fr"` (fixed 320px column — desktop-only)
- L469 — `max-w-7xl` (1280px)
- L474 — `className="h-[52px] w-auto md:h-[64px]"` (logo, height only)
- L491–493 — `<SheetContent ... max-w-md ...>` (448px max, with `w-full`)

**src/index.css**
- None. No layout container in `index.css` sets a fixed px width / max-width / min-width.

---

## Highest-risk items for mobile horizontal scroll

1. `src/pages/Index.tsx` L246 — inline flex row "Get A Quote" + phone with no wrap fallback. Currently relies on the recently-tuned font sizes; any text change could re-break it.
2. `src/components/site/Navbar.tsx` L307 — `gridTemplateColumns: "320px 1fr"` fixed column. Desktop-only today, so no current mobile impact, but it is the only hardcoded > 390px layout column in these files.
3. `src/App.css` L2 — global `#root { padding: 2rem }` adds 64px combined horizontal padding on every page including mobile; not an overflow source but it shrinks usable width.
4. No `overflow-x: hidden` safety net on `html`/`body`/`#root` — any future overflowing child will produce a horizontal page scroll on mobile rather than being clipped.

---

## What I will do next

Nothing — per your instructions, no files were changed. Approve this plan if you'd like me to (a) actually fix any of the highest-risk items above, or (b) build the Polish-language privacy policy page you mentioned at the start. Tell me which of the two (or both) and I'll proceed.
