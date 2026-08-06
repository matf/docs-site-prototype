# BAZG System Documentation — website prototype

A working prototype of the **BAZG system documentation portal**: one documentation tree for every
system and every component, structured directly according to **arc42**, with generated and
manually maintained documentation shown side by side.

**Published site:** <https://matf.github.io/docs-site-prototype/>

> **Prototype content.** All systems, components, teams, decisions, message contracts, metrics and
> metadata in this repository are fictional. They exist to demonstrate the navigation model and are
> **not** BAZG architecture information. No official BAZG branding assets are used — the mark in the
> navbar is a neutral placeholder.

## Purpose

This is primarily a **UX and information-architecture prototype**, not a documentation-generation
backend. It demonstrates:

- one coherent documentation tree, rooted at `Systems`;
- the twelve arc42 sections starting **directly** beneath every system and every component, with no
  intermediate `Overview`, `arc42` or `Other Topics` navigation node;
- generated documentation (context diagrams, component views, reaction graphs, messaging
  catalogues, observability inventories) integrated into the arc42 section it belongs to;
- custom documentation insertable at any level of the arc42 structure;
- a consistent `Generated` / `Custom` / `Mixed` labelling with provenance and ownership metadata;
- navigation between systems, components, arc42 sections, generated content and custom content;
- automatic deployment to GitHub Pages.

The "generated" pages are realistic samples with the structure a generator would produce. A future
generator can replace them without touching the site's information architecture — see
[How generated pages are expected to be replaced](#how-generated-pages-are-expected-to-be-replaced).

## Prerequisites

- **Node.js 20 or newer** (the site is built and deployed with Node 22; `package.json` requires
  `>=20`)
- **npm 10 or newer** (ships with Node 20+)
- **git** — the build reads the repository history for the "Last updated" timestamps, so the site
  must be built inside a git working copy with at least one commit

## Installation

```bash
npm ci
```

Use `npm ci` rather than `npm install` so the lockfile is honoured exactly — this is what the CI
workflows do.

## Development

```bash
npm start
```

Opens <http://localhost:3000/docs-site-prototype/> with hot reload. Note the `/docs-site-prototype/`
sub-path: the site is configured for a GitHub Pages **project** site, and the dev server serves it
from the same base path so link and asset problems surface locally rather than after deployment.

## Production build

```bash
npm run build
```

Writes the static site to `build/`. The build **fails** on a broken internal link, a broken anchor,
a broken Markdown link, a broken Markdown image or a duplicate route — see `onBrokenLinks`,
`onBrokenAnchors`, `onDuplicateRoutes` and `markdown.hooks` in `docusaurus.config.ts`.

Type-checking is separate:

```bash
npm run typecheck
```

## Local production preview

To look at exactly what will be deployed — the built static files, not the dev server:

```bash
npm run build
npm run serve
```

`npm run serve` prints the URL and serves the `build/` directory at
<http://localhost:3000/docs-site-prototype/>, honouring the configured `baseUrl` and
`trailingSlash`. This is the way to verify base-path issues, missing assets and routing before
pushing.

Useful variants:

```bash
npm run serve -- --port 3210        # serve on a different port
npm run serve -- --no-open          # do not open a browser
npm run clear                       # clear the Docusaurus cache if a build behaves oddly
```

If a page renders locally but not on GitHub Pages, check the base path first: every internal link
must be root-relative (`/systems/...`) and is rewritten to `/docs-site-prototype/systems/...` at
build time. A link that begins with `docs-site-prototype/` or a hard-coded `http://localhost` is a
bug. Behind a corporate proxy, `npm ci` may need proxy configuration; the site itself makes no
network calls at runtime.

## The documentation tree

One tree, rooted at `Systems`. The arc42 sections begin **directly** beneath each system and each
component:

```text
Systems
├── Example System A
│   ├── 1. Introduction and Goals
│   │   └── Stakeholder Goals                     ← custom page below an arc42 section
│   ├── 2. Architecture Constraints
│   ├── 3. Context and Scope
│   ├── 4. Solution Strategy
│   ├── 5. Building Block View                    ← links to the components
│   ├── 6. Runtime View
│   │   └── Peak Load and Degradation             ← custom operational scenario
│   ├── 7. Deployment View
│   ├── 8. Crosscutting Concerns
│   │   ├── Security and Data Protection
│   │   ├── Operations and Monitoring
│   │   └── Development Guidelines
│   ├── 9. Architecture Decisions
│   │   ├── ADR-0001 Event-driven integration
│   │   └── ADR-0002 Hosting and data residency
│   ├── 10. Quality Requirements
│   ├── 11. Risks and Technical Debt
│   ├── 12. Glossary
│   └── Components
│       ├── Example Component A
│       │   ├── 1. Introduction and Goals
│       │   ├── … (all twelve arc42 sections)
│       │   ├── 8. Crosscutting Concerns
│       │   │   ├── Messaging Events and Commands   (generated)
│       │   │   ├── Integration Conventions         (custom, between generated pages)
│       │   │   ├── Observability                   (generated)
│       │   │   └── Security                        (custom)
│       │   └── 12. Glossary
│       └── Example Component B
└── Example System B
    ├── 1. Introduction and Goals … 12. Glossary
    └── Components
        └── Example Component C
```

Two rules matter:

- **`Components` is a sibling of the arc42 sections, not a child of `5. Building Block View`.** The
  system's building block view *describes and links* its components; the component documentation
  lives one level down, where it has room for its own twelve sections.
- **Custom documentation is filed under the arc42 section it belongs to.** There is no generic
  catch-all category. In most cases the right home is `8. Crosscutting Concerns`; an operational
  scenario belongs under `6. Runtime View`, an ADR under `9. Architecture Decisions`.

### Filesystem layout and how it becomes navigation

The sidebar is autogenerated from the filesystem (`sidebars.ts` contains one `autogenerated` entry
for `docs/systems`), so **adding a file to the right folder is enough** to add it to the
navigation.

```text
docs/
├── index.mdx                       → /                     (start page)
├── systems-index.mdx               → /systems/             (systems overview)
├── conventions.mdx                 → /conventions/
└── systems/
    └── example-system-a/           → /systems/example-system-a/
        ├── _category_.json         label + position of the system in the sidebar
        ├── index.mdx               the system landing page
        ├── 01-introduction-and-goals/
        │   ├── _category_.json
        │   ├── index.mdx           → /systems/example-system-a/introduction-and-goals/
        │   └── stakeholder-goals.mdx
        ├── 02-architecture-constraints.mdx   → …/architecture-constraints/
        ├── …
        └── components/
            ├── _category_.json     label "Components", position 13 (after 12. Glossary)
            ├── index.mdx
            └── example-component-a/
                ├── _category_.json
                ├── index.mdx
                ├── 01-introduction-and-goals.mdx
                └── …
```

Three conventions do the work:

1. **`NN-` prefixes order the navigation and are stripped from the URL.** `05-building-block-view/`
   publishes as `…/building-block-view/`. arc42 order is preserved in the sidebar and in the
   previous/next navigation without appearing in any link.
2. **`index.mdx` inside a folder becomes that folder's landing page.** This is why a system or a
   component has a useful landing page *without* a separate `Overview` item in the sidebar.
3. **An arc42 section is a file until it needs children, then a folder.**
   `02-architecture-constraints.mdx` and `02-architecture-constraints/index.mdx` publish at the same
   URL, so a section can gain child pages without any link breaking.

`_category_.json` carries the sidebar label and position for a folder; `sidebar_position` in a
page's frontmatter places it among its siblings.

## Generated, custom and mixed content

| Badge | Meaning |
| --- | --- |
| `Generated` | Produced by a documentation generator from source code, API contracts, schemas or deployment descriptors. Manual edits would be overwritten on the next run. |
| `Custom` | Written and maintained by hand by the owning team. Never touched by a generator. |
| `Mixed` | A page that combines both: manually written explanation around one or more generated blocks. |

Every page declares what it is with a single component at the top:

```mdx
<DocHeader
  system="example-system-a"
  component="example-component-a"
  section="runtime-view"
  status="mixed"
  generated={{
    generator: 'bazg-archdoc 0.7.2',
    sourceRepo: 'git.example.admin.ch/bazg-proto/declaration-intake-service',
    revision: '9c1e40d',
    generatedAt: '2026-08-04 03:12 UTC',
    scope: 'Reaction graph and the reaction table',
  }}
  custom={{owner: 'Team Alpha — Declaration Squad', lastReviewed: '2026-07-30', reviewStatus: 'Reviewed'}}
/>
```

`DocHeader` renders the contextual header (system → component → arc42 section), the status badge and
the provenance/ownership panels. It reads the system and component catalogue in `src/data/`, so
names and teams cannot drift apart between pages.

Generated blocks inside a mixed page are framed with `<Diagram>` (or a generated table component),
which keeps the boundary between hand-written explanation and generated output visible.

### Reusable components

Registered globally in `src/theme/MDXComponents.tsx`, so no MDX file needs an import:

| Component | Purpose |
| --- | --- |
| `<StatusBadge status="generated\|custom\|mixed" />` | The documentation status badge |
| `<GeneratedMeta … />` | Generated-content provenance panel |
| `<CustomMeta … />` | Custom-content ownership panel |
| `<DocHeader … />` | Contextual page header, composes the three above |
| `<SystemCard id="…" />` | System card |
| `<ComponentCard system="…" component="…" />` | Component card |
| `<CardGrid>` | Responsive card grid |
| `<Arc42SectionNav system="…" component="…" />` | The twelve arc42 section links |
| `<Diagram title="…" status="…" source="…">` | Framed, scrollable diagram/table container |
| `<MessagingCatalogue system="…" component="…" />` | Generated message catalogue |
| `<Msg system="…" component="…" name="…" />` | Inline link to one catalogue entry |
| `<RelatedDocs items={[…]} />` | Related-document links |
| `<ContentLegend />`, `<StatsRow />` | Landing-page legend and counts |
| `<PrototypeNotice />` | Standing "this content is fictional" notice |

The data behind them lives in `src/data/`: `catalog.ts` (systems and components), `arc42.ts` (the
twelve sections), `messaging.ts` (message catalogues), `sectionStatus.ts` (per-section status).
Page counts on the landing page and on the cards are read from the docs plugin's own route data
(`src/data/useDocsStats.ts`), so they stay correct as documentation is added.

## How to add a system

1. Create `docs/systems/<system-id>/`.
2. Add `_category_.json`:

   ```json
   {"label": "Example System C", "position": 3}
   ```

3. Add `index.mdx` — the landing page. Use `<DocHeader>`, `<Arc42SectionNav>` and `<CardGrid>` with
   `<ComponentCard>`s; copy `docs/systems/example-system-a/index.mdx` as a starting point.
4. Add the twelve arc42 sections as `01-introduction-and-goals.mdx` … `12-glossary.mdx`.
5. Register the system in `src/data/catalog.ts` (`SYSTEMS`) so cards, landing pages and contextual
   headers know about it, and in `src/data/sectionStatus.ts` if the per-section badges should differ
   from the default.

Nothing else — the sidebar picks it up automatically.

## How to add a component

1. Create `docs/systems/<system-id>/components/<component-id>/`.
2. Add `_category_.json` with the label and position.
3. Add `index.mdx` and the twelve arc42 section files, exactly as for a system.
4. Add the component to the owning system's `components` array in `src/data/catalog.ts`, and — if it
   publishes messages — a catalogue entry in `src/data/messaging.ts`.
5. Link it from the system's `05-building-block-view.mdx` (a `<ComponentCard>` and a row in the
   component table).

## How to add custom documentation beneath a specific arc42 section

The section must be a **folder**. If it is currently a single file, convert it:

```bash
cd docs/systems/example-system-a
mkdir 06-runtime-view
git mv 06-runtime-view.mdx 06-runtime-view/index.mdx
printf '{"label": "6. Runtime View", "position": 6}\n' > 06-runtime-view/_category_.json
```

The URL does not change. Then drop the new page next to `index.mdx`:

```text
docs/systems/example-system-a/06-runtime-view/
├── _category_.json
├── index.mdx                    ← the arc42 section itself
└── my-new-scenario.mdx          ← the custom page
```

with frontmatter that places it among its siblings:

```yaml
---
title: My New Scenario
sidebar_label: My New Scenario
sidebar_position: 2
---
```

Give the `index.mdx` of the section `sidebar_position: 0` so the section itself stays first.

### Concise examples

**Beneath a system's Crosscutting Concerns** →
`/systems/example-system-a/crosscutting-concerns/disaster-recovery/`

```text
docs/systems/example-system-a/08-crosscutting-concerns/disaster-recovery.mdx
```

**Beneath a component's Runtime View** →
`/systems/example-system-a/components/example-component-a/runtime-view/bulk-import-scenario/`

```text
docs/systems/example-system-a/components/example-component-a/06-runtime-view/bulk-import-scenario.mdx
```

**Beneath a component's Architecture Decisions** →
`/systems/example-system-a/components/example-component-a/architecture-decisions/adr-0002-schema-registry/`

```text
docs/systems/example-system-a/components/example-component-a/09-architecture-decisions/adr-0002-schema-registry.mdx
```

In all three cases, creating the file is the only step. To place a custom page **between** two
generated pages, give it the `sidebar_position` that belongs between theirs — this is what
`08-crosscutting-concerns/integration-conventions.mdx` (position 2, between the generated
*Messaging Events and Commands* at 1 and the generated *Observability* at 3) demonstrates.

## How to add a new Crosscutting Concern

1. Decide whether it really is crosscutting. If it is an operational scenario it belongs under
   `6. Runtime View`; if it is a decision, under `9. Architecture Decisions`; if it is a constraint,
   under `2. Architecture Constraints`. Only concepts that apply across building blocks go here.
2. Add the file to `08-crosscutting-concerns/` of the system or the component:

   ```text
   docs/systems/example-system-a/08-crosscutting-concerns/data-retention.mdx
   ```

3. Frontmatter:

   ```yaml
   ---
   title: Data Retention
   sidebar_label: Data Retention
   sidebar_position: 4
   description: Custom crosscutting concept — retention periods and erasure for Example System A.
   ---
   ```

4. Start the page with `<DocHeader … section="crosscutting-concerns" status="custom" custom={{…}} />`.
5. Add a row to the table on the section's `index.mdx`, and a `<RelatedDocs>` entry wherever the new
   concept is relevant. Dead ends are the one thing this prototype tries hardest to avoid.

## How generated pages are expected to be replaced

The generator is expected to own whole files and to leave everything else alone:

- it writes the generated `.mdx` pages (context diagrams, component views, reaction graphs, message
  catalogues, observability inventories) and the catalogue data under `src/data/`;
- it never edits a page marked `status="custom"`;
- on a **mixed** page the hand-written prose lives in the page and the generated part is a framed
  block, so a future generator replaces the block rather than the page;
- it does not touch `sidebars.ts` — the information architecture comes from the folder layout, so
  adding, replacing or removing generated pages never requires a navigation change.

A full content-merging or documentation-generation engine is deliberately out of scope for this
prototype.

## GitHub Pages deployment

Two workflows:

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `.github/workflows/deploy.yml` | push to `main`, `workflow_dispatch` | `npm ci` → `npm run typecheck` → `npm run build` → upload `build/` as a Pages artifact → deploy with `actions/deploy-pages` |
| `.github/workflows/pull-request.yml` | pull request to `main`, `workflow_dispatch` | the same production build, **without** deploying |

The deployment uses the official GitHub Pages actions with `pages: write` and `id-token: write`
(OIDC) permissions and the `github-pages` environment. **No personal access token is required.** A
`github-pages` concurrency group prevents overlapping deployments.

### One-time manual setting

In the repository: **Settings → Pages → Build and deployment → Source → GitHub Actions.**

Without this, the workflow fails at the `actions/configure-pages` step. Nothing else has to be
configured — no `gh-pages` branch, no secret, no token.

### Expected published URL

<https://matf.github.io/docs-site-prototype/>

The matching configuration in `docusaurus.config.ts`:

```ts
url: 'https://matf.github.io',
baseUrl: '/docs-site-prototype/',
organizationName: 'matf',
projectName: 'docs-site-prototype',
trailingSlash: true,
```

`trailingSlash: true` makes every route emit `<route>/index.html`, which is what GitHub Pages serves
most reliably from a project sub-path. `static/.nojekyll` stops GitHub from running Jekyll over the
build output, which would otherwise drop files and folders beginning with an underscore.

## Repository layout

```text
.github/workflows/       deployment and pull-request validation
docs/                    the documentation tree (the site content)
src/components/          reusable presentation components
src/data/                system/component catalogue, arc42 sections, messaging catalogues
src/theme/               MDXComponents.tsx — makes the components globally available in MDX
src/css/custom.css       the design tokens and theme
static/                  .nojekyll and the placeholder SVG assets
docusaurus.config.ts     site configuration
sidebars.ts              the single hierarchical sidebar, rooted at Systems
```

## Out of scope

No authentication, no authorisation, no CMS, no architecture-repository integration, no code
analysis, no backend, no multi-repository aggregation and no externally hosted search. The site is
static.
