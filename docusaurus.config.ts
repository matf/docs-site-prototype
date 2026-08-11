import fs from 'node:fs';
import path from 'node:path';
import type * as Preset from '@docusaurus/preset-classic';
import type {Config} from '@docusaurus/types';
import {themes as prismThemes} from 'prism-react-renderer';
import environments from './content/environments.json';

const organizationName = 'matf';
const projectName = 'docs-site-prototype';
const repoUrl = `https://github.com/${organizationName}/${projectName}`;

type EnvironmentConfig = (typeof environments.environments)[number];

const ENVIRONMENTS = environments.environments;
const ROOT_ENVIRONMENT = ENVIRONMENTS.find((e) => e.id === environments.defaultEnvironment)!;

/**
 * Documentation options for one environment.
 *
 * Every environment is a separate docs plugin instance reading its own composed
 * tree. They are peers: the default environment is served at the site root so
 * its URLs stay stable, the others sit behind a prefix.
 */
function docsOptions(environment: EnvironmentConfig) {
  const contentPath = `docs-build/${environment.id}`;

  // Written by scripts/prepare-docs.mjs: composed file -> the file it came from.
  const sourcesFile = path.join(__dirname, contentPath, '.sources.json');
  const sources: Record<string, string> = fs.existsSync(sourcesFile)
    ? JSON.parse(fs.readFileSync(sourcesFile, 'utf8'))
    : {};

  return {
    path: contentPath,
    routeBasePath: environment.routePrefix || '/',
    sidebarPath: './sidebars.ts',
    breadcrumbs: true,
    // Composed trees are generated and not in git, so "last updated" would be
    // meaningless. Pages carry their own generation or review metadata instead.
    showLastUpdateTime: false,
    // Point "Edit this page" at the authored source, not the composed copy.
    editUrl: ({docPath}: {docPath: string}) =>
      `${repoUrl}/edit/main/${sources[docPath] ?? `content/base/${docPath}`}`,
    remarkPlugins: [[require('./plugins/remark-env-links'), {prefix: environment.routePrefix}]],
  };
}

const config: Config = {
  title: 'Acme System Documentation',
  tagline: 'Architecture documentation for Acme systems and components (arc42) — prototype',
  favicon: 'img/favicon.svg',

  // GitHub Pages project site: https://matf.github.io/docs-site-prototype/
  url: 'https://matf.github.io',
  baseUrl: '/docs-site-prototype/',
  organizationName,
  projectName,
  deploymentBranch: 'gh-pages',

  // Explicit: every route is emitted as <route>/index.html, which is what
  // GitHub Pages serves most reliably from a project sub-path.
  trailingSlash: true,

  // A prototype must not ship dead links.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',

  future: {
    v4: true,
    faster: true,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
      onBrokenMarkdownImages: 'throw',
    },
  },

  plugins: [
    // Collects each page's `doc_status` frontmatter so the navigation can show
    // what exists and where it came from.
    './plugins/doc-status',
    // One docs instance per non-root environment.
    ...ENVIRONMENTS.filter((environment) => environment.id !== ROOT_ENVIRONMENT.id).map(
      (environment): [string, object] => [
        '@docusaurus/plugin-content-docs',
        {id: environment.id, ...docsOptions(environment)},
      ],
    ),
  ],

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        // Docs-only mode: the documentation tree is the site. This instance
        // serves the default environment at the root.
        docs: docsOptions(ROOT_ENVIRONMENT),
        blog: false,
        pages: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: null,
          priority: null,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    metadata: [
      {
        name: 'description',
        content:
          'Prototype of the Acme system documentation portal: one arc42-structured documentation tree for systems and components, with generated and manually maintained pages side by side.',
      },
    ],
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
    navbar: {
      title: 'Acme System Documentation',
      logo: {
        alt: 'Acme System Documentation (prototype)',
        src: 'img/logo.svg',
        width: 28,
        height: 28,
      },
      items: [
        {type: 'custom-envNavLink', to: '/systems/', label: 'Systems', position: 'left'},
        {
          type: 'custom-envNavLink',
          to: '/conventions/',
          label: 'Documentation Conventions',
          position: 'left',
        },
        {type: 'custom-environmentSwitcher', position: 'right'},
        {
          href: repoUrl,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Start page', to: '/'},
            {label: 'Systems', to: '/systems/'},
            {label: 'Documentation conventions', to: '/conventions/'},
          ],
        },
        {
          title: 'Systems',
          items: [
            {label: 'Example System A', to: '/systems/example-system-a/'},
            {label: 'Example System B', to: '/systems/example-system-b/'},
          ],
        },
        {
          title: 'Project',
          items: [
            {label: 'Repository', href: repoUrl},
            {label: 'arc42 (external)', href: 'https://arc42.org/overview'},
          ],
        },
      ],
      copyright:
        'Prototype only. All systems, components, teams and architecture data on this site are fictional and are not the architecture information of any real organisation.',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'java', 'sql'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
