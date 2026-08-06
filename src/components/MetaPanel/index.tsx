import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type Row = {label: string; value: ReactNode};

function Panel({
  variant,
  title,
  rows,
  note,
}: {
  variant: 'generated' | 'custom';
  title: string;
  rows: Row[];
  note?: ReactNode;
}): ReactNode {
  return (
    <section className={clsx(styles.panel, styles[variant])} aria-label={title}>
      <h4 className={styles.title}>{title}</h4>
      <dl className={styles.list}>
        {rows.map((row) => (
          <div className={styles.row} key={row.label}>
            <dt className={styles.label}>{row.label}</dt>
            <dd className={styles.value}>{row.value}</dd>
          </div>
        ))}
      </dl>
      {note ? <p className={styles.note}>{note}</p> : null}
    </section>
  );
}

export type GeneratedMetaProps = {
  /** Name and version of the tool that produced the content. */
  generator: string;
  sourceRepo: string;
  revision: string;
  generatedAt: string;
  team: string;
  /** What exactly on the page is generated, if it is not the whole page. */
  scope?: string;
};

/** Provenance panel shown on every page that carries generated content. */
export function GeneratedMeta({
  generator,
  sourceRepo,
  revision,
  generatedAt,
  team,
  scope,
}: GeneratedMetaProps): ReactNode {
  return (
    <Panel
      variant="generated"
      title="Generation metadata"
      rows={[
        {label: 'Generator', value: <code>{generator}</code>},
        {label: 'Source repository', value: <code>{sourceRepo}</code>},
        {label: 'Source revision', value: <code>{revision}</code>},
        {label: 'Generated at', value: generatedAt},
        {label: 'Owning team', value: team},
        ...(scope ? [{label: 'Generated scope', value: scope}] : []),
      ]}
      note="Prototype metadata. Regenerating this page overwrites the generated blocks; manual edits belong in a separate custom page."
    />
  );
}

export type CustomMetaProps = {
  /** Author or, preferably, the owning team. */
  owner: string;
  lastReviewed: string;
  reviewStatus?: 'Reviewed' | 'Review due' | 'Draft';
  note?: ReactNode;
};

/** Ownership panel shown on every manually maintained page. */
export function CustomMeta({owner, lastReviewed, reviewStatus, note}: CustomMetaProps): ReactNode {
  return (
    <Panel
      variant="custom"
      title="Maintenance metadata"
      rows={[
        {label: 'Maintained by', value: owner},
        {label: 'Last reviewed', value: lastReviewed},
        ...(reviewStatus ? [{label: 'Review status', value: reviewStatus}] : []),
      ]}
      note={note ?? 'Manually written content. No generator writes to this page.'}
    />
  );
}

export default Panel;
