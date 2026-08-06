import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {usePluginData} from '@docusaurus/useGlobalData';
import {ARC42_SECTIONS, type Arc42Section} from './arc42';
import {basePath, type DocStatus} from './catalog';

type DocStatusGlobalData = {byPermalink: Record<string, DocStatus>};

/** Compare routes without caring about the trailing slash. */
function normalise(path: string): string {
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

export type DocsStatusIndex = {
  /** Status of one route, or `undefined` if the page does not exist. */
  statusOf: (path: string) => DocStatus | undefined;
  /** Whether a page exists at this route. */
  exists: (path: string) => boolean;
  /** The arc42 sections actually documented for a system or component. */
  sectionsOf: (
    systemId: string,
    componentId?: string,
  ) => {section: Arc42Section; status: DocStatus}[];
  /** Generated/custom page counts below a route prefix. */
  countUnder: (prefix: string) => {generated: number; custom: number; total: number};
};

/**
 * Documentation origin per published route, read from the `bazg-doc-status`
 * plugin's global data.
 *
 * Everything here is derived from what was actually published, so a section
 * that has no page simply does not appear — there are no empty or placeholder
 * sections anywhere in the navigation.
 */
export function useDocsStatus(): DocsStatusIndex {
  const {
    siteConfig: {baseUrl},
  } = useDocusaurusContext();
  const {byPermalink} = usePluginData('bazg-doc-status') as DocStatusGlobalData;

  const bySitePath = new Map<string, DocStatus>();
  for (const [permalink, status] of Object.entries(byPermalink)) {
    const withoutBase = permalink.startsWith(baseUrl)
      ? `/${permalink.slice(baseUrl.length)}`
      : permalink;
    bySitePath.set(normalise(withoutBase), status);
  }

  const statusOf = (path: string) => bySitePath.get(normalise(path));

  return {
    statusOf,
    exists: (path) => statusOf(path) !== undefined,
    sectionsOf: (systemId, componentId) => {
      const base = basePath(systemId, componentId);
      return ARC42_SECTIONS.flatMap((section) => {
        const status = statusOf(`${base}${section.slug}/`);
        return status ? [{section, status}] : [];
      });
    },
    countUnder: (prefix) => {
      const normalisedPrefix = normalise(prefix);
      let generated = 0;
      let custom = 0;
      for (const [path, status] of bySitePath) {
        if (path !== normalisedPrefix && path.startsWith(`${normalisedPrefix}/`)) {
          if (status === 'generated') {
            generated += 1;
          } else {
            custom += 1;
          }
        }
      }
      return {generated, custom, total: generated + custom};
    },
  };
}
