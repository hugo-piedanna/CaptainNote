import ReactDOM from 'react-dom/client';
import { getLocale, resolveLocale, setLocale } from '@/lib/i18n';
import { uiLocaleItem } from '@/lib/store';
import { App } from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);

/**
 * Last Captain Coaster language seen on a coaster page, else the browser's (FR-ui-locale-multi).
 * The app is remounted on change, so unsaved default criteria are read again in the new language.
 */
function render(stored: string | null): void {
  setLocale(resolveLocale(stored ?? navigator.language));
  document.documentElement.lang = getLocale();
  root.render(<App key={getLocale()} />);
}

void uiLocaleItem.getValue().then(render);
uiLocaleItem.watch(render);
