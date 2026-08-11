import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@site/src/components/EnvLink';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {
  DEFAULT_STRUCTURE,
  docStructure,
  sectionBySlug,
  sectionLabel,
  structureLabel,
} from '@site/src/data/structures';
import {sourceState, useEnvironment} from '@site/src/data/environments';
import {
  componentById,
  componentPath,
  structurePath,
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
  /** Documentation structure the page belongs to. */
  structure?: string;
  /** Section slug within that structure, e.g. `runtime-view`. Omit on landing pages. */
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
 * place the build-time `acme-doc-status` plugin reads.
 */
export default function DocHeader({
  system,
  component,
  structure = DEFAULT_STRUCTURE,
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
  const environment = useEnvironment();
  const structureEntry = docStructure(structure);
  const sectionEntry = section ? sectionBySlug(structure, section) : undefined;
  const owningTeam = componentEntry?.team ?? systemEntry.team;

  // Generated pages describe one environment. The revision and the timestamp
  // therefore come from the environment, not from the page — the same page
  // composed into four trees reports four different source states.
  const state = sourceState(environment.id, system, component);
  const generatedForEnvironment = generated
    ? {
        ...generated,
        revision: state?.revision ?? generated.revision,
        generatedAt: state?.generatedAt ?? generated.generatedAt,
        environment: `${environment.short} — ${state?.note ?? environment.regeneration}`,
      }
    : undefined;

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
            <span className={styles.kind}>Docs</span>
            <Link
              className={styles.name}
              to={structurePath(systemEntry.id, componentEntry?.id, structureEntry.id)}>
              {structureLabel(structureEntry, Boolean(componentEntry))}
            </Link>
          </span>
          <span className={styles.item}>
            <span className={styles.kind}>{structureEntry.methodology}</span>
            <span className={styles.name}>
              {sectionEntry ? sectionLabel(sectionEntry) : 'Landing page'}
            </span>
          </span>
        </nav>
        <span className={styles.badges}>
          <span className={clsx(styles.environment, styles[`env_${environment.id}`])}>
            {environment.short}
          </span>
          <StatusBadge status={status} className={styles.badge} />
        </span>
      </div>
      {generatedForEnvironment ? (
        <GeneratedMeta
          {...generatedForEnvironment}
          team={generatedForEnvironment.team ?? owningTeam}
        />
      ) : null}
      {custom ? <CustomMeta {...custom} /> : null}
    </>
  );
}
