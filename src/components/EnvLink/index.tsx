import React, {type ComponentProps, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useEnvPath} from '@site/src/data/environments';

/**
 * A `Link` that keeps the reader inside the current environment.
 *
 * Every documentation component uses this instead of `@docusaurus/Link`, so
 * link targets can be written environment-relative (`/systems/…`) exactly once
 * and still resolve to `/dev/systems/…` on the DEV tree. Markdown prose gets the
 * same treatment from the `remark-env-links` plugin.
 */
export default function EnvLink({
  to,
  ...rest
}: ComponentProps<typeof Link>): ReactNode {
  const envPath = useEnvPath();
  return <Link to={typeof to === 'string' ? envPath(to) : to} {...rest} />;
}
