import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {
  componentById,
  componentPath,
  systemById,
  systemPath,
  type ComponentEntry,
} from '@site/src/data/catalog';
import {useDocsStats} from '@site/src/data/useDocsStats';
import StatusBadge from '@site/src/components/StatusBadge';
import styles from './styles.module.css';

export function CardGrid({
  children,
  columns = 2,
}: {
  children: ReactNode;
  columns?: 2 | 3;
}): ReactNode {
  return (
    <div className={clsx(styles.grid, columns === 3 && styles.grid3)}>{children}</div>
  );
}

function Facts({items}: {items: {label: string; value: ReactNode}[]}): ReactNode {
  return (
    <dl className={styles.facts}>
      {items.map((item) => (
        <div className={styles.fact} key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Card for a system, used on the start page and the systems overview. */
export function SystemCard({id}: {id: string}): ReactNode {
  const system = systemById(id);
  const stats = useDocsStats();
  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <div>
          <h3 className={styles.title}>
            <Link to={systemPath(system.id)}>{system.name}</Link>
          </h3>
          <p className={styles.subtitle}>{system.subtitle}</p>
        </div>
        <StatusBadge status={system.status} small />
      </header>
      <p className={styles.summary}>{system.summary}</p>
      <Facts
        items={[
          {label: 'Responsible team', value: system.team},
          {label: 'Components', value: system.components.length},
          {label: 'Documentation pages', value: stats.pagesInSystem(system.id)},
          {label: 'Status', value: system.docStatus},
        ]}
      />
      <ul className={styles.links}>
        {system.components.map((component) => (
          <li key={component.id}>
            <Link to={componentPath(system.id, component.id)}>{component.name}</Link>
            <span className={styles.linkNote}>{component.subtitle}</span>
          </li>
        ))}
      </ul>
      <Link className={styles.action} to={systemPath(system.id)}>
        Open {system.name} →
      </Link>
    </article>
  );
}

/** Card for a component, used on system landing pages and building block views. */
export function ComponentCard({
  system,
  component,
}: {
  system: string;
  component: string;
}): ReactNode {
  const entry: ComponentEntry = componentById(system, component);
  const stats = useDocsStats();
  const base = componentPath(system, entry.id);
  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <div>
          <h3 className={styles.title}>
            <Link to={base}>{entry.name}</Link>
          </h3>
          <p className={styles.subtitle}>{entry.subtitle}</p>
        </div>
        <StatusBadge status={entry.status} small />
      </header>
      <p className={styles.summary}>{entry.summary}</p>
      <Facts
        items={[
          {label: 'Responsible team', value: entry.team},
          {label: 'Role in the system', value: entry.role},
          {label: 'Documentation pages', value: stats.pagesInComponent(system, entry.id)},
          {label: 'Status', value: entry.docStatus},
        ]}
      />
      <ul className={styles.links}>
        <li>
          <Link to={`${base}context-and-scope/`}>3. Context and Scope</Link>
          <span className={styles.linkNote}>Generated context diagram</span>
        </li>
        <li>
          <Link to={`${base}building-block-view/`}>5. Building Block View</Link>
          <span className={styles.linkNote}>Generated internal decomposition</span>
        </li>
        <li>
          <Link to={`${base}runtime-view/`}>6. Runtime View</Link>
          <span className={styles.linkNote}>Generated reaction graph</span>
        </li>
        <li>
          <Link to={`${base}crosscutting-concerns/messaging-events-and-commands/`}>
            Messaging Events and Commands
          </Link>
          <span className={styles.linkNote}>Generated message catalogue</span>
        </li>
      </ul>
      <Link className={styles.action} to={base}>
        Open {entry.name} →
      </Link>
    </article>
  );
}
