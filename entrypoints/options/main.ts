import {
  DEFAULT_CRITERIA,
  WEIGHT_LABELS,
  computeAverage,
  formatValue,
  newCriterionId,
  type CoasterRating,
  type Criterion,
} from '@/lib/rating';
import { criteriaItem, deleteRating, exportBackup, importBackup, parseBackup, ratingsItem } from '@/lib/store';

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;

let criteria: Criterion[] = [];
let ratings: Record<string, CoasterRating> = {};

/** Screen reader announcement, through a live region that stays in the page. */
function announce(text: string): void {
  const region = $('#announcer');
  region.textContent = '';
  requestAnimationFrame(() => (region.textContent = text));
}

/**
 * Re-renders a list without losing the keyboard focus. Controls carry a `data-focus-key`
 * ("<id>:<control>"): the focus goes back to the same control, or to the same control of
 * the neighbouring row when this one is gone, or to `fallback` when the list is empty.
 */
function keepFocus(container: HTMLElement, render: () => void, fallback: HTMLElement): void {
  const active = document.activeElement as HTMLElement | null;
  const key = active && container.contains(active) ? active.dataset.focusKey : undefined;
  if (!key) return render();
  const control = key.slice(key.lastIndexOf(':'));
  const sameControl = () => [...container.querySelectorAll<HTMLElement>(`[data-focus-key$="${control}"]`)];
  const index = sameControl().indexOf(active!);
  render();

  const same = container.querySelector<HTMLElement>(`[data-focus-key="${CSS.escape(key)}"]`);
  if (same) {
    if (!same.matches(':disabled')) return same.focus();
    // A move button that just got disabled (row now first or last): its neighbour.
    return same.closest('li, tr')?.querySelector<HTMLElement>('button:not(:disabled)')?.focus();
  }
  const others = sameControl();
  (others[Math.min(index, others.length - 1)] ?? fallback).focus();
}

async function saveCriteria(next: Criterion[]): Promise<void> {
  criteria = next;
  await criteriaItem.setValue(next);
  renderCriteria();
  renderRatings();
}

// ---------- Criteria ----------

function renderCriteria(): void {
  const list = $('#criteria');
  keepFocus(list, () => fillCriteria(list), $('#new-name'));
}

function fillCriteria(list: HTMLElement): void {
  list.replaceChildren();

  criteria.forEach((criterion, index) => {
    const item = document.createElement('li');
    item.className = 'criterion' + (criterion.enabled && criterion.weight > 0 ? '' : ' is-off');

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = criterion.enabled;
    toggle.setAttribute('aria-label', `Activer ${criterion.name}`);
    toggle.dataset.focusKey = `${criterion.id}:toggle`;
    toggle.addEventListener('change', () =>
      saveCriteria(criteria.map((c) => (c.id === criterion.id ? { ...c, enabled: toggle.checked } : c))),
    );

    const name = document.createElement('input');
    name.className = 'criterion__name';
    name.value = criterion.name;
    name.maxLength = 60;
    name.setAttribute('aria-label', `Nom du critère ${index + 1}`);
    name.dataset.focusKey = `${criterion.id}:name`;
    name.addEventListener('change', () => {
      const value = name.value.trim();
      if (!value) return void (name.value = criterion.name);
      void saveCriteria(criteria.map((c) => (c.id === criterion.id ? { ...c, name: value } : c)));
    });

    const weight = document.createElement('select');
    weight.setAttribute('aria-label', `Poids de ${criterion.name}`);
    weight.dataset.focusKey = `${criterion.id}:weight`;
    WEIGHT_LABELS.forEach((label, w) => weight.add(new Option(w === 0 ? label : `${label} ×${w}`, String(w))));
    weight.value = String(criterion.weight);
    weight.addEventListener('change', () =>
      saveCriteria(criteria.map((c) => (c.id === criterion.id ? { ...c, weight: Number(weight.value) } : c))),
    );

    const move = (delta: number) => {
      const next = [...criteria];
      const [moved] = next.splice(index, 1);
      next.splice(index + delta, 0, moved!);
      // keepFocus follows the criterion to its new row.
      void saveCriteria(next).then(() =>
        announce(`${criterion.name} déplacé en position ${index + delta + 1} sur ${next.length}.`),
      );
    };

    const actions = document.createElement('div');
    actions.className = 'criterion__actions';
    actions.append(
      iconButton('↑', `Monter ${criterion.name}`, () => move(-1), `${criterion.id}:up`, index === 0),
      iconButton('↓', `Descendre ${criterion.name}`, () => move(1), `${criterion.id}:down`, index === criteria.length - 1),
      iconButton('✕', `Supprimer ${criterion.name}`, () => {
        if (confirm(`Supprimer le critère « ${criterion.name} » ? Les notes déjà données sur ce critère ne compteront plus.`)) {
          void saveCriteria(criteria.filter((c) => c.id !== criterion.id)).then(() =>
            announce(`Critère ${criterion.name} supprimé.`),
          );
        }
      }, `${criterion.id}:delete`),
    );

    item.append(toggle, name, weight, actions);
    list.append(item);
  });
}

function iconButton(text: string, label: string, onClick: () => void, focusKey: string, disabled = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'icon';
  button.innerHTML = `<span aria-hidden="true">${text}</span>`;
  button.title = label;
  button.setAttribute('aria-label', label);
  button.disabled = disabled;
  button.dataset.focusKey = focusKey;
  button.addEventListener('click', onClick);
  return button;
}

$('#add-criterion').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $<HTMLInputElement>('#new-name');
  const name = input.value.trim();
  if (!name) return;
  void saveCriteria([...criteria, { id: newCriterionId(name, criteria), name, weight: 1, enabled: true }]).then(() =>
    announce(`Critère ${name} ajouté en position ${criteria.length}.`),
  );
  input.value = '';
  input.focus();
});

$('#reset-criteria').addEventListener('click', () => {
  if (confirm('Revenir aux critères par défaut ? Tes critères personnalisés seront retirés (les notes restent stockées).')) {
    void saveCriteria(structuredClone(DEFAULT_CRITERIA)).then(() => announce('Critères par défaut rétablis.'));
  }
});

// ---------- Ratings ----------

function renderRatings(): void {
  keepFocus($('#ratings'), fillRatings, $('#search'));
}

function fillRatings(): void {
  const query = $<HTMLInputElement>('#search').value.trim().toLowerCase();
  const all = Object.values(ratings).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const shown = all.filter((r) => !query || `${r.name} ${r.park}`.toLowerCase().includes(query));

  $('#ratings-count').textContent = all.length ? `(${all.length})` : '';
  $('#ratings-empty').hidden = all.length > 0;
  $('.table-wrap').hidden = shown.length === 0;
  const none = $('#ratings-none');
  none.hidden = all.length === 0 || shown.length > 0;
  none.textContent = `Aucun coaster ne correspond à « ${query} ».`;

  const body = $<HTMLTableSectionElement>('#ratings');
  body.replaceChildren();
  for (const rating of shown) {
    const { value } = computeAverage(criteria, rating.scores);
    const row = body.insertRow();

    const coaster = row.insertCell();
    const link = document.createElement('a');
    link.href = rating.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = rating.name;
    link.dataset.focusKey = `${rating.coasterId}:link`;
    link.insertAdjacentHTML('beforeend', '<span class="sr-only"> (nouvel onglet)</span>');
    const park = document.createElement('span');
    park.className = 'park';
    park.textContent = rating.park;
    coaster.append(link, park);

    const avg = row.insertCell();
    avg.className = 'num strong';
    if (value === null) avg.innerHTML = '<span aria-hidden="true">–</span><span class="sr-only">Aucune</span>';
    else avg.textContent = formatValue(value);

    const sent = row.insertCell();
    sent.className = 'num';
    if (rating.sentValue === null) sent.textContent = 'Pas envoyée';
    else sent.innerHTML = `${formatValue(rating.sentValue)} <span aria-hidden="true">★</span><span class="sr-only">étoile${rating.sentValue > 1 ? 's' : ''}</span>`;
    if (value !== null && rating.sentValue !== value) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = 'à renvoyer';
      badge.title = 'Ta moyenne a changé depuis le dernier envoi. Ouvre la page du coaster pour renvoyer.';
      sent.append(badge);
    }

    row.insertCell().textContent = new Date(rating.updatedAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    row.insertCell().append(
      iconButton('✕', `Supprimer la note de ${rating.name}`, () => {
        if (confirm(`Supprimer ta note détaillée de ${rating.name} ? La note sur Captain Coaster ne change pas.`)) {
          void deleteRating(rating.coasterId).then(() => announce(`Note de ${rating.name} supprimée.`));
        }
      }, `${rating.coasterId}:delete`),
    );
  }
}

let searchTimer: ReturnType<typeof setTimeout> | undefined;
$('#search').addEventListener('input', () => {
  renderRatings();
  // Wait for a pause in typing, or every keystroke would be read out.
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const count = $<HTMLTableSectionElement>('#ratings').rows.length;
    announce(count ? `${count} coaster${count > 1 ? 's' : ''} affiché${count > 1 ? 's' : ''}.` : 'Aucun coaster ne correspond.');
  }, 600);
});

// ---------- Backup ----------

const status = (text: string) => {
  const el = $('#backup-status');
  el.textContent = '';
  requestAnimationFrame(() => (el.textContent = text));
};

$('#export').addEventListener('click', async () => {
  const backup = await exportBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `captain-note-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  status(`${Object.keys(backup.ratings).length} notes exportées.`);
});

$<HTMLInputElement>('#import').addEventListener('change', async (e) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  try {
    const backup = parseBackup(JSON.parse(await file.text()));
    const replace = $<HTMLInputElement>('#import-replace').checked;
    if (replace && !confirm('Remplacer toutes tes notes et tes critères par ceux du fichier ?')) return;
    await importBackup(backup, replace ? 'replace' : 'merge');
    status(`${Object.keys(backup.ratings).length} notes importées.`);
  } catch (error) {
    status(error instanceof SyntaxError ? 'Fichier JSON invalide.' : (error as Error).message);
  }
});

// ---------- Init ----------

async function init(): Promise<void> {
  criteria = await criteriaItem.getValue();
  ratings = await ratingsItem.getValue();
  renderCriteria();
  renderRatings();
  criteriaItem.watch((next) => {
    criteria = next ?? DEFAULT_CRITERIA;
    renderCriteria();
    renderRatings();
  });
  ratingsItem.watch((next) => {
    ratings = next ?? {};
    renderRatings();
  });
}

void init();
