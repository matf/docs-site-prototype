import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@site/src/components/EnvLink';
import {withoutEnvironment} from '@site/src/data/environments';

/**
 * A navbar link that stays inside the current environment and highlights
 * itself when the reader is somewhere below it.
 */
export default function EnvNavLink({
  to,
  label,
  mobile,
}: {
  to: string;
  label: string;
  mobile?: boolean;
}): ReactNode {
  const {pathname} = useLocation();
  const {
    siteConfig: {baseUrl},
  } = useDocusaurusContext();
  const sitePath = pathname.startsWith(baseUrl) ? `/${pathname.slice(baseUrl.length)}` : pathname;
  const relative = withoutEnvironment(sitePath);
  const active = relative === to || relative.startsWith(to);

  return (
    <Link
      className={clsx(mobile ? 'menu__link' : 'navbar__item navbar__link', active && 'navbar__link--active')}
      to={to}>
      {label}
    </Link>
  );
}
