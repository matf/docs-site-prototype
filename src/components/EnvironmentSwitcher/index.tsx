import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import clsx from 'clsx';
import {
  ENVIRONMENTS,
  useEnvironment,
  withoutEnvironment,
  type Environment,
} from '@site/src/data/environments';
import {useDocsStatus} from '@site/src/data/useDocsStatus';
import styles from './styles.module.css';

/**
 * Where the same page lives in another environment.
 *
 * The reader almost always wants to stay on the page they are reading, so the
 * switcher keeps the path. When that page does not exist on the target — a
 * component deployed on DEV but not yet in production — it walks up to the
 * nearest ancestor that does, rather than offering a link into a 404.
 */
function targetPath(currentRelative: string, known: (path: string) => boolean): string {
  const segments = currentRelative.split('/').filter(Boolean);
  while (segments.length > 0) {
    const candidate = `/${segments.join('/')}/`;
    if (known(candidate)) {
      return candidate;
    }
    segments.pop();
  }
  return '/';
}

export default function EnvironmentSwitcher(): ReactNode {
  const current = useEnvironment();
  const {pathname} = useLocation();
  const {
    siteConfig: {baseUrl},
  } = useDocusaurusContext();
  const {existsIn} = useDocsStatus();

  const sitePath = pathname.startsWith(baseUrl) ? `/${pathname.slice(baseUrl.length)}` : pathname;
  const relative = withoutEnvironment(sitePath);

  const linkFor = (environment: Environment) => {
    // Resolve against the *target* environment: a component deployed on DEV but
    // not in production has no page there, so the switcher walks up to the
    // nearest ancestor that does exist rather than offering a 404.
    const path = targetPath(relative, (candidate) => existsIn(environment.id, candidate));
    return `${environment.routePrefix}${path}`;
  };

  return (
    <div className={clsx('dropdown', 'dropdown--hoverable', 'dropdown--right', styles.switcher)}>
      <button
        className={clsx('navbar__link', styles.trigger)}
        aria-haspopup="true"
        aria-label={`Environment: ${current.label}. Switch environment`}
        type="button">
        <span className={clsx(styles.code, styles[`code_${current.id}`])}>{current.short}</span>
        <span className={styles.triggerLabel}>{current.label}</span>
      </button>
      <ul className="dropdown__menu">
        {ENVIRONMENTS.map((environment) => (
          <li key={environment.id}>
            <Link
              className={clsx('dropdown__link', styles.option)}
              to={linkFor(environment)}
              aria-current={environment.id === current.id ? 'true' : undefined}>
              <span className={clsx(styles.code, styles[`code_${environment.id}`])}>
                {environment.short}
              </span>
              <span className={styles.optionBody}>
                <span className={styles.optionLabel}>{environment.label}</span>
                <span className={styles.optionNote}>{environment.reflects}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
