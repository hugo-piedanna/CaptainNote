import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: ({ browser }) => ({
    // Manifest strings follow the browser language (public/_locales, FR-ui-locale-multi).
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    permissions: ['storage'],
    host_permissions: ['https://captaincoaster.com/*'],
    action: { default_title: '__MSG_actionTitle__' },
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
