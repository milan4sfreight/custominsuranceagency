## Custom Insurance — Premium Hero Homepage

A single-page, desktop-first hero section with a fixed navbar. Clean corporate SaaS aesthetic, blue + white palette, lots of whitespace, smooth gradients, subtle shadows.

### Navbar (sticky, transparent over hero, solid white on scroll)

- Left: "Custom Insurance" wordmark (deep navy, tight tracking, small shield/diamond mark in brand blue).
- Center: Home · Coverage · About · Contact (medium weight, slate-700, blue underline on hover/active).
- Right: "Get a Quote" pill button — blue gradient, white text, soft shadow.
- Mobile: hamburger opens a right-side sheet with the same links + CTA.

### Hero Section (full viewport height)

**Background**
- AI-generated photographic image of the Chicago skyline from across the water (Lake Michigan, golden-hour soft sky, natural light).
- Light gaussian blur + low contrast + a white→sky-blue gradient overlay (top-left whiter for text legibility, fading to a clearer skyline on the right).

**Layout (split, 12-col grid)**
- Left column (cols 1–6, generous left padding): text content, vertically centered.
- Right column (cols 7–12): generated visual.

**Left content**
- Small eyebrow tag: "Insurance, reimagined" (uppercase, tracked, brand blue, with a short line accent).
- H1 (large, tight leading, deep navy, serif-tinged display sans):
  "Getting insurance is easy.
  Getting it right isn't."
  ("right isn't" emphasized via brand blue gradient text).
- Subheadline (slate-600, comfortable line-height): "Smarter coverage. Better service. Built for modern businesses."
- Primary CTA: "Get Your Quote" — large, rounded-full, blue gradient (brand blue → deeper indigo), soft glowing shadow, arrow icon.
- Secondary trust row beneath CTA: small, muted — "A+ rated · 10,000+ businesses covered · Licensed in 50 states".

**Right visual (single AI-generated PNG, transparent or skyline-matched background)**
- A medium-large 3D glass-style lowercase word "quote" — translucent blue glass with internal refraction, soft floor reflection, gentle drop shadow.
- A professional woman in business-casual seated naturally on top of the word, working on a laptop. Subtle scale — does not dominate.
- Positioned right-of-center, leaving generous left-side breathing room.
- Soft floor shadow blends into the background.

### Visual Generation

- Generate two assets via the AI gateway (Nano banana pro for quality):
  1. `chicago-skyline.jpg` — photoreal Chicago skyline near water, soft natural light, slight blur.
  2. `quote-glass.png` — translucent blue glass 3D "quote" with seated professional woman on top, transparent background, soft reflection.
- Save under `src/assets/` and import so Vite hashes them.

### Design Tokens (added to `index.css` + `tailwind.config.ts`)

- `--brand` (deep blue ~ 220 90% 56%), `--brand-foreground`, `--brand-deep` (indigo ~ 230 70% 38%), `--ink` (navy text), `--muted-ink` (slate).
- Gradient utilities: `bg-brand-gradient`, `text-brand-gradient`, `shadow-brand-glow`.
- Display font (Inter Tight or similar via Google Fonts) for headings, Inter for body.

### Components

- `src/components/site/Navbar.tsx`
- `src/components/site/Hero.tsx`
- Replace `src/pages/Index.tsx` to render `<Navbar />` + `<Hero />`.
- Mobile nav uses existing shadcn `Sheet`.

### Out of Scope (this pass)

- No additional sections (features, testimonials, footer) — hero only, per brief.
- No backend, no real quote form (CTA can scroll to a placeholder anchor or be a non-functional button for now).