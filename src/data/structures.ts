/**
 * Documentation structures.
 *
 * A system or a component is not documented in one fixed way. Different
 * methodologies produce different chapter sets, and a system may carry several
 * of them at once — an arc42 architecture description and a BMAD specification,
 * for example. The structure is therefore a level of its own, visible both in
 * the navigation and in the URL:
 *
 *   /systems/<system>/system-architecture/<section>/
 *   /systems/<system>/specs-docs/<section>/
 *   /systems/<system>/components/<component>/system-architecture/<section>/
 *
 * Adding a methodology means adding an entry here and a folder in the content
 * tree. Nothing else in the navigation has to change.
 */
import {ARC42_SECTIONS} from './arc42';

export type DocStructureId = 'system-architecture' | 'specs-docs';

export type DocSection = {
  /** Position in the methodology's own numbering. */
  readonly num: number;
  readonly title: string;
  /** URL segment below the structure. */
  readonly slug: string;
  /** One line on what belongs in this section. */
  readonly purpose: string;
};

export type DocStructure = {
  readonly id: DocStructureId;
  /** URL segment below the system or component. Identical to `id`. */
  readonly slug: string;
  /** Display name in the navigation, for a system. */
  readonly label: string;
  /**
   * Display name when the structure documents a component. The same
   * methodology describes a different thing one level down, and calling it
   * "System Architecture" under a component is simply wrong.
   */
  readonly componentLabel?: string;
  /** The methodology behind it. */
  readonly methodology: string;
  readonly description: string;
  /** Whether the structure is used for systems, components, or both. */
  readonly appliesTo: readonly ('system' | 'component')[];
  readonly sections: readonly DocSection[];
};

/**
 * BMAD specification documents.
 *
 * The chain a BMAD project produces: a brief agrees the problem, the product
 * requirements make it precise, the architecture says how it is realised, and
 * epics and stories shard it into implementable units.
 */
const BMAD_SECTIONS: readonly DocSection[] = [
  {
    num: 1,
    title: 'Project Brief',
    slug: 'project-brief',
    purpose: 'Problem, users, scope and success criteria, agreed before any solution work.',
  },
  {
    num: 2,
    title: 'Product Requirements',
    slug: 'product-requirements',
    purpose: 'Functional and non-functional requirements, precise enough to shard into epics.',
  },
  {
    num: 3,
    title: 'Architecture',
    slug: 'architecture',
    purpose: 'How the requirements are realised, and what it defers to the architecture description.',
  },
  {
    num: 4,
    title: 'Epics',
    slug: 'epics',
    purpose: 'Requirement clusters sized for a delivery increment, sharded from the requirements.',
  },
  {
    num: 5,
    title: 'Stories',
    slug: 'stories',
    purpose: 'Implementable units with acceptance criteria and a status.',
  },
  {
    num: 6,
    title: 'Quality and Test Strategy',
    slug: 'quality-and-test-strategy',
    purpose: 'Test approach, acceptance gates and the definition of done.',
  },
];

export const DOC_STRUCTURES: readonly DocStructure[] = [
  {
    id: 'system-architecture',
    slug: 'system-architecture',
    label: 'System Architecture',
    componentLabel: 'Component Architecture',
    methodology: 'arc42',
    description:
      'The architecture description: twelve arc42 sections covering goals, constraints, context, structure, runtime behaviour, deployment, crosscutting concepts, decisions, quality, risks and vocabulary.',
    appliesTo: ['system', 'component'],
    sections: ARC42_SECTIONS,
  },
  {
    id: 'specs-docs',
    slug: 'specs-docs',
    label: 'Specification Docs',
    methodology: 'BMAD',
    description:
      'The specification chain: project brief, product requirements, architecture, and the epics and stories sharded from them. Describes what is to be built and why, where the architecture description covers how it is structured.',
    appliesTo: ['system'],
    sections: BMAD_SECTIONS,
  },
];

export const DEFAULT_STRUCTURE: DocStructureId = 'system-architecture';

export function docStructure(id: string): DocStructure {
  const structure = DOC_STRUCTURES.find((s) => s.id === id);
  if (!structure) {
    throw new Error(
      `Unknown documentation structure "${id}". Known: ${DOC_STRUCTURES.map((s) => s.id).join(', ')}`,
    );
  }
  return structure;
}

export function sectionBySlug(structureId: string, slug: string): DocSection {
  const structure = docStructure(structureId);
  const section = structure.sections.find((s) => s.slug === slug);
  if (!section) {
    throw new Error(
      `Unknown section "${slug}" in ${structure.label}. Known: ${structure.sections
        .map((s) => s.slug)
        .join(', ')}`,
    );
  }
  return section;
}

/**
 * How the structure is called in the context it is used in: a component's arc42
 * description is a *Component Architecture*, not a *System Architecture*.
 */
export function structureLabel(structure: DocStructure, isComponent: boolean): string {
  return isComponent ? (structure.componentLabel ?? structure.label) : structure.label;
}

/** `5. Building Block View` — the label form used in navigation and headings. */
export function sectionLabel(section: DocSection): string {
  return `${section.num}. ${section.title}`;
}
