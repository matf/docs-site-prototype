import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {componentById, sectionPath, systemById} from '@site/src/data/catalog';
import {DEFAULT_STRUCTURE, docStructure} from '@site/src/data/structures';
import {useDocsStatus} from '@site/src/data/useDocsStatus';
import StatusBadge from '@site/src/components/StatusBadge';
import styles from './styles.module.css';

export type SectionNavProps = {
  system: string;
  component?: string;
  /** Documentation structure whose sections are listed. */
  structure?: string;
  /** Hide the one-line purpose text for a denser list. */
  compact?: boolean;
};

/**
 * The sections of one documentation structure, for one system or component.
 *
 * Only sections that actually have a page are rendered. A section is a chapter
 * that may legitimately not apply — a component without its own constraints has
 * nothing to say in arc42 section 2 — and an empty placeholder page is worse
 * than no page at all. The numbering gaps make the absence visible without
 * anybody having to maintain a list of what is missing.
 */
export default function SectionNav({
  system,
  component,
  structure = DEFAULT_STRUCTURE,
  compact,
}: SectionNavProps): ReactNode {
  const owner = component ? componentById(system, component) : systemById(system);
  const entry = docStructure(structure);
  const documented = useDocsStatus().sectionsOf(system, component, structure);
  const missing = entry.sections.length - documented.length;

  return (
    <>
      <nav className={styles.grid} aria-label={`${entry.label} sections of ${owner.name}`}>
        {documented.map(({section, status}) => (
          <Link
            key={section.slug}
            className={styles.item}
            to={sectionPath(system, component, structure, section.slug)}>
            <span className={styles.num} aria-hidden="true">
              {section.num}
            </span>
            <span className={styles.body}>
              <span className={styles.title}>{section.title}</span>
              {compact ? null : <span className={styles.purpose}>{section.purpose}</span>}
              <StatusBadge status={status} small className={styles.badge} />
            </span>
          </Link>
        ))}
      </nav>
      <p className={styles.coverage}>
        {documented.length} of {entry.sections.length} {entry.methodology} sections documented
        {missing > 0
          ? '. Sections with no content are not shown — there are no empty placeholder pages.'
          : '.'}
      </p>
    </>
  );
}
