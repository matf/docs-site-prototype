/**
 * Per-arc42-section documentation status for every system and component.
 *
 * Keyed by `<systemId>` for a system and `<systemId>/<componentId>` for a
 * component. `Arc42SectionNav` reads this so the twelve section links on every
 * landing page carry a Generated / Custom / Mixed marker without any page
 * having to repeat the information.
 */
import type {DocStatus} from './catalog';

type SectionStatusMap = Record<string, DocStatus>;

const ALL_CUSTOM: SectionStatusMap = {
  'introduction-and-goals': 'custom',
  'architecture-constraints': 'custom',
  'context-and-scope': 'custom',
  'solution-strategy': 'custom',
  'building-block-view': 'custom',
  'runtime-view': 'custom',
  'deployment-view': 'custom',
  'crosscutting-concerns': 'custom',
  'architecture-decisions': 'custom',
  'quality-requirements': 'custom',
  'risks-and-technical-debt': 'custom',
  glossary: 'custom',
};

const SECTION_STATUS: Record<string, SectionStatusMap> = {
  'example-system-a': {
    ...ALL_CUSTOM,
    'building-block-view': 'mixed',
    'context-and-scope': 'mixed',
    'deployment-view': 'mixed',
    'crosscutting-concerns': 'mixed',
    glossary: 'mixed',
  },
  'example-system-a/example-component-a': {
    ...ALL_CUSTOM,
    'context-and-scope': 'mixed',
    'building-block-view': 'mixed',
    'runtime-view': 'mixed',
    'deployment-view': 'generated',
    'crosscutting-concerns': 'mixed',
    glossary: 'mixed',
  },
  'example-system-a/example-component-b': {
    ...ALL_CUSTOM,
    'context-and-scope': 'mixed',
    'building-block-view': 'mixed',
    'runtime-view': 'mixed',
    'deployment-view': 'generated',
    'crosscutting-concerns': 'mixed',
    glossary: 'mixed',
  },
  'example-system-b': {
    ...ALL_CUSTOM,
    'context-and-scope': 'mixed',
    'building-block-view': 'mixed',
    'crosscutting-concerns': 'mixed',
  },
  'example-system-b/example-component-c': {
    ...ALL_CUSTOM,
    'context-and-scope': 'mixed',
    'building-block-view': 'mixed',
    'runtime-view': 'mixed',
    'crosscutting-concerns': 'mixed',
  },
};

export function sectionStatus(
  systemId: string,
  componentId: string | undefined,
  sectionSlug: string,
): DocStatus {
  const key = componentId ? `${systemId}/${componentId}` : systemId;
  return SECTION_STATUS[key]?.[sectionSlug] ?? 'custom';
}
