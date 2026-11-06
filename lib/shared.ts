import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Databasify';
export const appDescription =
  'Open-source, self-hostable DBaaS alternative to DigitalOcean Managed Databases, Amazon RDS & Aiven.';
export const siteUrl = process.env.SITE_URL ?? 'https://docs.databasify.io';
export const websiteUrl = 'https://databasify.io';
export const docsRoute = '/';
export const docsImageRoute = '/og';
export const docsContentRoute = '/llms.mdx';
export const homePageSlugs = ['getting-started', 'introduction'];

export const gitConfig = {
  user: 'databasifylabs',
  repo: 'docs',
  branch: 'main',
};

export const appRepositoryUrl = 'https://github.com/databasifylabs/databasify';

export function getPageEditUrl(page: { path: string }) {
  return `https://github.com/${gitConfig.user}/${gitConfig.repo}/edit/${gitConfig.branch}/content/docs/${page.path}`;
}

export function getPageSourceUrl(page: { path: string }) {
  return `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`;
}

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
