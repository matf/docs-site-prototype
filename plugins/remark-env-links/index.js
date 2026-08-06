/**
 * Rewrites root-relative documentation links so they stay inside the
 * environment the page belongs to.
 *
 * Pages are authored once and composed into four trees, so their links are
 * written environment-relative:
 *
 *     [5. Building Block View](/systems/example-system-a/system-architecture/building-block-view/)
 *
 * On the DEV tree that link has to resolve to `/dev/systems/…`, or a reader
 * would silently fall out of DEV and into production. This plugin adds the
 * prefix at build time, once per docs plugin instance, so no author and no
 * generator ever has to think about environments.
 *
 * Links in JSX props are handled the other way round, by the `EnvLink`
 * component — remark never sees those.
 */

/** Site paths that belong to the documentation tree. */
const DOC_ROOTS = ['/systems', '/conventions'];

function isEnvironmentRelative(url) {
  if (typeof url !== 'string' || !url.startsWith('/')) {
    return false; // external, anchor-only or already relative
  }
  if (url.startsWith('//')) {
    return false; // protocol-relative
  }
  return url === '/' || DOC_ROOTS.some((root) => url === root || url.startsWith(`${root}/`));
}

/**
 * @param {{prefix?: string}} options `/dev`, or `''` for the environment served
 *   at the site root.
 */
module.exports = function remarkEnvLinks(options = {}) {
  const prefix = options.prefix ?? '';

  return async (root) => {
    if (!prefix) {
      return; // the root environment needs no rewriting
    }
    const {visit} = await import('unist-util-visit');
    visit(root, ['link', 'definition'], (node) => {
      if (isEnvironmentRelative(node.url)) {
        node.url = `${prefix}${node.url}`;
      }
    });
  };
};
