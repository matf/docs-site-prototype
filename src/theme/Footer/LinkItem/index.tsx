import React, {type ReactNode} from 'react';
import LinkItem from '@theme-original/Footer/LinkItem';
import type LinkItemType from '@theme/Footer/LinkItem';
import type {WrapperProps} from '@docusaurus/types';
import Link from '@site/src/components/EnvLink';

type Props = WrapperProps<typeof LinkItemType>;

/**
 * Footer links follow the reader's environment.
 *
 * The footer is configured once in `themeConfig` and is therefore shared by all
 * four environment trees. Without this, "Systems" in the footer would drop a
 * reader who is on DEV back into production.
 */
export default function LinkItemWrapper(props: Props): ReactNode {
  const {item} = props;
  // EnvLink adds the environment prefix; `item.to` stays environment-relative.
  if (item.to) {
    return (
      <Link className={item.className} to={item.to}>
        {item.label}
      </Link>
    );
  }
  return <LinkItem {...props} />;
}
