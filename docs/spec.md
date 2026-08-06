# BAZG System Documentation — specification

Specification of the documentation site: what it is for, how it is organised, and the rules that
keep it consistent. Written to be shared with the team and adapted.

**Status:** prototype, implemented and published at <https://matf.github.io/docs-site-prototype/>.
All sample content in the repository is fictional.

---

## 1. Purpose and scope

### 1.1 What this site is

A single portal for the architecture and specification documentation of BAZG systems and their
components. It brings together documentation that is **generated** from source artefacts and
documentation that is **written by hand**, presents both in one navigable tree, and always says
which is which.

### 1.2 What it is for

| Reader | Comes to find |
| --- | --- |
| Architect | How a system is structured, which decisions produced it, what it talks to |
| Developer joining a team | What a component does, which messages it handles, how it behaves at runtime |
| Operations | Deployment topology, observability signals, runbooks and failure scenarios |
| Product owner / specialist unit | What is being built and why — requirements, epics, stories |
| Auditor / reviewer | Decisions, quality scenarios, and the state of a specific environment |

### 1.3 Out of scope

Authentication, authorisation, a CMS, a real architecture-repository integration, a real
code-analysis generator, backend APIs, multi-repository aggregation, and externally hosted search.
The site is static.

### 1.4 Non-goals worth stating

- **Not a comparison tool.** Each environment tree describes one environment. To compare, switch
  and look.
- **Not a wiki.** Every page has an owner and a defined origin; there is no free-form space.
- **Not a merge engine.** Generated and hand-written content live in separate files, never merged.

---

## 2. Information architecture

### 2.1 The four levels

```text
Systems
└── <System>                         a deployable system
    ├── <Documentation structure>    the methodology (arc42, BMAD, …)
    │   └── <Section>                a chapter of that methodology
    │       └── <Child page>         detail filed under that chapter
    └── Components
        └── <Component>              a deployable part of the system
            └── <Documentation structure>
                └── <Section>
```

Each level is a URL segment and a sidebar node:

```text
/systems/example-system-a/
/systems/example-system-a/system-architecture/
/systems/example-system-a/system-architecture/building-block-view/
/systems/example-system-a/system-architecture/building-block-view/declaration-accepted/
/systems/example-system-a/components/example-component-a/system-architecture/runtime-view/
/systems/example-system-a/specs-docs/stories/story-1-1-submit-declaration/
```

There are **no intermediate navigation nodes** — no `Overview`, no `arc42`, no `Other Topics`. A
category's landing page is reached by clicking the category itself.

### 2.2 Documentation structures

A system is not documented in one fixed way. Different methodologies produce different chapter
sets, and a system may carry several at once.

| Structure | Methodology | URL segment | Applies to |
| --- | --- | --- | --- |
| System Architecture | arc42 | `system-architecture` | systems and components |
| Specification Docs | BMAD | `specs-docs` | systems |

**System Architecture** (arc42) answers *how the system is built*: introduction and goals,
architecture constraints, context and scope, solution strategy, building block view, runtime view,
deployment view, crosscutting concerns, architecture decisions, quality requirements, risks and
technical debt, glossary.

**Specification Docs** (BMAD) answers *what is to be built and why*: project brief, product
requirements, architecture, epics, stories, quality and test strategy.

The two are deliberately not merged. They have different authors, different review cycles and
different lifetimes, and a reader almost always wants one or the other rather than both
interleaved. Where they touch, they link: the BMAD *Architecture* section is a short page mapping
requirements to their realisation and deferring to the arc42 description rather than duplicating
it.

Adding a methodology means adding an entry to `src/data/structures.ts` and a folder in the content
tree. No navigation code changes.

### 2.3 Components are a sibling of the structures

`Components` sits next to the documentation structures, not inside `5. Building Block View`. The
system's building block view **describes and links** its components; the component documentation
lives one level down, where it has room for its own structures and sections.

### 2.4 A node exists only when it has content

The twelve arc42 sections are a checklist, not a quota. A section with nothing to say does not get
a placeholder page — it does not exist, and the navigation does not show it. The same applies to
documentation structures and to components.

A component always has **3. Context and Scope**, **5. Building Block View** and **6. Runtime
View**: those three say what it is and what it does, and all three are generated. Everything else
appears only when there is something to say.

Gaps in the numbering are the only signal that a section is missing. That is deliberate: an empty
chapter claims there is content and there is not.

**Rule:** deleting a page removes it from the sidebar, from the section lists on landing pages and
from the page counts. Nothing else has to be updated.

### 2.5 Events and commands belong to the system

A message contract is not owned by the component that publishes it. Several components produce and
consume the same contract, and the contract outlives all of them. Contracts are therefore
documented **per system**, one page per event or command, directly below the system's
*5. Building Block View* — the section that describes how the building blocks fit together and
therefore what flows between them.

Commands are listed before events. Each contract page is fully generated: producer, consumers,
channel, schema and version, ordering key, retention, payload fields, an example and the version
history.

A component page never repeats a contract. It shows only *which* of the system's messages it
consumes and publishes, with every name linking to the contract page.

---

## 3. Content origin

### 3.1 Two values, never three

A page has exactly **one** origin.

| Badge | Meaning |
| --- | --- |
| `Generated` | The whole page is produced by a generator from source code, API contracts, schemas or deployment descriptors. Manual edits are overwritten on the next run. |
| `Custom` | The whole page is written and maintained by hand by the owning team. No generator ever writes to it. |

There is no "mixed". A page that would be half generated is **two pages**.

### 3.2 When a generated artefact needs explanation

The generated artefact keeps the section route; the hand-written explanation becomes a custom page
directly beneath it:

```text
system-architecture/05-building-block-view/
├── index.mdx           doc_status: generated   the component view
└── design-notes.mdx    doc_status: custom      why it is shaped that way
```

This is what makes regeneration safe: a generator replaces whole files and never merges into
somebody's prose.

Existing pairs: `context-and-scope/scope-notes`, `building-block-view/design-notes`,
`runtime-view/correction-race`, `glossary/technical-terms`,
`crosscutting-concerns/concept-coverage`.

### 3.3 Declaring the origin

Once, in the page's frontmatter:

```yaml
---
title: 5. Building Block View
sidebar_label: 5. Building Block View
sidebar_position: 0
doc_status: generated      # or: custom
---
```

`doc_status` is the single source of truth. `DocHeader` reads it to render the badge; the
build-time plugin `plugins/doc-status/` reads it to build the navigation. The sidebar, the section
lists, the badges and the page counts therefore cannot disagree with the page. An invalid value
fails the build.

### 3.4 Metadata each origin carries

**Generated pages** show environment, generator and version, source repository, source revision,
generation timestamp, owning team, and what exactly was generated.

**Custom pages** show the owning team or author, the last review date, and a review status.

### 3.5 Aggregates are counts, not a status

A *set* of pages has no single origin, so systems, components and structures do not carry an
aggregate badge. They show counts: "7 generated · 15 custom".

---

## 4. Environments

### 4.1 Four trees

The same documentation is published once per environment.

| Environment | Route | Reflects | Indexed |
| --- | --- | --- | --- |
| DEV | `/dev/…` | HEAD of every component repository, architecture repository state on DEV | no |
| REF | `/ref/…` | The integration baseline | no |
| ABN | `/abn/…` | The release candidate under acceptance | no |
| **PROD** | `/…` | The released revision running in production | yes |

Production is served at the **root**, so its URLs are canonical and stable. It is also the default:
a link shared without a prefix opens production.

Every tree describes the state of *that* environment: which components are deployed there, which
revision each generated page came from, which version a contract is at. Non-production trees carry
a banner and a `noindex` directive. They are public, but they are not the canonical documentation.

### 4.2 Authoring once

```text
content/
├── environments.json       the environments and what each reflects
├── base/                   authored once, shared by every environment
└── overrides/<env>/        what differs on that environment
docs-build/<env>/           composed; generated, git-ignored, never edited
```

Composition (`npm run prepare-docs`) is a copy of `base` followed by an overlay of
`overrides/<env>`. A file in the overrides replaces the file at the same path; a file that exists
**only** in an override exists only on that environment.

That single rule covers presence: a component deployed on DEV and nowhere else simply has its files
under `overrides/dev/`. There are no exclusion lists to maintain.

**Consequence:** a shared page cannot link to an environment-specific page — the link would be
broken in every other tree. The build enforces this, because broken links fail it. A shared page
that needs such a link needs an override of its own, or the link belongs in a component that can
check whether the target exists.

### 4.3 Links stay inside the environment

Pages are shared, so links are authored environment-relative (`/systems/…`). Two mechanisms add the
prefix, and nothing else has to know about environments:

- `plugins/remark-env-links/` rewrites Markdown links, configured per docs plugin instance;
- `src/components/EnvLink` does the same for everything rendered from JSX — cards, related-document
  lists, section navigation, contract links, the navbar, the footer and the breadcrumb home.

### 4.4 Switching

The switcher in the header keeps the reader on the same page, resolving the path against the
**target** environment. When the page does not exist there, it walks up to the nearest ancestor
that does, so it never offers a link into a 404.

### 4.5 What is not solved yet

- Custom pages are shared across environments. Pinning a specific version of a custom page per
  environment is possible through overrides but is not modelled.
- Hiding something that exists in `base` from one environment requires moving it into the overrides
  of the environments that have it. An exclusion manifest would be the next step.

---

## 5. Navigation and user experience

### 5.1 Landing pages

| Page | Shows |
| --- | --- |
| Start page | What the prototype is, environment explanation, system cards, counts, origin legend, structure explanation |
| Systems overview | All systems with team, components, page counts |
| System | Metadata, its documentation structures, its components |
| Documentation structure | The sections that exist, with a coverage line |
| Component | Metadata, its structures, generated artefact links |

A system or component landing page is generated from the catalogue. Structure landing pages are
hand-written.

### 5.2 Sidebar

One hierarchical sidebar rooted at `Systems`, autogenerated from the filesystem. `NN-` prefixes
order it and are stripped from URLs. `index.mdx` in a folder becomes that folder's landing page,
which is why no `Overview` entries exist.

### 5.3 Page context

Every page answers, above the fold: which system, whether system or component, which documentation
structure, which section, which environment, and whether the content is generated or custom.
Breadcrumbs carry the same path:

```text
Systems > Example System A > Components > Example Component A > System Architecture > 6. Runtime View
```

### 5.4 Cross-links

Required links, all of them present:

- system building block view ↔ component documentation
- landing page ↔ its sections
- component building block view ↔ the contracts it handles
- contract ↔ the runtime views of its producer and consumers
- runtime steps ↔ the contracts they involve
- generated page ↔ its custom explanation
- architecture decisions ↔ the sections they affect

**No dead ends.** Every page ends with related documentation.

### 5.5 Previous and next

Retained and ordered by the methodology's own numbering. Custom child pages follow their parent
section.

---

## 6. Visual design

A restrained federal-administration look: light surfaces, dark neutral typography, a single red
accent inspired by Swiss federal visual language, subtle borders rather than shadows, spacious
layout, accessible contrast. Dark mode is supported. Responsive down to 390 px with no horizontal
page scroll; wide tables and diagrams scroll inside their own container.

No official BAZG branding assets are used — the navbar mark is a neutral placeholder.

### 6.1 Reusable components

Available in every MDX file without an import:

| Component | Purpose |
| --- | --- |
| `StatusBadge` | Generated / Custom badge |
| `DocHeader` | Contextual header, badge and provenance panel |
| `GeneratedMeta`, `CustomMeta` | Provenance and ownership panels |
| `SystemCard`, `ComponentCard`, `CardGrid` | Entity cards |
| `StructureCards`, `StructureLink` | Documentation structures of an entity |
| `SectionNav` | Sections of one structure that exist, with a coverage line |
| `Diagram` | Framed, scrollable diagram or generated table |
| `MessagingCatalogue`, `ComponentMessages`, `MessageDetail`, `Msg` | Contract catalogue, per-component subset, contract page, inline reference |
| `DocMix` | Generated/custom page counts |
| `RelatedDocs` | Related-document links |
| `ContentLegend`, `StatsRow`, `PrototypeNotice` | Start-page elements |

---

## 7. Technical realisation

| Concern | Decision |
| --- | --- |
| Generator | Docusaurus 3 (TypeScript, npm), docs-only mode, no blog |
| Hosting | GitHub Pages project site at `/docs-site-prototype/`, `trailingSlash: true`, `static/.nojekyll` |
| Environments | Four `plugin-content-docs` instances in one build |
| Diagrams | Mermaid, in the repository as source |
| Quality gate | Broken links, broken anchors, broken Markdown links and images, and duplicate routes all **fail** the build |
| Deployment | GitHub Actions with the official Pages actions, OIDC, `github-pages` environment, no personal access token |
| Validation | A pull-request workflow runs the same production build without deploying |

### 7.1 Data layer

`src/data/` is the single place that knows what exists:

| File | Holds |
| --- | --- |
| `catalog.ts` | Systems and components, and the path helpers |
| `structures.ts` | The methodologies and their sections |
| `arc42.ts` | The twelve arc42 sections |
| `messaging.ts` | Per-system contract catalogues |
| `environments.ts` | The environments and per-environment source state |
| `useDocsStatus.ts` | What exists and what origin it has, from the published routes |

### 7.2 Expectations of a future generator

- It owns whole files. A generated page is regenerated in full, never merged into.
- It never touches a page whose frontmatter says `doc_status: custom`.
- It may delete a generated page when the artefact disappears; the section then stops appearing.
- It does not touch `sidebars.ts`. The information architecture comes from the folder layout, so
  adding, replacing or removing pages never requires a navigation change.
- It writes the environment trees under `content/`, not the composed output.

---

## 8. Conventions summary

| Rule | Consequence |
| --- | --- |
| One tree, rooted at `Systems` | Everything is reachable from one place |
| Structure is a URL segment | Several methodologies coexist per system |
| `NN-` prefixes order, and are stripped from URLs | Methodology order preserved without ugly links |
| `index.mdx` is the category landing page | No `Overview` nodes |
| A section is a file until it needs children, then a folder | URL unchanged when children are added |
| Custom documentation is filed under the section it belongs to | No catch-all category |
| A page has exactly one origin | Regeneration is safe |
| A node exists only when it has content | No placeholders |
| Contracts belong to the system | One contract, one page, no duplication |
| Links are authored environment-relative | Readers stay in their environment |

---

## 9. Open points

| # | Point | Impact |
| --- | --- | --- |
| O-1 | No search. Local search needs a plugin; Algolia was out of scope. | Readers rely on navigation |
| O-2 | Mermaid renders client-side, so diagrams are absent without JavaScript and are not validated by the build. | New diagrams need a visual check |
| O-3 | Custom pages cannot yet be pinned per environment. | Acceptable while documentation is shared |
| O-4 | Hiding a `base` page from one environment requires moving it into the other overrides. | An exclusion manifest would fix it |
| O-5 | Build time scales with environments × pages. | ~6 minutes in CI for four trees today |
| O-6 | `Arc42SectionNav` filters by route existence, not by emptiness. | The no-placeholder rule is enforced by review |
| O-7 | Component landing pages are classified as generated, but a real generator would need the catalogue as input. | Modelling only |

---

## 10. Glossary

| Term | Meaning here |
| --- | --- |
| **System** | A deployable system with its own documentation and components |
| **Component** | A deployable part of a system, documented in its own right |
| **Documentation structure** | A methodology's chapter set — arc42, BMAD — as a navigation level |
| **Section** | One chapter of a structure |
| **Origin** | Whether a page is generated or written by hand |
| **Environment** | DEV, REF, ABN or PROD; one published documentation tree each |
| **Contract** | An event or command defined by a system |
| **Override** | A file under `content/overrides/<env>/` replacing or adding to the shared tree |
