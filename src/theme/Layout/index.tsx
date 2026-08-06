import React, {type ReactNode} from 'react';
import Layout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';
import type {WrapperProps} from '@docusaurus/types';
import EnvironmentBanner from '@site/src/components/EnvironmentBanner';

type Props = WrapperProps<typeof LayoutType>;

/** Puts the environment banner above everything, on every page. */
export default function LayoutWrapper(props: Props): ReactNode {
  return (
    <>
      <EnvironmentBanner />
      <Layout {...props} />
    </>
  );
}
