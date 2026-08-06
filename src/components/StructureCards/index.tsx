import React, {type ReactNode} from 'react';
import Link from '@site/src/components/EnvLink';
import {componentById, structurePath, systemById} from '@site/src/data/catalog';
import {DOC_STRUCTURES, docStructure} from '@site/src/data/structures';
import {useDocsStatus} from '@site/src/data/useDocsStatus';
import DocMix from '@site/src/components/DocMix';
import styles from './styles.module.css';

export type StructureCardsProps = {
  system: string;
  component?: string;
};

/**
 * The documentation structures available for one system or component.
 *
 * A system may be documented in more than one way at the same time — an arc42
 * architecture description and a BMAD specification, for instance. Which ones
 * exist is derived from the published routes, so a structure appears here as
 * soon as its folder has content and disappears when it does not.
 */
export default function StructureCards({system, component}: StructureCardsProps): ReactNode {
  const owner = component ? componentById(system, component) : systemById(system);
  const {exists, sectionsOf, countUnder} = useDocsStatus();

  const available = DOC_STRUCTURES.filter((structure) =>
    exists(structurePath(system, component, structure.id)),
  );

  if (available.length === 0) {
    return null;
  }

  return (
    <div className={styles.grid} role="list" aria-label={`Documentation structures of ${owner.name}`}>
      {available.map((structure) => {
        const path = structurePath(system, component, structure.id);
        const documented = sectionsOf(system, component, structure.id).length;
        const pages = countUnder(path);
        return (
          <article className={styles.card} role="listitem" key={structure.id}>
            <header className={styles.head}>
              <div>
                <h3 className={styles.title}>
                  <Link to={path}>{structure.label}</Link>
                </h3>
                <p className={styles.methodology}>{structure.methodology}</p>
              </div>
              <DocMix system={system} component={component} structure={structure.id} />
            </header>
            <p className={styles.summary}>{structure.description}</p>
            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt>Sections</dt>
                <dd>
                  {documented} of {structure.sections.length} documented
                </dd>
              </div>
              <div className={styles.fact}>
                <dt>Pages</dt>
                <dd>{pages.total}</dd>
              </div>
            </dl>
            <Link className={styles.action} to={path}>
              Open {structure.label} →
            </Link>
          </article>
        );
      })}
    </div>
  );
}

/** Inline link to one structure, for use in prose. */
export function StructureLink({
  system,
  component,
  structure,
}: {
  system: string;
  component?: string;
  structure: string;
}): ReactNode {
  return (
    <Link to={structurePath(system, component, structure)}>{docStructure(structure).label}</Link>
  );
}
