import React, {type ReactNode} from 'react';
import Link from '@site/src/components/EnvLink';
import type {DocStatus} from '@site/src/data/catalog';
import StatusBadge from '@site/src/components/StatusBadge';
import styles from './styles.module.css';

export type RelatedDocItem = {
  to: string;
  label: string;
  /** Why the reader would follow this link. */
  note?: string;
  status?: DocStatus;
};

/**
 * Related-document links.
 *
 * Every page that shows generated content is expected to point at the custom
 * explanation next to it and vice versa — this component is how the site keeps
 * that promise without dead ends.
 */
export default function RelatedDocs({
  title = 'Related documentation',
  items,
}: {
  title?: string;
  items: RelatedDocItem[];
}): ReactNode {
  return (
    <aside className={styles.box} aria-label={title}>
      <h4 className={styles.title}>{title}</h4>
      <ul className={styles.list}>
        {items.map((item) => (
          <li className={styles.item} key={item.to + item.label}>
            <Link className={styles.link} to={item.to}>
              {item.label}
            </Link>
            {item.status ? <StatusBadge status={item.status} small /> : null}
            {item.note ? <span className={styles.note}>{item.note}</span> : null}
          </li>
        ))}
      </ul>
    </aside>
  );
}
