import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Globe } from 'lucide-react';
import { appName, appRepositoryUrl, websiteUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <img src="/logo-light.svg" alt={appName} className="h-6 w-auto dark:hidden" />
          <img src="/logo-dark.svg" alt={appName} className="hidden h-6 w-auto dark:block" />
        </>
      ),
      url: '/',
    },
    links: [
      {
        type: 'icon',
        label: 'databasify.io',
        text: 'databasify.io',
        icon: <Globe />,
        url: websiteUrl,
        external: true,
      },
    ],
    githubUrl: appRepositoryUrl,
  };
}
