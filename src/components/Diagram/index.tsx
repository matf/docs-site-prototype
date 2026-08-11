import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import type {DocStatus} from '@site/src/data/catalog';
import StatusBadge from '@site/src/components/StatusBadge';
import styles from './styles.module.css';

export type DiagramProps = {
  title: string;
  /** Defaults to `generated` — diagrams on this site come from the generator. */
  status?: DocStatus;
  /** Short caption placed under the figure. */
  caption?: ReactNode;
  /** e.g. `acme-archdoc 0.7.2 · declaration-intake-service@9c1e40d`. */
  source?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Frame around every diagram on the site.
 *
 * Gives each diagram a title, a provenance line and — importantly for a
 * documentation portal that mixes hand-drawn and generated content — a marker
 * saying where the picture comes from. Also owns the horizontal scrolling, so
 * wide Mermaid graphs never push the page sideways on mobile.
 */
export default function Diagram({
  title,
  status = 'generated',
  caption,
  source,
  children,
  className,
}: DiagramProps): ReactNode {
  return (
    <figure className={clsx(styles.figure, className)}>
      <div className={styles.head}>
        <span className={styles.title}>{title}</span>
        <StatusBadge status={status} small />
      </div>
      <div className={styles.canvas}>{children}</div>
      {caption || source ? (
        <figcaption className={styles.caption}>
          {caption}
          {source ? (
            <span className={styles.source}>
              Source: <code>{source}</code>
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
