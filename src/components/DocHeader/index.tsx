import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
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
  /** Provenance panel; set on generated pages. */
  generated?: Omit<GeneratedMetaProps, 'team'> & {team?: string};
  /** Ownership panel; set on custom pages. */
  custom?: CustomMetaProps;
};

/**
 * Compact contextual header for documentation pages.
 *
 * It answers, above the fold and without reading the breadcrumbs: which system
 * am I in, is this the system or a component, which arc42 section is this, and
 * is this page generated or written by hand.
 *
 * The origin is read from the page's own `doc_status` frontmatter rather than
 * passed in, so there is exactly one place per page that declares it — the same
 * place the build-time `bazg-doc-status` plugin reads.
 */
export default function DocHeader({
  system,
  component,
  section,
  generated,
  custom,
}: DocHeaderProps): ReactNode {
  const {frontMatter} = useDoc();
  // `doc_status` is a site-specific frontmatter field, so it is not part of
  // Docusaurus' own DocFrontMatter type.
  const status = (frontMatter as {doc_status?: DocStatus}).doc_status;
  if (status !== 'generated' && status !== 'custom') {
    throw new Error(
      `Missing or invalid "doc_status" frontmatter (got ${JSON.stringify(status)}). ` +
        'Every documentation page must declare doc_status: generated | custom.',
    );
  }
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
