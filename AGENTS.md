# Project context — Edith Nduta Kuria portfolio

This file is the durable handoff for OpenCode sessions working in `/code/edith`.
`opencode.json` loads `README.md` automatically, and OpenCode discovers this
`AGENTS.md` at the project root. Read both before making changes.

**Last updated:** 2026-10-20

---

## Mission and non-negotiables

Build and maintain a production-ready portfolio for **Edith Nduta Kuria**, an
architect based in Nairobi, Kenya. She graduated from **JKUAT in 2025** after the
six-year B.Arch course and practises at **Locus Studio**.

- Keep the site **framework-free**: plain HTML, CSS and vanilla JavaScript.
- Do **not** add a build step, package manager or runtime dependency unless the
  user explicitly asks. The current site deploys as static files.
- Preserve the editorial identity: warm bone paper, ink, terracotta accent,
  Fraunces serif, Inter sans, hairline rules and generous whitespace.
- Keep illustrations original and local. Do not replace them with stock images.
- Label projects accurately as **Academic studio** or **Thesis**. They are not
  built work. Never imply otherwise without direct confirmation from Edith.
- Maintain accessibility, keyboard support and reduced-motion behavior.
- Keep asset paths relative so the site works on GitHub Pages project URLs.
- Treat placeholder content as placeholder. Do not present it as final facts.

## Current state

The site is complete and committed. The working tree should normally be clean.

- Single-page portfolio with hero, ticker, six filterable projects, approach,
  about/timeline, contact, footer and custom 404.
- Six full case studies rendered into a native `<dialog>` from `<template>`
  elements, with next-project navigation and keyboard support.
- Light/dark themes, filters, hover preview, reveals, active navigation, copy
  email, Nairobi local time and dynamic year.
- Responsive down to 320 px, including compact header and mobile menu.
- Fourteen original SVG illustrations plus favicon, PWA icons, social card and
  generated assets.
- SEO/discovery files: Open Graph, Twitter cards, JSON-LD, manifest, robots,
  sitemap, `.nojekyll`.
- Final QA passed at 1440, 820, 390 and 320 px: no overflow, console errors,
  unresolved anchors, missing alt text or unlabelled controls. Dialog, filter,
  theme, menu, focus-return and scroll-lock checks passed.

Baseline commits (run `git log --oneline -10` for current history):

```text
468190f docs: document content editing, deployment and QA
824ecbc chore: add discovery, PWA and hosting metadata
d2c291c feat: build portfolio page, case studies and interactions
49865bc feat: add original architectural illustration set and brand assets
4a5795c chore: scaffold static portfolio repository
```

## Architecture

```text
index.html              Page content, six work cards, six <template> case studies
404.html                Custom error page
assets/css/styles.css   Tokens, layout, components, responsive, dark, print
assets/js/app.js        All progressive-enhancement behavior
assets/img/             Original SVGs, icons, social card
tools/generate_og.py    Optional Pillow generator for PNG icons/OG image
README.md               Canonical content, deployment and QA documentation
AGENTS.md               Durable project context and handoff notes
opencode.json           Project config; loads README as extra instructions
```

### Content contract

Each project is one `<article class="work-item" data-category="...">` containing:

1. A `.work-item__button` with `data-project="slug"` and `aria-haspopup="dialog"`.
2. A `<template id="project-slug">` with the full case study.

The slug in `data-project` and the template id must match. Categories must match
a filter: `residential`, `civic`, `adaptive` or `thesis`. The viewer follows DOM
order and the current filter. `assets/js/app.js` assigns the dialog title id at
runtime; do not add duplicate `id` attributes to template titles.

Project facts must state status honestly. Filter counts (`All 06`, etc.) are
hard-coded; the "Showing …" count is generated.

### JavaScript behavior

`assets/js/app.js` is organized in guarded sections. It handles theme persistence
under `enk-theme`, header/progress, mobile menu, reveals, active nav, filters,
pointer previews, dialog population/navigation, copy email, local time and year.
Guard optional elements. Keep behavior working without JavaScript where possible:
the project list and contact details remain readable when JS is unavailable.

## Run and verify

```bash
cd /code/edith
python3 -m http.server 8000
```

Open <http://localhost:8000/>. There is no build or test command.

Before committing a visual or interaction change:

- Check 1440, 820, 390 and 320 px widths.
- Toggle light/dark and reload to confirm persistence.
- Open every project; test next, ArrowRight, close, backdrop and focus return.
- Test every filter and confirm the count and visible cards.
- Test the mobile menu, including closing on navigation.
- Confirm no horizontal overflow, broken anchors, console errors or missing alt.
- Re-read the QA checklist in `README.md`.

## Editing rules

- When changing a project, update both the card and its template.
- When adding a project, update filter counts and any `06` markers.
- Replace the placeholder email, canonical domain and social URLs everywhere.
  Use `grep -Rno 'hello@edithnduta.studio' --exclude-dir=.git .` to find the
  email in `index.html`, `404.html` and docs.
- Update `sitemap.xml`, `robots.txt`, canonical/OG URLs and JSON-LD together when
  the domain changes.
- Keep images at the aspect ratios documented in `README.md`; preserve width and
  height attributes to avoid layout shift.
- Use existing CSS tokens instead of one-off colors. Dark-theme values live under
  `[data-theme="dark"]`.
- The compact header breakpoint is `380px`; below it the menu label is visually
  hidden, so the button must keep its `aria-label="Open menu"`.
- Do not remove the no-JS fallback, skip link, reduced-motion rules or print styles.
- Prefer small, reviewable edits over rewrites. This codebase has no framework to
  hide mistakes, so keep HTML semantics and CSS specificity simple.

## Known placeholders and launch work

These are intentional until Edith supplies final material:

- Six projects, biographies, project facts and artwork are illustrative.
- Email is `hello@edithnduta.studio`.
- Canonical domain is `https://edithnduta.studio/`.
- No real CV, social profiles, press links or downloadable portfolio yet.
- Fonts load from Google Fonts; self-host them only if privacy/offline use requires it.
- No custom-domain `CNAME` file has been added.

Possible next work, only if requested: replace content with final copy and real
project imagery, add a CV/PDF, add a journal section, or add a lightweight
automated link/HTML check to the repo.

## Git and session handoff

- Use conventional commit messages (`feat:`, `fix:`, `docs:`, `chore:`).
- Commit coherent changes, keep the tree clean, and do not rewrite history that
  has been shared.
- At the start of a session: read this file and `README.md`, then inspect
  `git status` and `git log --oneline -5`.
- At the end of a session that changes project state: update **Current state**,
  **Known placeholders** and any changed commands in this file, then commit it
  with the work. Keep this handoff factual and free of stale line numbers.
