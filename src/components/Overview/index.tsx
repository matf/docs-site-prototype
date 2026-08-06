import React, {type ReactNode} from 'react';
import {
  DOC_STATUS_DESCRIPTION,
  DOC_STATUS_LABEL,
  SYSTEMS,
  type DocStatus,
} from '@site/src/data/catalog';
import {ARC42_SECTIONS} from '@site/src/data/arc42';
import {useDocsStats} from '@site/src/data/useDocsStats';
import StatusBadge from '@site/src/components/StatusBadge';
import styles from './styles.module.css';

/** Headline counts for the whole documentation tree. */
export function StatsRow(): ReactNode {
  const stats = useDocsStats();
  const componentCount = SYSTEMS.reduce((sum, system) => sum + system.components.length, 0);
  const items = [
    {value: SYSTEMS.length, label: 'Systems'},
    {value: componentCount, label: 'Components'},
    {value: stats.totalPages, label: 'Documentation pages'},
    {value: ARC42_SECTIONS.length, label: 'arc42 sections per entry'},
  ];
  return (
    <dl className={styles.stats}>
      {items.map((item) => (
        <div className={styles.stat} key={item.label}>
          <dt className={styles.statValue}>{item.value}</dt>
          <dd className={styles.statLabel}>{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}

const ORDER: DocStatus[] = ['generated', 'custom', 'mixed'];

/** Explains the Generated / Custom / Mixed vocabulary used across the site. */
export function ContentLegend(): ReactNode {
  return (
    <ul className={styles.legend}>
      {ORDER.map((status) => (
        <li className={styles.legendItem} key={status}>
          <StatusBadge status={status} />
          <p className={styles.legendText}>
            <span className={styles.srOnly}>{DOC_STATUS_LABEL[status]}: </span>
            {DOC_STATUS_DESCRIPTION[status]}
          </p>
        </li>
      ))}
    </ul>
  );
}
