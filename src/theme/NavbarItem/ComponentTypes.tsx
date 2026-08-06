import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import EnvironmentSwitcher from '@site/src/components/EnvironmentSwitcher';
import EnvNavLink from '@site/src/components/EnvNavLink';

/**
 * Custom navbar item types.
 *
 * The navbar has to stay inside the environment the reader is in, so its
 * documentation links go through `EnvNavLink` rather than Docusaurus' static
 * `to`, which would always resolve against the root environment.
 */
export default {
  ...ComponentTypes,
  'custom-environmentSwitcher': EnvironmentSwitcher,
  'custom-envNavLink': EnvNavLink,
};
