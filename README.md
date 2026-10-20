# Edith Nduta Kuria — Portfolio

A production-ready portfolio for **Edith Nduta Kuria**, architect (B.Arch, JKUAT 2025), practising at **Locus Studio**, Nairobi.

The site is deliberately framework-free: hand-written HTML, CSS and vanilla JavaScript, with original SVG illustrations. There is no build step, no package manager and no runtime dependency. Open `index.html` through any static server and it works.

> **Content status:** the structure, design and interactions are production-ready. The six projects, biography details, email address and domain are illustrative placeholders pending Edith's final copy and assets. See [Replacing placeholder content](#replacing-placeholder-content).

---

## What is here

- **Single-page editorial portfolio** with a hero, selected work, approach, about/timeline and contact.
- **Six case studies** in accessible modal dialogs, each with facts, narrative, cover illustration and a detail drawing.
- **Client-side filtering** by typology with a live result count.
- **Light/dark theme** with system preference detection, a manual toggle and `localStorage` persistence.
- **Polish and motion**: scroll reveals, reading progress, sticky header, hover image preview, active navigation, copy-to-clipboard email, Nairobi local time and current year.
- **Responsive** from 320 px phones to wide desktops, with a dedicated mobile menu.
- **Accessible** by default: skip link, semantic landmarks, focus management in dialogs, labelled controls, reduced-motion support and keyboard navigation.
- **Deployment/SEO assets**: Open Graph and Twitter cards, JSON-LD, favicon/PWA icons, web manifest, sitemap, robots file and a custom 404 page.
- **Original artwork**: fourteen hand-drawn SVG illustrations plus PNG icons and a social card.

## Quick start

From the project root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

Any static server works, for example:

```bash
npx serve .          # if Node is available
php -S localhost:8000
```

Opening `index.html` directly from the filesystem mostly works, but a local server is preferred so that fonts, manifest and relative asset paths behave exactly as they will in production.

## Project structure

```text
.
├── index.html                 # All page content and six case-study templates
├── 404.html                   # Custom not-found page
├── assets/
│   ├── css/styles.css         # Design tokens, layout, components, themes, print
│   ├── js/app.js              # All interactions, progressively enhanced
│   └── img/
│       ├── hero-courtyard.svg
│       ├── about-desk.svg
│       ├── project-*.svg      # Six project covers
│       ├── detail-*.svg       # Six detail drawings
│       ├── favicon.svg
│       ├── icon-192.png
│       ├── icon-512.png
│       ├── apple-touch-icon.png
│       └── og.png             # 1200 × 630 social card
├── tools/generate_og.py       # Optional Pillow script for the social card/icons
├── site.webmanifest
├── robots.txt
├── sitemap.xml
├── .nojekyll                  # Stops GitHub Pages from running Jekyll
└── README.md
```

## Editing guide

### 1. Identity, contact and availability

Search `index.html` for these strings and replace them together:

| What | Where |
| --- | --- |
| Name and role | `<title>`, meta description, header brand, footer, JSON-LD |
| Email | Contact section, no-JS fallback, mobile menu footer, 404 page, JSON-LD `email` |
| Studio/location links | About facts and contact meta |
| Availability line | Contact `contact__meta` |
| Social preview text | Open Graph and Twitter meta tags |

The email appears in several places across `index.html` and `404.html`. Find every occurrence before changing it:

```bash
grep -Rno 'hello@edithnduta.studio' --exclude-dir=.git .
```

Remember to update both the visible link and the copy button payload:

```html
<a href="mailto:hello@edithnduta.studio">hello@edithnduta.studio</a>
<button data-copy-email="hello@edithnduta.studio">Copy email</button>
```

```json
"email": "mailto:hello@edithnduta.studio"
```

### 2. Domain and canonical URLs

The placeholder domain is `https://edithnduta.studio/`. Before launch, replace it in:

- `<link rel="canonical">`
- `og:url`, `og:image`, `twitter:image`
- JSON-LD `url` and `image`
- `sitemap.xml`
- `robots.txt` (sitemap line)

If you deploy to GitHub Pages without a custom domain, use the full Pages URL (for example `https://username.github.io/repo/`) and keep all asset paths relative, as they are now.

### 3. Projects and case studies

Each project is a self-contained `<article class="work-item">` containing:

1. A `<button class="work-item__button" data-project="slug">` that acts as the card and dialog trigger.
2. A `<template id="project-slug">` holding the full case study.

To edit a project, change both parts:

```html
<article class="work-item" data-category="residential" data-reveal>
  <button ... data-project="lumumba" ...>
    <span class="work-item__title">Lumumba Courtyard House</span>
    <span class="work-item__meta">Residential · Nairobi, Kenya</span>
    <span class="work-item__summary">One sentence for the list.</span>
    <span class="work-item__year">2025</span>
  </button>
  <template id="project-lumumba">
    <!-- case study: kicker, title, lede, cover, body, facts, drawing -->
  </template>
</article>
```

- `data-category` must match a filter: `residential`, `civic`, `adaptive` or `thesis`.
- `data-project` and the template `id` must stay in sync (`data-project="lumumba"` ↔ `id="project-lumumba"`).
- The dialog's **Next project** button follows the order of projects in the DOM, including the current filter.
- Update the filter counts in `.filters` (`All 06`, etc.) and the "Showing …" text is generated automatically by JavaScript.
- Every case study currently says **Academic studio** or **Thesis** in its facts. Keep that accurate unless a project was actually built.
- `<h2 class="case__title" id="project-dialog-title">` is required: the dialog uses it for its accessible name.
- Figures use `width`/`height` to prevent layout shift. Keep the aspect ratio or update both attributes.

To add a seventh project: duplicate an entire `<article>`, change the slug, category, copy and images, then update the counts and the `06` markers in navigation/section labels. The dialog script needs no changes.

### 4. Replacing illustrations

All project artwork is SVG, so it is crisp at any size and easy to swap. Replace the files in `assets/img/` using the same names, or update the `src` values.

Recommended dimensions:

| Asset | Dimensions | Notes |
| --- | --- | --- |
| Project covers | 1600 × 1200 (4:3) | Card thumbnail, hover preview and case-study cover |
| Detail drawings | 1400 × 1000 (7:5) | Plans, sections, axonometrics |
| Hero | 1600 × 1200 | Set as a preloaded, high-priority image |
| About desk | 1100 × 1375 (4:5) | Portrait-ish editorial crop |
| Social card | 1200 × 630 PNG | Regenerate with `tools/generate_og.py` |

Keep alt text descriptive and specific. Decorative thumbnails inside the work list use `alt=""` because the adjacent title already describes the project; the larger image inside each case study carries the description.

To regenerate the PNG icons and social card (optional; requires Pillow):

```bash
python3 -m pip install Pillow
python3 tools/generate_og.py
```

### 5. Colours, type and spacing

The design system lives at the top of `assets/css/styles.css`:

```css
:root {
  --bg: #f3eee4;       /* warm paper */
  --ink: #1a1814;      /* near-black */
  --accent: #a9502f;   /* terracotta */
  --serif: "Fraunces", ...;
  --sans: "Inter", ...;
  --pad: clamp(1.25rem, 4vw, 4rem);
  --max: 1440px;
}
```

Dark-theme values are defined under `[data-theme="dark"]`. Change a token once and it propagates across the site. The theme toggle is in the header; the preference is stored under `enk-theme`.

Typography uses Fraunces and Inter from Google Fonts with local serif/sans fallbacks. If the site must work fully offline or avoid third-party requests, self-host the font files and replace the `<link>` tags in `index.html` with `@font-face` rules.

### 6. Section copy

Static narrative lives directly in `index.html`:

- Hero and ticker — lines 134–205
- Work intro, filters and project list — lines 207 onward
- Approach principles — `<section id="approach">`
- About, facts and timeline — `<section id="about">`
- Contact — `<section id="contact">`
- Footer and dialogs — end of file

There is no CMS. This is intentional: edits are plain text, reviewable in git, and safe to make without a toolchain.

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`) and a skip link.
- Native `<dialog>` elements, with focus moved into the case study and returned to the triggering card on close.
- `Escape` closes dialogs; clicking the backdrop closes the case study; arrow keys move between projects.
- Filter buttons expose `aria-pressed`; the result count is announced with `aria-live="polite"`.
- Reduced-motion preferences disable reveals, smooth scrolling and transitions.
- Colour pairs were chosen for readable contrast in both themes; re-check contrast if you change tokens.
- Images have alt text; icon-only buttons have `aria-label`; the decorative grain and preview layers are hidden from assistive technology.

## Performance

- No framework, no runtime dependencies, one CSS file and one deferred JS file.
- SVG artwork scales without extra requests and is small compared with photography.
- The hero image is preloaded; below-the-fold images use `loading="lazy"` and `decoding="async"`.
- Fonts are the only third-party request. Use `display=swap` (already set) and consider self-hosting for stricter privacy/performance budgets.
- Motion is driven by `requestAnimationFrame` and `IntersectionObserver`.

## Deployment

### GitHub Pages

1. Push the repository to GitHub.
2. In **Settings → Pages**, choose the branch (`main`) and the root folder.
3. The included `.nojekyll` file keeps Pages from processing the site with Jekyll.
4. For a custom domain, add a `CNAME` file containing the bare domain (for example `edithnduta.studio`) and configure the DNS records GitHub provides.

No build command is required; the repository root is the publish directory.

### Netlify / Vercel / Cloudflare Pages

- Build command: none (or `echo "static site"`).
- Publish directory: `.` (repository root).
- No environment variables are needed.

### Any static host

Upload the repository contents. Serve `index.html` for `/` and `404.html` for missing paths if the host supports custom error pages.

After deploying, update the canonical/OG URLs and `sitemap.xml` to the real domain, then re-test the social card with your platform's debugger.

## QA checklist

Before publishing a content update:

- [ ] Test at 1440 px, 1024 px, 768 px and 390 px widths.
- [ ] Toggle light/dark; reload and confirm the choice persists.
- [ ] Open every project; use **Next project**, `Escape`, the close button and the backdrop.
- [ ] Filter each category; confirm counts, visible cards and keyboard focus.
- [ ] Tab through the page: skip link, header, filters, cards, dialog controls, footer.
- [ ] Confirm the mobile menu opens, closes on navigation and restores focus.
- [ ] Check the copy-email button and the Nairobi local time.
- [ ] Validate links and anchors; confirm no console errors.
- [ ] Run an HTML validator and a Lighthouse pass (performance, accessibility, best practices, SEO).
- [ ] Confirm the 404 page and social preview image resolve on the deployed domain.

## Browser support

Current versions of Chrome, Edge, Firefox and Safari, including iOS Safari. The site uses native `<dialog>`, CSS custom properties, `clamp()`, `IntersectionObserver` and `matchMedia`. Content remains readable without JavaScript; filtering, the case-study dialog and theme switching require it.

## Roadmap

- Replace placeholder projects, biography and contact details with final copy.
- Add real project photography and drawing scans as they become available.
- Add a writing/journal section if Edith wants to publish research.
- Add downloadable CV and portfolio PDF.
- Consider a small build step only if the site grows beyond a single page.

## Credits

- Design and front-end: original work for Edith Nduta Kuria.
- Illustrations: original SVG drawings created for this site.
- Typefaces: [Fraunces](https://fonts.google.com/specimen/Fraunces) and [Inter](https://fonts.google.com/specimen/Inter), served by Google Fonts under the SIL Open Font License.
- Icons and social card: generated locally; see `tools/generate_og.py`.

All project imagery is illustrative and does not depict built work unless explicitly stated.
