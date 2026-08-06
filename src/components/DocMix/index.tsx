import React, {type ReactNode} from 'react';
import {basePath} from '@site/src/data/catalog';
import {useDocsStatus} from '@site/src/data/useDocsStatus';
import styles from './styles.module.css';

export type DocMixProps = {
  system: string;
  component?: string;
  /** Show the word "pages" after the counts. */
  verbose?: boolean;
};

/**
 * How many generated and how many hand-written pages a system or component has.
 *
 * A set of pages does not have a single origin, so it does not get a status
 * badge — it gets counts. Two honest numbers instead of one aggregate word.
 */
export default function DocMix({system, component, verbose}: DocMixProps): ReactNode {
  const {generated, custom} = useDocsStatus().countUnder(basePath(system, component));
  return (
    <span className={styles.mix}>
      <span className={styles.generated}>{generated} generated</span>
      <span className={styles.sep} aria-hidden="true">
        ·
      </span>
      <span className={styles.custom}>{custom} custom</span>
      {verbose ? <span className={styles.suffix}>pages</span> : null}
    </span>
  );
}
