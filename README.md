# Acme System Documentation — website prototype

A working prototype of the **Acme system documentation portal**: one documentation tree for every
system and every component, structured directly according to **arc42**, with generated and
manually maintained documentation shown side by side.

**Published site:** <https://matf.github.io/docs-site-prototype/> (production; use the environment
switcher in the header for DEV, REF and ABN)

> **Prototype content.** All systems, components, teams, decisions, message contracts, metrics and
> metadata in this repository are fictional. They exist to demonstrate the navigation model and are
> **not** the architecture information of any real organisation. No official branding assets are used — the mark in the
> navbar is a neutral placeholder.

**Full specification:** [`docs/spec.md`](docs/spec.md) — the information architecture, the content
rules and the open points, written to be shared with a team.

## Purpose

This is primarily a **UX and information-architecture prototype**, not a documentation-generation
backend. It demonstrates:

- **one documentation tree per environment** — DEV, REF, ABN and PROD — with production served at
  the site root and the others behind `/dev/`, `/ref/` and `/abn/`, so a shared link always opens
  the environment it points at;
- one coherent documentation tree, rooted at `Systems`;
- a **documentation structure** level below each system and component — `System Architecture`
  (arc42, shown as `Component Architecture` below a component) and `Specification Docs` (BMAD) —
  present in the navigation and in the URL, so a system can carry several methodologies at once;
- the methodology's sections starting **directly** beneath the structure, with no intermediate
  `Overview` or `Other Topics` navigation node;
- generated documentation (context diagrams, component views, reaction graphs, messaging
  catalogues, observability inventories) integrated into the arc42 section it belongs to;
- custom documentation insertable at any level of the arc42 structure;
- a page-level `Generated` / `Custom` labelling with provenance and ownership metadata — a page
  has exactly one origin, never both;
- arc42 sections that only exist when they have content, with no empty placeholder pages;
- navigation between systems, components, arc42 sections, generated content and custom content;
- automatic deployment to GitHub Pages.

The "generated" pages are realistic samples with the structure a generator would produce. A future
generator can replace them without touching the site's information architecture — see
[How generated pages are expected to be replaced](#how-generated-pages-are-expected-to-be-replaced).

## Environments

The same documentation is published four times, once per environment:

| Environment | Route | Reflects |
| --- | --- | --- |
| DEV | `/dev/…` | HEAD of every component repository, architecture repository state on DEV |
| REF | `/ref/…` | The integration baseline |
| ABN | `/abn/…` | The release candidate under acceptance |
| **PROD** | `/…` | The released revision running in production — **the default** |

Production is served at the root, so its URLs are canonical and unchanged. Every tree describes the
state of *that* environment and nothing else: which components are deployed there, which revision
each generated page came from, which version a contract is at. There is deliberately no comparison
view — to see a difference, switch environments and look.

Non-production trees carry a banner and are excluded from search engines. They are public, but they
are not the canonical documentation.

### Authoring once, publishing four times

```text
content/
├── environments.json       the four environments and what each reflects
├── base/                   authored once, shared by every environment
└── overrides/<env>/        what differs on that environment
docs-build/<env>/           composed by `npm run prepare-docs`; generated, git-ignored
```

Composition is a copy of `base` followed by an overlay of `overrides/<env>`. A file in the
overrides replaces the file at the same path; a file that exists **only** in an override exists
only on that environment. That is the whole model — which is how *Example Component D* is deployed
on DEV and absent everywhere else, with no exclusion lists to maintain.

Consequence worth knowing: a shared page cannot link to an environment-specific page, because that
link would be broken in every other tree. The build enforces it — broken links fail the build.

### Links stay inside the environment

Pages are shared, so their links are written environment-relative (`/systems/…`). Two mechanisms
add the prefix, and nothing else in the repository has to know about environments:

- `plugins/remark-env-links/` rewrites Markdown links, configured per docs instance;
- `src/components/EnvLink` does the same for everything rendered from JSX, including the navbar,
  the footer, the breadcrumb home and the sidebar cards.

### What differs per environment in this prototype

| Difference | Where to see it |
| --- | --- |
| A component deployed on DEV only | `Example Component D` under `Components`, and the extra block in System A's building block view on DEV |
| Source revision and generation timestamp | The generation metadata panel on any generated page |
| Contract consumers | `DeclarationCleared` lists Component D as a consumer on DEV only |
| Deployment topology and sizing | System A's deployment view: one replica and a single site on DEV, two data centres elsewhere |

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

The environment trees are composed automatically before `start`, `build` and `typecheck`. To do it
on its own:

```bash
npm run prepare-docs
```

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

Writes the static site to `build/` — all four environment trees in a single build, which is what
makes cross-environment link checking possible. The build **fails** on a broken internal link, a
broken anchor, a broken Markdown link, a broken Markdown image or a duplicate route — see `onBrokenLinks`,
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
│   ├── System Architecture                        ← arc42
│   │   ├── 1. Introduction and Goals
│   │   │   └── Stakeholder Goals                  ← custom page below a section
│   │   ├── 2. Architecture Constraints
│   │   ├── 3. Context and Scope
│   │   │   └── Scope and Boundaries               ← custom, next to the generated diagram
│   │   ├── 4. Solution Strategy
│   │   ├── 5. Building Block View                 ← the decomposition lives here
│   │   │   ├── Decomposition Rationale            ← custom
│   │   │   ├── Components
│   │   │   │   ├── Example Component A            ← a component is a building block
│   │   │   │   │   └── Component Architecture
│   │   │   │   │       ├── 1. Introduction and Goals
│   │   │   │   │       ├── … (all twelve arc42 sections)
│   │   │   │   │       └── 8. Crosscutting Concerns
│   │   │   │   │           ├── Integration Conventions    (custom)
│   │   │   │   │           ├── Observability              (generated)
│   │   │   │   │           └── Security                   (custom)
│   │   │   │   └── Example Component B
│   │   │   ├── Events                             ← one generated page per contract
│   │   │   │   ├── DeclarationAccepted
│   │   │   │   └── …
│   │   │   └── Commands
│   │   │       ├── SubmitDeclaration
│   │   │       └── …
│   │   ├── 6. Runtime View
│   │   │   ├── Correction Race Scenario           ← custom
│   │   │   └── Peak Load and Degradation          ← custom
│   │   ├── 7. Deployment View
│   │   ├── 8. Crosscutting Concerns
│   │   ├── 9. Architecture Decisions
│   │   ├── 10. Quality Requirements
│   │   ├── 11. Risks and Technical Debt
│   │   └── 12. Glossary
│   │       └── Technical Terms                    ← generated, next to the custom glossary
│   └── Specification Docs                         ← BMAD
│       ├── 1. Project Brief
│       ├── 2. Product Requirements
│       │   └── Functional Requirements
│       ├── 3. Architecture                        ← defers to the arc42 description
│       ├── 4. Epics
│       ├── 5. Stories
│       └── 6. Quality and Test Strategy
└── Example System B                               ← System Architecture only
    └── System Architecture                        ← 9 of 12 sections documented
        ├── 1. Introduction and Goals
        ├── 2. Architecture Constraints
        ├── 3. Context and Scope
        ├── 5. Building Block View                 ← 4. Solution Strategy has no content,
        │   ├── Components                            so it does not exist and is not shown
        │   │   └── Example Component C
        │   ├── Events
        │   └── Commands
        ├── 6. Runtime View
        └── …
```

Four rules matter:

- **The documentation structure is a level of its own.** A system or component may carry several
  methodologies at the same time; each gets its own URL segment and its own sidebar node. Adding one
  means adding an entry to `src/data/structures.ts` and a folder — no navigation code changes.
  A structure is named for its context: the arc42 structure is *System Architecture* below a system
  (`system-architecture/`) and *Component Architecture* below a component
  (`component-architecture/`).
- **A component lives inside the system's `5. Building Block View`.** That section describes how
  the system is decomposed, and a component is one of the blocks — so the block, its documentation
  and the contracts between the blocks are all in one place. The section groups its children by
  kind: `Components`, `Events`, `Commands`, in that order. The group is a folder, so the kind
  appears in the navigation and in the URL.
- **Custom documentation is filed under the arc42 section it belongs to.** There is no generic
  catch-all category. In most cases the right home is `8. Crosscutting Concerns`; an operational
  scenario belongs under `6. Runtime View`, an ADR under `9. Architecture Decisions`.
- **Events and commands are documented per system, not per component.** A contract is shared by
  several components and outlives all of them, so each event and each command gets its own
  generated page directly below the system's `5. Building Block View` — the section that describes
  how the building blocks fit together and therefore what flows between them. A component page
  shows only *which* messages it consumes and publishes, linking to the system's contract pages.
- **A section exists only if it has content.** The twelve arc42 sections are a checklist, not a
  quota. A component always has `3. Context and Scope`, `5. Building Block View` and
  `6. Runtime View` — those three say what it is and what it does, and all three are generated.
  Everything else appears only when there is something to say. There are no empty or
  "to be written" placeholder pages anywhere; the gaps in the numbering are the only signal, and
  that is deliberate. Deleting a section file removes it from the navigation and from the section
  lists on the landing pages — nothing else has to be updated.

### Filesystem layout and how it becomes navigation

The sidebar is autogenerated from the filesystem (`sidebars.ts` contains one `autogenerated` entry
for `content/base/systems`), so **adding a file to the right folder is enough** to add it to the
navigation.

```text
content/base/
├── index.mdx                          → /                  (start page)
├── systems-index.mdx                  → /systems/          (systems overview)
├── conventions.mdx                    → /conventions/
└── systems/
    └── example-system-a/              → /systems/example-system-a/
        ├── _category_.json            label + position of the system in the sidebar
        ├── index.mdx                  the system landing page
        ├── system-architecture/       → /systems/example-system-a/system-architecture/
        │   ├── _category_.json        label "System Architecture", position 1
        │   ├── index.mdx              the structure landing page
        │   ├── 01-introduction-and-goals/
        │   │   ├── _category_.json
        │   │   ├── index.mdx          → …/system-architecture/introduction-and-goals/
        │   │   └── stakeholder-goals.mdx
        │   ├── 02-architecture-constraints.mdx
        │   └── …
        ├── specs-docs/                → /systems/example-system-a/specs-docs/
        │   ├── _category_.json        label "Specification Docs", position 2
        │   ├── index.mdx
        │   ├── 01-project-brief.mdx
        │   └── …
        │   ├── 05-building-block-view/
        │   │   ├── _category_.json
        │   │   ├── index.mdx              the decomposition and the contract catalogue
        │   │   ├── decomposition-rationale.mdx
        │   │   ├── components/            _category_.json position 2
        │   │   │   └── example-component-a/
        │   │   │       ├── _category_.json
        │   │   │       ├── index.mdx
        │   │   │       └── component-architecture/
        │   │   │           ├── _category_.json label "Component Architecture"
        │   │   │           ├── index.mdx
        │   │   │           ├── 01-introduction-and-goals.mdx
        │   │   │           └── …
        │   │   ├── events/                _category_.json position 3
        │   │   │   └── declaration-accepted.mdx
        │   │   └── commands/              _category_.json position 4
        │   │       └── submit-declaration.mdx
        │   └── …
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

## Generated and custom content

A page has exactly **one** origin. There is no "mixed" — a page that would be half generated is
split into two pages.

| Badge | Meaning |
| --- | --- |
| `Generated` | The whole page is produced by a documentation generator from source code, API contracts, schemas or deployment descriptors. Manual edits are overwritten on the next run. |
| `Custom` | The whole page is written and maintained by hand by the owning team. No generator ever writes to it. |

The origin is declared once, in the page's frontmatter:

```yaml
---
title: 5. Building Block View
sidebar_label: 5. Building Block View
sidebar_position: 0
doc_status: generated      # or: custom
---
```

`doc_status` is the single source of truth. `<DocHeader>` reads it to render the badge, and the
build-time plugin in `plugins/doc-status/` reads it to build the navigation — so the sidebar, the
section lists, the badges and the page counts can never disagree with the page itself. An invalid
value fails the build.

```mdx
<DocHeader
  system="example-system-a"
  component="example-component-a"
  section="building-block-view"
  generated={{
    generator: 'acme-archdoc 0.7.2',
    sourceRepo: 'git.example.com/acme-proto/declaration-intake-service',
    revision: '9c1e40d',
    generatedAt: '2026-08-04 03:12 UTC',
    scope: 'Whole page — internal component view and the building block table',
  }}
/>
```

`DocHeader` renders the contextual header (system → component → arc42 section), the badge and the
provenance/ownership panel. It reads the system and component catalogue in `src/data/`, so names
and teams cannot drift apart between pages.

### When a generated artefact needs a hand-written explanation

Write a second page. The generated artefact keeps the arc42 section route; the explanation becomes
a custom page directly beneath it:

```text
05-building-block-view/
├── _category_.json
├── index.mdx           doc_status: generated   the component view
└── design-notes.mdx    doc_status: custom      why it is shaped that way
```

This is what makes regeneration safe: the generator replaces whole files and never has to merge
into somebody's prose. The pattern is used throughout — `context-and-scope/scope-notes`,
`building-block-view/design-notes`, `runtime-view/correction-race`, `glossary/technical-terms`.

Because a *set* of pages has no single origin, systems and components do not carry an aggregate
badge. They show counts instead: `<DocMix system="…" component="…" />` renders
"7 generated · 15 custom".

### Reusable components

Registered globally in `src/theme/MDXComponents.tsx`, so no MDX file needs an import:

| Component | Purpose |
| --- | --- |
| `<StatusBadge status="generated\|custom" />` | The documentation origin badge |
| `<GeneratedMeta … />` | Generated-content provenance panel |
| `<CustomMeta … />` | Custom-content ownership panel |
| `<DocHeader … />` | Contextual page header, composes the three above |
| `<SystemCard id="…" />` | System card |
| `<ComponentCard system="…" component="…" />` | Component card |
| `<CardGrid>` | Responsive card grid |
| `<SectionNav system="…" component="…" structure="…" />` | Links to the sections of one structure that exist, with a coverage line |
| `<StructureCards system="…" component="…" />` | The documentation structures an entity carries |
| `<StructureLink system="…" structure="…" />` | Inline link to a structure |
| `<DocMix system="…" component="…" />` | Generated/custom page counts for a system or component |
| `<Diagram title="…" status="…" source="…">` | Framed, scrollable diagram/table container |
| `<MessagingCatalogue system="…" />` | Generated catalogue of a system's events and commands |
| `<ComponentMessages system="…" component="…" />` | The subset one component consumes and publishes |
| `<MessageDetail system="…" name="…" />` | The full contract page for one event or command |
| `<Msg system="…" name="…" />` | Inline link to one contract |
| `<RelatedDocs items={[…]} />` | Related-document links |
| `<ContentLegend />`, `<StatsRow />` | Landing-page legend and counts |
| `<PrototypeNotice />` | Standing "this content is fictional" notice |

The data behind them lives in `src/data/`: `catalog.ts` (systems and components), `arc42.ts` (the
twelve canonical sections), `structures.ts` (the methodologies and their sections), `messaging.ts` (the per-system contract catalogues). Which sections actually exist and
what each page's origin is comes from `src/data/useDocsStatus.ts`, which reads the global data
produced by `plugins/doc-status/` — so section lists, badges and counts stay correct as
documentation is added or removed, with nothing to maintain by hand.

## How to add a system

1. Create `content/base/systems/<system-id>/`.
2. Add `_category_.json`:

   ```json
   {"label": "Example System C", "position": 3}
   ```

3. Add `index.mdx` — the landing page. Use `<DocHeader>`, `<Arc42SectionNav>` and `<CardGrid>` with
   `<ComponentCard>`s; copy `content/base/systems/example-system-a/index.mdx` as a starting point.
4. Add a `system-architecture/` folder with its `_category_.json` (`{"label": "System Architecture", "position": 1}`), an `index.mdx` carrying `<SectionNav>`, and the arc42 sections as `01-introduction-and-goals.mdx` … `12-glossary.mdx`. Add a `specs-docs/` folder the same way if the system has BMAD specifications.
5. Register the system in `src/data/catalog.ts` (`SYSTEMS`) so cards, landing pages and contextual
   headers know about it, and in `src/data/sectionStatus.ts` if the per-section badges should differ
   from the default.

Nothing else — the sidebar picks it up automatically.

## How to add a component

1. Create `content/base/systems/<system-id>/system-architecture/05-building-block-view/components/<component-id>/`
   — a component is a building block, so it lives inside the section that describes the
   decomposition, in the `components/` group.
2. Add `_category_.json` with the label and position.
3. Add `index.mdx`, then a `component-architecture/` folder with its own `index.mdx` and section files, exactly as for a system. Its `_category_.json` label is `Component Architecture`.
4. Add the component to the owning system's `components` array in `src/data/catalog.ts`. If it
   publishes or consumes messages, name it as producer or consumer on the relevant contracts in
   `src/data/messaging.ts` — the contracts themselves belong to the system, not to the component.
5. Link it from the system's `05-building-block-view.mdx` (a `<ComponentCard>` and a row in the
   component table).

## How to add an event or a command

Contracts are per system. Add the entry to the system's catalogue in `src/data/messaging.ts`
(name, `slug`, kind, channel, schema, version, producer, consumers, ordering key, retention,
payload fields, example, optional version history), then add the page:

```text
content/base/systems/example-system-a/system-architecture/05-building-block-view/events/<slug>.mdx
# or commands/<slug>.mdx
```

```mdx
---
title: DeclarationAccepted
sidebar_label: DeclarationAccepted
sidebar_position: 6
doc_status: generated
---

# DeclarationAccepted

<DocHeader system="example-system-a" section="building-block-view" generated={{…}} />

<MessageDetail system="example-system-a" name="DeclarationAccepted" />

<MessageRelated system="example-system-a" name="DeclarationAccepted" />
```

The page is three components long because it is entirely generated output; everything it shows
comes from the catalogue entry. The catalogue table on the section index, the per-component
message lists and every inline `<Msg …/>` pick the new contract up automatically.

## How to add custom documentation beneath a specific arc42 section

The section must be a **folder**. If it is currently a single file, convert it:

```bash
cd content/base/systems/example-system-a/system-architecture
mkdir 06-runtime-view
git mv 06-runtime-view.mdx 06-runtime-view/index.mdx
printf '{"label": "6. Runtime View", "position": 6}\n' > 06-runtime-view/_category_.json
```

The URL does not change. Then drop the new page next to `index.mdx`:

```text
content/base/systems/example-system-a/system-architecture/06-runtime-view/
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
`/systems/example-system-a/system-architecture/crosscutting-concerns/disaster-recovery/`

```text
content/base/systems/example-system-a/system-architecture/08-crosscutting-concerns/disaster-recovery.mdx
```

**Beneath a component's Runtime View** →
`/systems/example-system-a/system-architecture/building-block-view/components/example-component-a/component-architecture/runtime-view/bulk-import-scenario/`

```text
content/base/systems/example-system-a/system-architecture/05-building-block-view/components/example-component-a/component-architecture/06-runtime-view/bulk-import-scenario.mdx
```

**Beneath a component's Architecture Decisions** →
`/systems/example-system-a/system-architecture/building-block-view/components/example-component-a/component-architecture/architecture-decisions/adr-0002-schema-registry/`

```text
content/base/systems/example-system-a/system-architecture/05-building-block-view/components/example-component-a/component-architecture/09-architecture-decisions/adr-0002-schema-registry.mdx
```

**Beneath a system's Product Requirements (BMAD)** →
`/systems/example-system-a/specs-docs/product-requirements/reporting-requirements/`

```text
content/base/systems/example-system-a/specs-docs/02-product-requirements/reporting-requirements.mdx
```

In every case, creating the file is the only step — the mechanism does not care which methodology
the structure follows. To place a custom page **between** two generated pages, give it the
`sidebar_position` that belongs between theirs, as
`system-architecture/08-crosscutting-concerns/integration-conventions.mdx` does.

## How to add a new Crosscutting Concern

1. Decide whether it really is crosscutting. If it is an operational scenario it belongs under
   `6. Runtime View`; if it is a decision, under `9. Architecture Decisions`; if it is a constraint,
   under `2. Architecture Constraints`. Only concepts that apply across building blocks go here.
2. Add the file to `system-architecture/08-crosscutting-concerns/` of the system or the component:

   ```text
   content/base/systems/example-system-a/system-architecture/08-crosscutting-concerns/data-retention.mdx
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
- it owns whole files: a generated page is regenerated in full, never merged into, and a page
  whose frontmatter says `doc_status: custom` is never touched;
- it may delete a generated page when the artefact behind it disappears — that section then stops
  appearing in the navigation, which is the correct outcome;
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
docs/spec.md               the specification of this site
content/environments.json  the four environments
content/base/              the shared documentation tree (the site content)
content/overrides/<env>/   what differs on one environment
docs-build/<env>/          composed trees; generated, git-ignored
scripts/prepare-docs.mjs   the composition step
plugins/remark-env-links/  keeps Markdown links inside their environment
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
