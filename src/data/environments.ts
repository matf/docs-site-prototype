import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import environments from '@site/content/environments.json';

export type Environment = {
  readonly id: string;
  /** Short code shown in the switcher and the banner, e.g. `DEV`. */
  readonly short: string;
  readonly label: string;
  /** `/dev`, or `''` for the environment served at the site root. */
  readonly routePrefix: string;
  readonly order: number;
  /** What the tree on this environment reflects. */
  readonly reflects: string;
  readonly regeneration: string;
  readonly indexable: boolean;
};

export const ENVIRONMENTS: readonly Environment[] = [...environments.environments].sort(
  (a, b) => a.order - b.order,
);

export const DEFAULT_ENVIRONMENT: Environment = ENVIRONMENTS.find(
  (e) => e.id === environments.defaultEnvironment,
)!;

export function environmentById(id: string): Environment {
  const environment = ENVIRONMENTS.find((e) => e.id === id);
  if (!environment) {
    throw new Error(
      `Unknown environment "${id}". Known: ${ENVIRONMENTS.map((e) => e.id).join(', ')}`,
    );
  }
  return environment;
}

/** Every prefix that is not the root environment, longest first. */
const PREFIXED = ENVIRONMENTS.filter((e) => e.routePrefix).sort(
  (a, b) => b.routePrefix.length - a.routePrefix.length,
);

/**
 * The environment a site-relative path belongs to.
 *
 * The root environment owns everything that is not claimed by a prefix, so the
 * check has to run prefix-first.
 */
export function environmentOfPath(sitePath: string): Environment {
  const match = PREFIXED.find(
    (e) => sitePath === e.routePrefix || sitePath.startsWith(`${e.routePrefix}/`),
  );
  return match ?? DEFAULT_ENVIRONMENT;
}

/** Strip the environment prefix, leaving an environment-relative path. */
export function withoutEnvironment(sitePath: string): string {
  const environment = environmentOfPath(sitePath);
  if (!environment.routePrefix) {
    return sitePath;
  }
  const rest = sitePath.slice(environment.routePrefix.length);
  return rest === '' ? '/' : rest;
}

/**
 * The environment the reader is currently in, derived from the URL.
 *
 * Deriving it from the route rather than from a stored preference means a
 * shared link always opens the environment it points at.
 */
export function useEnvironment(): Environment {
  const {pathname} = useLocation();
  const {
    siteConfig: {baseUrl},
  } = useDocusaurusContext();
  const sitePath = pathname.startsWith(baseUrl)
    ? `/${pathname.slice(baseUrl.length)}`
    : pathname;
  return environmentOfPath(sitePath);
}

/**
 * What each system and component looks like on each environment.
 *
 * Keyed `<systemId>` or `<systemId>/<componentId>`. This is the delta that makes
 * the four trees different: the revision the documentation was generated from,
 * when that happened, and what that revision is. In the target picture a
 * generator writes this file after each promotion.
 */
export type EnvSourceState = {
  readonly revision: string;
  readonly generatedAt: string;
  /** What the revision is — a branch head, a promoted build, a release tag. */
  readonly note: string;
};

const SOURCE_STATE: Record<string, Record<string, EnvSourceState>> = {
  dev: {
    'example-system-a': {revision: '4d90c11', generatedAt: '2026-08-06 06:00 UTC', note: 'main@HEAD'},
    'example-system-a/example-component-a': {revision: 'f18ba07', generatedAt: '2026-08-06 06:00 UTC', note: 'main@HEAD'},
    'example-system-a/example-component-b': {revision: '2ac54e9', generatedAt: '2026-08-06 06:00 UTC', note: 'main@HEAD'},
    'example-system-b': {revision: 'c7714d2', generatedAt: '2026-08-06 06:00 UTC', note: 'main@HEAD'},
    'example-system-b/example-component-c': {revision: '9e30f5a', generatedAt: '2026-08-06 06:00 UTC', note: 'main@HEAD'},
  },
  ref: {
    'example-system-a': {revision: 'a41f7c9', generatedAt: '2026-08-04 03:12 UTC', note: 'integration baseline 2026.31'},
    'example-system-a/example-component-a': {revision: '9c1e40d', generatedAt: '2026-08-04 03:12 UTC', note: 'integration baseline 2026.31'},
    'example-system-a/example-component-b': {revision: '3fd8b52', generatedAt: '2026-08-04 03:14 UTC', note: 'integration baseline 2026.31'},
    'example-system-b': {revision: '7b20ae1', generatedAt: '2026-08-03 03:09 UTC', note: 'integration baseline 2026.31'},
    'example-system-b/example-component-c': {revision: 'd52c118', generatedAt: '2026-08-03 03:10 UTC', note: 'integration baseline 2026.31'},
  },
  abn: {
    'example-system-a': {revision: '8b1002f', generatedAt: '2026-07-28 19:40 UTC', note: 'release candidate 2.5.0-rc3'},
    'example-system-a/example-component-a': {revision: '61d4a0c', generatedAt: '2026-07-28 19:40 UTC', note: 'release candidate 2.5.0-rc3'},
    'example-system-a/example-component-b': {revision: 'be07f31', generatedAt: '2026-07-28 19:41 UTC', note: 'release candidate 2.5.0-rc3'},
    'example-system-b': {revision: '05aa3c8', generatedAt: '2026-07-27 19:38 UTC', note: 'release candidate 1.9.0-rc1'},
    'example-system-b/example-component-c': {revision: 'ff2b6d4', generatedAt: '2026-07-27 19:38 UTC', note: 'release candidate 1.9.0-rc1'},
  },
  prod: {
    'example-system-a': {revision: '3e77b40', generatedAt: '2026-07-09 04:15 UTC', note: 'release 2.4.1'},
    'example-system-a/example-component-a': {revision: 'cc51e82', generatedAt: '2026-07-09 04:15 UTC', note: 'release 2.4.1'},
    'example-system-a/example-component-b': {revision: '7a9d013', generatedAt: '2026-07-09 04:16 UTC', note: 'release 2.4.1'},
    'example-system-b': {revision: '1f4e6ab', generatedAt: '2026-06-25 04:12 UTC', note: 'release 1.8.2'},
    'example-system-b/example-component-c': {revision: 'b3c9077', generatedAt: '2026-06-25 04:12 UTC', note: 'release 1.8.2'},
  },
};

/** Source state of one system or component on one environment, if recorded. */
export function sourceState(
  environmentId: string,
  systemId: string,
  componentId?: string,
): EnvSourceState | undefined {
  const key = componentId ? `${systemId}/${componentId}` : systemId;
  return SOURCE_STATE[environmentId]?.[key];
}

/**
 * Prefixes an environment-relative documentation path for the current
 * environment. All authored links are environment-relative; this is what keeps
 * a reader inside the environment they are looking at.
 */
export function useEnvPath(): (path: string) => string {
  const {routePrefix} = useEnvironment();
  return (path: string) =>
    routePrefix && path.startsWith('/') ? `${routePrefix}${path}` : path;
}
