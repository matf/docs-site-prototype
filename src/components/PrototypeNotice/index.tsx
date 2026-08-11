import React, {type ReactNode} from 'react';
import styles from './styles.module.css';

/**
 * Standing reminder that everything on this site is invented.
 *
 * Used on the start page and on the system and component landing pages so a
 * reader who deep-links into the tree cannot mistake the sample architecture
 * for real architecture information.
 */
export default function PrototypeNotice({children}: {children?: ReactNode}): ReactNode {
  return (
    <aside className={styles.notice} role="note">
      <strong className={styles.label}>Prototype content</strong>
      <span>
        {children ??
          'All systems, components, teams, decisions, message contracts and metadata on this site are fictional. They illustrate the navigation model only and are not the architecture information of any real organisation.'}
      </span>
    </aside>
  );
}
