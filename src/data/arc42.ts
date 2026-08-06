/**
 * The canonical arc42 section list.
 *
 * Every system and every component uses exactly these twelve sections, and the
 * sections start directly beneath the system or component — there is no
 * intermediate `arc42` or `Overview` navigation node.
 *
 * `slug` is the URL segment. The documentation folders carry a `NN-` ordering
 * prefix (`05-building-block-view/`) which Docusaurus strips from the URL, so
 * the slug here always matches the published route.
 */
export type Arc42Section = {
  /** arc42 section number, 1–12. */
  readonly num: number;
  /** Label used in the sidebar and in navigation components. */
  readonly title: string;
  /** URL segment below a system or component base path. */
  readonly slug: string;
  /** One-line description of what belongs in this section. */
  readonly purpose: string;
};

export const ARC42_SECTIONS: readonly Arc42Section[] = [
  {
    num: 1,
    title: 'Introduction and Goals',
    slug: 'introduction-and-goals',
    purpose: 'Task, top quality goals and the stakeholders behind them.',
  },
  {
    num: 2,
    title: 'Architecture Constraints',
    slug: 'architecture-constraints',
    purpose: 'Technical, organisational and regulatory constraints.',
  },
  {
    num: 3,
    title: 'Context and Scope',
    slug: 'context-and-scope',
    purpose: 'Business and technical context, external interfaces.',
  },
  {
    num: 4,
    title: 'Solution Strategy',
    slug: 'solution-strategy',
    purpose: 'Fundamental decisions and the approach chosen to meet the goals.',
  },
  {
    num: 5,
    title: 'Building Block View',
    slug: 'building-block-view',
    purpose: 'Static decomposition into building blocks and their responsibilities.',
  },
  {
    num: 6,
    title: 'Runtime View',
    slug: 'runtime-view',
    purpose: 'Behaviour of the building blocks in concrete scenarios.',
  },
  {
    num: 7,
    title: 'Deployment View',
    slug: 'deployment-view',
    purpose: 'Infrastructure, environments and the mapping of software to it.',
  },
  {
    num: 8,
    title: 'Crosscutting Concerns',
    slug: 'crosscutting-concerns',
    purpose: 'Concepts that apply to many building blocks: security, operations, messaging.',
  },
  {
    num: 9,
    title: 'Architecture Decisions',
    slug: 'architecture-decisions',
    purpose: 'Important, expensive or risky decisions, recorded as ADRs.',
  },
  {
    num: 10,
    title: 'Quality Requirements',
    slug: 'quality-requirements',
    purpose: 'Quality tree and measurable quality scenarios.',
  },
  {
    num: 11,
    title: 'Risks and Technical Debt',
    slug: 'risks-and-technical-debt',
    purpose: 'Known risks, technical debt and the planned mitigations.',
  },
  {
    num: 12,
    title: 'Glossary',
    slug: 'glossary',
    purpose: 'Domain and technical terms with their agreed meaning.',
  },
];

/** `5. Building Block View` — the label form used in navigation and headings. */
export function arc42Label(section: Arc42Section): string {
  return `${section.num}. ${section.title}`;
}

export function arc42BySlug(slug: string): Arc42Section {
  const section = ARC42_SECTIONS.find((s) => s.slug === slug);
  if (!section) {
    throw new Error(
      `Unknown arc42 section slug "${slug}". Expected one of: ${ARC42_SECTIONS.map(
        (s) => s.slug,
      ).join(', ')}`,
    );
  }
  return section;
}
