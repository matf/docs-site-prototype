import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Head from '@docusaurus/Head';
import {DEFAULT_ENVIRONMENT, useEnvironment} from '@site/src/data/environments';
import styles from './styles.module.css';

/**
 * Standing marker for non-production environments.
 *
 * The default environment is production and gets no banner, so the normal
 * reading experience is unchanged. Every other tree says plainly what it is —
 * documentation describing DEV is actively misleading if the reader believes
 * they are looking at what runs in production.
 *
 * Non-production trees are also kept out of search engines: they are public, but
 * they are not the canonical documentation.
 */
export default function EnvironmentBanner(): ReactNode {
  const environment = useEnvironment();
  if (environment.id === DEFAULT_ENVIRONMENT.id) {
    return null;
  }
  return (
    <>
      {!environment.indexable ? (
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
      ) : null}
      <aside className={clsx(styles.banner, styles[environment.id])} role="note">
        <span className={styles.code}>{environment.short}</span>
        <span className={styles.text}>
          <strong>{environment.label}</strong> — {environment.reflects} This is not the
          documentation of what is running in production.
        </span>
      </aside>
    </>
  );
}
