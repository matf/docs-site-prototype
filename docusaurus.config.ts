import type * as Preset from '@docusaurus/preset-classic';
import type {Config} from '@docusaurus/types';
import {themes as prismThemes} from 'prism-react-renderer';

const organizationName = 'matf';
const projectName = 'docs-site-prototype';
const repoUrl = `https://github.com/${organizationName}/${projectName}`;

const config: Config = {
  title: 'BAZG System Documentation',
  tagline: 'Architecture documentation for BAZG systems and components (arc42) — prototype',
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

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          // Docs-only mode: the documentation tree is the site.
          routeBasePath: '/',
          path: 'docs',
          sidebarPath: './sidebars.ts',
          editUrl: `${repoUrl}/edit/main/`,
          showLastUpdateTime: true,
          breadcrumbs: true,
        },
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
          'Prototype of the BAZG system documentation portal: one arc42-structured documentation tree for systems and components, mixing generated and manually maintained content.',
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
      title: 'BAZG System Documentation',
      logo: {
        alt: 'BAZG System Documentation (prototype)',
        src: 'img/logo.svg',
        width: 28,
        height: 28,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Systems',
        },
        {to: '/conventions/', label: 'Documentation Conventions', position: 'left'},
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
        'Prototype only. All systems, components, teams and architecture data on this site are fictional and are not BAZG architecture information.',
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
