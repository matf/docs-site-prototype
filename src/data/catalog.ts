/**
 * Catalogue of the systems and components documented on this prototype site.
 *
 * This file is the single place that knows which systems and components exist.
 * Landing pages, cards, contextual page headers and cross-links all read from
 * it, so a future generator only has to regenerate this file (plus the MDX
 * pages) — no navigation code has to change.
 *
 * ALL DATA BELOW IS FICTIONAL PROTOTYPE CONTENT.
 */

import {docStructure, structureSlug} from './structures';

/**
 * How a page is produced.
 *
 * There are exactly two values, and they apply to a whole page. A page is
 * either generated or written by hand — never both. Where a generated artefact
 * needs hand-written explanation, the explanation is a separate page filed
 * under the same arc42 section.
 */
export type DocStatus = 'generated' | 'custom';

export const DOC_STATUS_LABEL: Record<DocStatus, string> = {
  generated: 'Generated',
  custom: 'Custom',
};

export const DOC_STATUS_DESCRIPTION: Record<DocStatus, string> = {
  generated:
    'The whole page is produced by a documentation generator from source code, API contracts, schemas or deployment descriptors. Manual edits are overwritten on the next run.',
  custom:
    'The whole page is written and maintained by hand by the owning team. No generator ever writes to it.',
};

export type ComponentEntry = {
  /** URL segment, e.g. `example-component-a`. */
  readonly id: string;
  /** Sidebar and card label. */
  readonly name: string;
  /** Fictional descriptive subtitle. */
  readonly subtitle: string;
  readonly summary: string;
  readonly team: string;
  /** Short statement of how complete the documentation is. */
  readonly docStatus: string;
  readonly sourceRepo: string;
  readonly revision: string;
  readonly generatedAt: string;
  /** Interaction kind shown on the system building block view. */
  readonly role: string;
};

export type SystemEntry = {
  readonly id: string;
  readonly name: string;
  readonly subtitle: string;
  readonly summary: string;
  readonly team: string;
  readonly docStatus: string;
  readonly sourceRepo: string;
  readonly revision: string;
  readonly generatedAt: string;
  readonly components: readonly ComponentEntry[];
};

export const SYSTEMS: readonly SystemEntry[] = [
  {
    id: 'example-system-a',
    name: 'Example System A',
    subtitle: 'Goods Declaration Platform (fictional)',
    summary:
      'Accepts electronic goods declarations from trade participants, validates them against customs rules, assesses risk and hands cleared consignments over to the border control processes.',
    team: 'Team Alpha — Customs Platform Engineering',
    docStatus: 'Documented in depth — all twelve arc42 sections, two components.',
    sourceRepo: 'git.example.admin.ch/bazg-proto/example-system-a',
    revision: 'a41f7c9',
    generatedAt: '2026-08-04 03:12 UTC',
    components: [
      {
        id: 'example-component-a',
        name: 'Example Component A',
        subtitle: 'Declaration Intake Service (fictional)',
        summary:
          'Single entry point for electronic declarations. Validates structure and customs rules, persists the declaration aggregate and publishes declaration lifecycle events.',
        team: 'Team Alpha — Declaration Squad',
        docStatus: 'Complete — generated context, building block, runtime and messaging views.',
        sourceRepo: 'git.example.admin.ch/bazg-proto/declaration-intake-service',
        revision: '9c1e40d',
        generatedAt: '2026-08-04 03:12 UTC',
        role: 'Inbound adapter and declaration lifecycle owner',
      },
      {
        id: 'example-component-d',
        name: 'Example Component D',
        subtitle: 'Notification Projection Service (fictional)',
        summary:
          'Projects declaration lifecycle events into declarant notifications. Extracted from Example Component A once a third notification channel appeared; deployed on DEV only so far.',
        team: 'Team Alpha — Declaration Squad',
        docStatus: 'New — context, building block and runtime views plus goals; not yet promoted beyond DEV.',
        sourceRepo: 'git.example.admin.ch/bazg-proto/notification-projection-service',
        revision: '0b74e12',
        generatedAt: '2026-08-06 06:00 UTC',
        role: 'Read-model projection and notification adapter',
      },
      {
        id: 'example-component-b',
        name: 'Example Component B',
        subtitle: 'Risk Assessment Engine (fictional)',
        summary:
          'Consumes declaration events, evaluates rule sets and scoring models, and issues inspection commands for consignments that exceed the risk threshold.',
        team: 'Team Alpha — Risk Squad',
        docStatus: 'Complete — generated context, building block, runtime and messaging views.',
        sourceRepo: 'git.example.admin.ch/bazg-proto/risk-assessment-engine',
        revision: '3fd8b52',
        generatedAt: '2026-08-04 03:14 UTC',
        role: 'Event-driven decision engine',
      },
    ],
  },
  {
    id: 'example-system-b',
    name: 'Example System B',
    subtitle: 'Transit Information Portal (fictional)',
    summary:
      'Publishes transit and border waiting-time information to travellers and hauliers, and distributes operational notifications. Included to show that the navigation scales to several systems.',
    team: 'Team Beta — Public Information Services',
    docStatus: 'Partially documented — nine of twelve arc42 sections; the rest have no content yet.',
    sourceRepo: 'git.example.admin.ch/bazg-proto/example-system-b',
    revision: '7b20ae1',
    generatedAt: '2026-08-03 03:09 UTC',
    components: [
      {
        id: 'example-component-c',
        name: 'Example Component C',
        subtitle: 'Notification Gateway (fictional)',
        summary:
          'Fans operational notifications out to e-mail, push and the public status page. Documented at reduced depth.',
        team: 'Team Beta — Channels Squad',
        docStatus: 'Partially documented — five of twelve arc42 sections; the rest have no content yet.',
        sourceRepo: 'git.example.admin.ch/bazg-proto/notification-gateway',
        revision: 'd52c118',
        generatedAt: '2026-08-03 03:10 UTC',
        role: 'Outbound channel adapter',
      },
    ],
  },
];

export function systemById(id: string): SystemEntry {
  const system = SYSTEMS.find((s) => s.id === id);
  if (!system) {
    throw new Error(
      `Unknown system "${id}". Known systems: ${SYSTEMS.map((s) => s.id).join(', ')}`,
    );
  }
  return system;
}

export function componentById(systemId: string, componentId: string): ComponentEntry {
  const system = systemById(systemId);
  const component = system.components.find((c) => c.id === componentId);
  if (!component) {
    throw new Error(
      `Unknown component "${componentId}" in system "${systemId}". Known components: ${system.components
        .map((c) => c.id)
        .join(', ')}`,
    );
  }
  return component;
}

/** `/systems/example-system-a/` */
export function systemPath(systemId: string): string {
  return `/systems/${systemId}/`;
}

/**
 * Components live inside the system's building block view: that section
 * describes the decomposition, and a component *is* one of the building blocks.
 *
 * The section groups its children by what they are — `components/`, `events/`,
 * `commands/` — so the kind is visible in the navigation and in the URL:
 *
 * `/systems/example-system-a/system-architecture/building-block-view/components/example-component-a/`
 */
export const COMPONENT_HOME_STRUCTURE = 'system-architecture';
export const COMPONENT_HOME_SECTION = 'building-block-view';
export const COMPONENT_GROUP = 'components';

export function componentPath(systemId: string, componentId: string): string {
  return `/systems/${systemId}/${COMPONENT_HOME_STRUCTURE}/${COMPONENT_HOME_SECTION}/${COMPONENT_GROUP}/${componentId}/`;
}

/**
 * Base path of a system or a component — the prefix that its documentation
 * structures hang off.
 */
export function basePath(systemId: string, componentId?: string): string {
  return componentId ? componentPath(systemId, componentId) : systemPath(systemId);
}

/** `/systems/example-system-a/system-architecture/` */
export function structurePath(
  systemId: string,
  componentId: string | undefined,
  structureId: string,
): string {
  const slug = structureSlug(docStructure(structureId), Boolean(componentId));
  return `${basePath(systemId, componentId)}${slug}/`;
}

/**
 * `/systems/example-system-a/system-architecture/building-block-view/example-component-a/component-architecture/runtime-view/`
 */
export function sectionPath(
  systemId: string,
  componentId: string | undefined,
  structureId: string,
  sectionSlug: string,
): string {
  return `${structurePath(systemId, componentId, structureId)}${sectionSlug}/`;
}
