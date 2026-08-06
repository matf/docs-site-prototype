import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';

export type DocsStats = {
  /** Every documentation page in the tree, including landing pages. */
  totalPages: number;
  /** Pages below `/systems/<systemId>/`, components included. */
  pagesInSystem: (systemId: string) => number;
  /** Pages below `/systems/<systemId>/components/<componentId>/`. */
  pagesInComponent: (systemId: string, componentId: string) => number;
};

/**
 * Page counts read from the docs plugin's own route data.
 *
 * Counting live rather than hard-coding numbers means the landing page and the
 * system cards stay correct when documentation is added — including when a
 * generator drops new MDX files into the tree.
 */
export function useDocsStats(): DocsStats {
  const {
    siteConfig: {baseUrl},
  } = useDocusaurusContext();
  const allDocsData = useAllDocsData();
  const paths = Object.values(allDocsData)
    .flatMap((pluginData) => pluginData.versions)
    .flatMap((version) => version.docs)
    .map((doc) => doc.path)
    .map((path) => (path.startsWith(baseUrl) ? `/${path.slice(baseUrl.length)}` : path));

  const countUnder = (prefix: string) =>
    paths.filter((path) => path.startsWith(prefix) && path !== prefix).length;

  return {
    totalPages: paths.length,
    pagesInSystem: (systemId) => countUnder(`/systems/${systemId}/`),
    pagesInComponent: (systemId, componentId) =>
      countUnder(`/systems/${systemId}/components/${componentId}/`),
  };
}
