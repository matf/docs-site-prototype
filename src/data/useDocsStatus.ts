import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {usePluginData} from '@docusaurus/useGlobalData';
import {
  environmentById,
  environmentOfPath,
  useEnvironment,
  withoutEnvironment,
} from './environments';
import {basePath, structurePath, type DocStatus} from './catalog';
import {DEFAULT_STRUCTURE, docStructure, type DocSection} from './structures';

type DocStatusGlobalData = {byPermalink: Record<string, DocStatus>};

/** Compare routes without caring about the trailing slash. */
function normalise(path: string): string {
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

export type DocsStatusIndex = {
  /** Status of one route, or `undefined` if the page does not exist. */
  statusOf: (path: string) => DocStatus | undefined;
  /** Whether a page exists at this route in the current environment. */
  exists: (path: string) => boolean;
  /**
   * Whether the same page exists in another environment. Needed by the
   * environment switcher, which must not offer a link into a 404.
   */
  existsIn: (environmentId: string, path: string) => boolean;
  /** The sections of one structure actually documented for a system or component. */
  sectionsOf: (
    systemId: string,
    componentId?: string,
    structureId?: string,
  ) => {section: DocSection; status: DocStatus}[];
  /** Generated/custom page counts below a route prefix. */
  countUnder: (prefix: string) => {generated: number; custom: number; total: number};
};

/**
 * Documentation origin per published route, read from the `acme-doc-status`
 * plugin's global data.
 *
 * Everything here is derived from what was actually published, so a structure
 * or a section that has no page simply does not appear — there are no empty or
 * placeholder nodes anywhere in the navigation.
 */
export function useDocsStatus(): DocsStatusIndex {
  const {
    siteConfig: {baseUrl},
  } = useDocusaurusContext();
  const {byPermalink} = usePluginData('acme-doc-status') as DocStatusGlobalData;
  const environment = useEnvironment();

  // Keyed environment-relative and restricted to the current environment, so
  // every caller can ask about `/systems/…` without knowing where it is.
  const bySitePath = new Map<string, DocStatus>();
  // Every environment, keyed `<envId>|<environment-relative path>`.
  const allEnvironments = new Set<string>();
  for (const [permalink, status] of Object.entries(byPermalink)) {
    const sitePath = permalink.startsWith(baseUrl)
      ? `/${permalink.slice(baseUrl.length)}`
      : permalink;
    const owner = environmentOfPath(sitePath);
    const relative = normalise(withoutEnvironment(sitePath));
    allEnvironments.add(`${owner.id}|${relative}`);
    if (owner.id === environment.id) {
      bySitePath.set(relative, status);
    }
  }

  const statusOf = (path: string) => bySitePath.get(normalise(path));

  return {
    statusOf,
    exists: (path) => statusOf(path) !== undefined,
    existsIn: (environmentId, path) =>
      allEnvironments.has(`${environmentById(environmentId).id}|${normalise(path)}`),
    sectionsOf: (systemId, componentId, structureId = DEFAULT_STRUCTURE) => {
      const base = structurePath(systemId, componentId, structureId);
      return docStructure(structureId).sections.flatMap((section) => {
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
