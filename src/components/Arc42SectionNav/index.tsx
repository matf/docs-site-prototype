import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {ARC42_SECTIONS} from '@site/src/data/arc42';
import {sectionPath, componentById, systemById} from '@site/src/data/catalog';
import {sectionStatus} from '@site/src/data/sectionStatus';
import StatusBadge from '@site/src/components/StatusBadge';
import styles from './styles.module.css';

export type Arc42SectionNavProps = {
  system: string;
  component?: string;
  /** Hide the one-line purpose text for a denser list. */
  compact?: boolean;
};

/**
 * The twelve arc42 sections of one system or component as a navigation grid.
 *
 * Used on every system and component landing page, which is what makes the
 * separate `Overview` sidebar entry unnecessary.
 */
export default function Arc42SectionNav({
  system,
  component,
  compact,
}: Arc42SectionNavProps): ReactNode {
  const owner = component ? componentById(system, component) : systemById(system);
  return (
    <nav className={styles.grid} aria-label={`arc42 sections of ${owner.name}`}>
      {ARC42_SECTIONS.map((section) => (
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
            <StatusBadge
              status={sectionStatus(system, component, section.slug)}
              small
              className={styles.badge}
            />
          </span>
        </Link>
      ))}
    </nav>
  );
}
