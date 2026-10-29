import ReactDOM from 'react-dom/client';
import { defineContentScript } from '#imports';
import { CoasterPanel } from '@/components/panel/CoasterPanel';
import { readPage, SELECTORS } from '@/lib/captain';
import { resolveLocale, setLocale } from '@/lib/i18n';
import { uiLocaleItem } from '@/lib/store';

export default defineContentScript({
  matches: ['https://captaincoaster.com/*/coasters/*'],
  runAt: 'document_idle',
  cssInjectionMode: 'ui',
  async main(ctx) {
    const page = readPage(document, location);
    if (!page) return;

    // The panel speaks the language of the page; the options page reuses it (FR-ui-locale-multi).
    const locale = resolveLocale(page.locale);
    setLocale(locale);
    if ((await uiLocaleItem.getValue()) !== locale) await uiLocaleItem.setValue(locale);

    const ratingPanel =
      page.widget?.closest(SELECTORS.panel) ?? document.querySelector(SELECTORS.ratingPanel);
    const anchor = ratingPanel ?? document.querySelector('main') ?? document.body;
    const append = ratingPanel ? ('after' as const) : ('first' as const);

    const ui = await createShadowRootUi(ctx, {
      name: 'captain-note-panel',
      position: 'inline',
      anchor,
      append,
      // Keep Captain Coaster `.cc-panel` styles on the host (WXT otherwise resets :host with `all: initial !important`).
      inheritStyles: true,
      onMount: (container, _shadow, shadowHost) => {
        shadowHost.className = 'cc-panel cc-panel__body';
        const app = document.createElement('div');
        container.append(app);
        const root = ReactDOM.createRoot(app);
        root.render(<CoasterPanel page={page} />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
