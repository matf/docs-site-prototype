import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {DOC_STATUS_DESCRIPTION, DOC_STATUS_LABEL, type DocStatus} from '@site/src/data/catalog';
import styles from './styles.module.css';

export type StatusBadgeProps = {
  status: DocStatus;
  /** Render the compact variant used inside tables and cards. */
  small?: boolean;
  /** Extra text appended after the label, e.g. a section name. */
  children?: ReactNode;
  className?: string;
};

/**
 * The `Generated` / `Custom` / `Mixed` marker used everywhere on this site.
 * A single component so the vocabulary can never drift between pages.
 */
export default function StatusBadge({
  status,
  small,
  children,
  className,
}: StatusBadgeProps): ReactNode {
  return (
    <span
      className={clsx(styles.badge, styles[status], small && styles.small, className)}
      title={DOC_STATUS_DESCRIPTION[status]}>
      <span className={styles.dot} aria-hidden="true" />
      {DOC_STATUS_LABEL[status]}
      {children ? <span className={styles.suffix}>{children}</span> : null}
    </span>
  );
}
