import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import IconHome from '@theme/Icon/Home';
import {useEnvPath} from '@site/src/data/environments';
import styles from './styles.module.css';

/**
 * The home crumb points at the start page of the current environment.
 *
 * Docusaurus resolves it against the site root, which is production — from a
 * DEV page that quietly moves the reader to a different environment.
 */
export default function HomeBreadcrumbItem(): ReactNode {
  const envPath = useEnvPath();
  return (
    <li className="breadcrumbs__item">
      <Link
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.home',
          message: 'Home page',
          description: 'The ARIA label for the home page in the breadcrumbs',
        })}
        className="breadcrumbs__link"
        href={envPath('/')}>
        <IconHome className={styles.breadcrumbHomeIcon} />
      </Link>
    </li>
  );
}
