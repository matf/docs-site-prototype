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
import {useDocsStatus} from '@site/src/data/useDocsStatus';
import DocMix from '@site/src/components/DocMix';
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
  const {countUnder, sectionsOf} = useDocsStatus();
  const pages = countUnder(systemPath(system.id));
  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <div>
          <h3 className={styles.title}>
            <Link to={systemPath(system.id)}>{system.name}</Link>
          </h3>
          <p className={styles.subtitle}>{system.subtitle}</p>
        </div>
        <DocMix system={system.id} />
      </header>
      <p className={styles.summary}>{system.summary}</p>
      <Facts
        items={[
          {label: 'Responsible team', value: system.team},
          {label: 'Components', value: system.components.length},
          {
            label: 'arc42 sections',
            value: `${sectionsOf(system.id).length} of 12 documented`,
          },
          {label: 'Documentation pages', value: pages.total},
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
  const {countUnder, sectionsOf, exists} = useDocsStatus();
  const base = componentPath(system, entry.id);
  const pages = countUnder(base);
  const links = [
    {to: `${base}context-and-scope/`, label: '3. Context and Scope', note: 'Generated context diagram'},
    {to: `${base}building-block-view/`, label: '5. Building Block View', note: 'Generated internal decomposition'},
    {to: `${base}runtime-view/`, label: '6. Runtime View', note: 'Generated reaction graph'},
    {
      to: `${base}crosscutting-concerns/messaging-events-and-commands/`,
      label: 'Messaging Events and Commands',
      note: 'Generated message catalogue',
    },
  ].filter((link) => exists(link.to));
  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <div>
          <h3 className={styles.title}>
            <Link to={base}>{entry.name}</Link>
          </h3>
          <p className={styles.subtitle}>{entry.subtitle}</p>
        </div>
        <DocMix system={system} component={entry.id} />
      </header>
      <p className={styles.summary}>{entry.summary}</p>
      <Facts
        items={[
          {label: 'Responsible team', value: entry.team},
          {label: 'Role in the system', value: entry.role},
          {
            label: 'arc42 sections',
            value: `${sectionsOf(system, entry.id).length} of 12 documented`,
          },
          {label: 'Documentation pages', value: pages.total},
          {label: 'Status', value: entry.docStatus},
        ]}
      />
      <ul className={styles.links}>
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to}>{link.label}</Link>
            <span className={styles.linkNote}>{link.note}</span>
          </li>
        ))}
      </ul>
      <Link className={styles.action} to={base}>
        Open {entry.name} →
      </Link>
    </article>
  );
}
