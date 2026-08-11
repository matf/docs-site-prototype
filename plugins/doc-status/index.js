/**
 * Collects the documentation origin of every page into global data.
 *
 * Each documentation page declares `doc_status: generated | custom` in its
 * frontmatter. This plugin reads that from the docs plugin's own loaded content
 * — so the mapping is always exactly what was published — and exposes it as
 * `{ [permalink]: status }`.
 *
 * Two things depend on it:
 *
 *   - `Arc42SectionNav` renders only the arc42 sections that actually exist for
 *     a system or component, with the right badge. Deleting a section file
 *     removes it from the navigation; no list has to be maintained by hand.
 *   - `SystemCard` / `ComponentCard` / `DocMix` count generated and custom pages
 *     instead of asserting an aggregate status.
 *
 * There is deliberately no third value. A page is either generated or written
 * by hand; a page that would be "both" is split into two pages.
 */

const DOCS_PLUGIN = 'docusaurus-plugin-content-docs';
const VALID = ['generated', 'custom'];

/** @returns {import('@docusaurus/types').Plugin} */
module.exports = function docStatusPlugin() {
  return {
    name: 'acme-doc-status',

    async allContentLoaded({allContent, actions}) {
      const byPermalink = {};

      const docsPlugins = allContent[DOCS_PLUGIN] ?? {};
      for (const instance of Object.values(docsPlugins)) {
        for (const version of instance?.loadedVersions ?? []) {
          for (const doc of version.docs ?? []) {
            const status = doc.frontMatter?.doc_status;
            if (status === undefined) {
              continue;
            }
            if (!VALID.includes(status)) {
              throw new Error(
                `Invalid doc_status "${status}" in ${doc.source}. ` +
                  `Expected one of: ${VALID.join(', ')}.`,
              );
            }
            byPermalink[doc.permalink] = status;
          }
        }
      }

      actions.setGlobalData({byPermalink});
    },
  };
};
