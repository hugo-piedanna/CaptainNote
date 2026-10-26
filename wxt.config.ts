import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: ({ browser }) => ({
    name: 'Captain Note',
    description:
      'Note les coasters sur Captain Coaster avec tes propres critères. La moyenne est envoyée comme note sur 5.',
    permissions: ['storage'],
    host_permissions: ['https://captaincoaster.com/*'],
    action: { default_title: 'Captain Note : réglages et mes notes' },
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          id: 'captain-note@hugo.dev',
          strict_min_version: '115.0',
          data_collection_permissions: { required: ['none'] },
        },
      },
    }),
  }),
});
