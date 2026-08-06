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

/** How a page or a documentation set is produced. */
export type DocStatus = 'generated' | 'custom' | 'mixed';

export const DOC_STATUS_LABEL: Record<DocStatus, string> = {
  generated: 'Generated',
  custom: 'Custom',
  mixed: 'Mixed',
};

export const DOC_STATUS_DESCRIPTION: Record<DocStatus, string> = {
  generated:
    'Produced by a documentation generator from source code, API contracts, schemas or deployment descriptors. Manual edits would be overwritten on the next run.',
  custom:
    'Written and maintained by hand by the owning team. Never touched by a generator.',
  mixed:
    'A page that combines both: manually written explanation around one or more generated blocks.',
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
  readonly status: DocStatus;
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
  readonly status: DocStatus;
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
    status: 'mixed',
    docStatus: 'Documented in depth — all twelve arc42 sections and two components.',
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
        status: 'mixed',
        docStatus: 'Complete — generated context, building block, runtime and messaging views.',
        sourceRepo: 'git.example.admin.ch/bazg-proto/declaration-intake-service',
        revision: '9c1e40d',
        generatedAt: '2026-08-04 03:12 UTC',
        role: 'Inbound adapter and declaration lifecycle owner',
      },
      {
        id: 'example-component-b',
        name: 'Example Component B',
        subtitle: 'Risk Assessment Engine (fictional)',
        summary:
          'Consumes declaration events, evaluates rule sets and scoring models, and issues inspection commands for consignments that exceed the risk threshold.',
        team: 'Team Alpha — Risk Squad',
        status: 'mixed',
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
    status: 'mixed',
    docStatus: 'Reduced sample — all twelve arc42 sections present, deliberately shorter content.',
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
        status: 'mixed',
        docStatus: 'Reduced sample — twelve arc42 sections with concise content.',
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

/** `/systems/example-system-a/components/example-component-a/` */
export function componentPath(systemId: string, componentId: string): string {
  return `/systems/${systemId}/components/${componentId}/`;
}

/**
 * Base path of a system or a component — the prefix that all twelve arc42
 * section routes hang off.
 */
export function basePath(systemId: string, componentId?: string): string {
  return componentId ? componentPath(systemId, componentId) : systemPath(systemId);
}

/** `/systems/example-system-a/components/example-component-a/runtime-view/` */
export function sectionPath(
  systemId: string,
  componentId: string | undefined,
  sectionSlug: string,
): string {
  return `${basePath(systemId, componentId)}${sectionSlug}/`;
}
