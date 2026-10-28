import { browser, defineBackground } from '#imports';

export default defineBackground(() => {
  // The toolbar button opens the settings page (no popup).
  (browser.action ?? browser.browserAction).onClicked.addListener(() => {
    void browser.runtime.openOptionsPage();
  });

  // Content scripts cannot open the options page themselves.
  browser.runtime.onMessage.addListener((message: unknown) => {
    if ((message as { type?: string })?.type === 'open-options') {
      void browser.runtime.openOptionsPage();
    }
  });
});
