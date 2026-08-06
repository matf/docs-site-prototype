import React, {type ReactNode} from 'react';
import Logo from '@theme/Logo';
import type {Props as LogoProps} from '@theme/Logo';
import {useEnvPath} from '@site/src/data/environments';

/**
 * The wordmark links to the start page of the environment the reader is in.
 *
 * Docusaurus points the brand at the site root, which is production. From DEV
 * that is a one-click way out of the environment you were reading, without any
 * indication that it happened.
 */
export default function NavbarLogo(): ReactNode {
  const envPath = useEnvPath();
  // `Logo` forwards unknown props to its `Link`, but does not declare `to`.
  const props = {
    to: envPath('/'),
    className: 'navbar__brand',
    imageClassName: 'navbar__logo',
    titleClassName: 'navbar__title text--truncate',
  } as LogoProps;
  return <Logo {...props} />;
}
