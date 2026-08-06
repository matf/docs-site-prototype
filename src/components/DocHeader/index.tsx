import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {arc42BySlug, arc42Label} from '@site/src/data/arc42';
import {
  componentById,
  componentPath,
  systemById,
  systemPath,
  type DocStatus,
} from '@site/src/data/catalog';
import StatusBadge from '@site/src/components/StatusBadge';
import {CustomMeta, GeneratedMeta, type CustomMetaProps, type GeneratedMetaProps} from '@site/src/components/MetaPanel';
import styles from './styles.module.css';

export type DocHeaderProps = {
  /** System id, e.g. `example-system-a`. */
  system: string;
  /** Component id when the page documents a component rather than the system. */
  component?: string;
  /** arc42 section slug, e.g. `runtime-view`. Omit on landing pages. */
  section?: string;
  status: DocStatus;
  /** Provenance panel for generated or mixed pages. */
  generated?: Omit<GeneratedMetaProps, 'team'> & {team?: string};
  /** Ownership panel for custom or mixed pages. */
  custom?: CustomMetaProps;
};

/**
 * Compact contextual header for documentation pages.
 *
 * It answers, above the fold and without reading the breadcrumbs: which system
 * am I in, is this the system or a component, which arc42 section is this, and
 * is the content generated, custom or mixed.
 */
export default function DocHeader({
  system,
  component,
  section,
  status,
  generated,
  custom,
}: DocHeaderProps): ReactNode {
  const systemEntry = systemById(system);
  const componentEntry = component ? componentById(system, component) : undefined;
  const sectionEntry = section ? arc42BySlug(section) : undefined;
  const owningTeam = componentEntry?.team ?? systemEntry.team;

  return (
    <>
      <div className={styles.header}>
        <nav className={styles.trail} aria-label="Documentation context">
          <span className={styles.item}>
            <span className={styles.kind}>System</span>
            <Link className={styles.name} to={systemPath(systemEntry.id)}>
              {systemEntry.name}
            </Link>
          </span>
          {componentEntry ? (
            <span className={styles.item}>
              <span className={styles.kind}>Component</span>
              <Link className={styles.name} to={componentPath(systemEntry.id, componentEntry.id)}>
                {componentEntry.name}
              </Link>
            </span>
          ) : null}
          <span className={styles.item}>
            <span className={styles.kind}>arc42</span>
            <span className={styles.name}>
              {sectionEntry ? arc42Label(sectionEntry) : 'Landing page'}
            </span>
          </span>
        </nav>
        <StatusBadge status={status} className={styles.badge} />
      </div>
      {generated ? <GeneratedMeta {...generated} team={generated.team ?? owningTeam} /> : null}
      {custom ? <CustomMeta {...custom} /> : null}
    </>
  );
}
