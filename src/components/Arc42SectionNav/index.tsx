import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {ARC42_SECTIONS} from '@site/src/data/arc42';
import {sectionPath, componentById, systemById} from '@site/src/data/catalog';
import {useDocsStatus} from '@site/src/data/useDocsStatus';
import StatusBadge from '@site/src/components/StatusBadge';
import styles from './styles.module.css';

export type Arc42SectionNavProps = {
  system: string;
  component?: string;
  /** Hide the one-line purpose text for a denser list. */
  compact?: boolean;
};

/**
 * The arc42 sections of one system or component as a navigation grid.
 *
 * Only sections that actually have a page are rendered. An arc42 section is a
 * chapter that may legitimately not apply — a component without its own
 * constraints has nothing to say in section 2 — and an empty placeholder page
 * is worse than no page at all. The numbering gaps make the absence visible
 * without anybody having to maintain a list of what is missing.
 */
export default function Arc42SectionNav({
  system,
  component,
  compact,
}: Arc42SectionNavProps): ReactNode {
  const owner = component ? componentById(system, component) : systemById(system);
  const documented = useDocsStatus().sectionsOf(system, component);
  const missing = ARC42_SECTIONS.length - documented.length;

  return (
    <>
      <nav className={styles.grid} aria-label={`arc42 sections of ${owner.name}`}>
        {documented.map(({section, status}) => (
          <Link
            key={section.slug}
            className={styles.item}
            to={sectionPath(system, component, section.slug)}>
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
        {documented.length} of {ARC42_SECTIONS.length} arc42 sections documented
        {missing > 0
          ? '. Sections with no content are not shown — there are no empty placeholder pages.'
          : '.'}
      </p>
    </>
  );
}
