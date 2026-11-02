import type { ReactNode } from 'react';

/** Card shell shared by the three sections of the page (FR-options-layout). */
export function Section({
  id,
  title,
  count,
  intro,
  actions,
  children,
}: {
  id: string;
  title: string;
  count?: number;
  intro: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="card"
      aria-labelledby={`${id}-title`}>
      <header className="card__head">
        <div>
          <h2 id={`${id}-title`}>
            {title}
            {count !== undefined && count > 0 && <span className="count"> {count}</span>}
          </h2>
          <div className="card__intro">{intro}</div>
        </div>
        {actions && <div className="card__actions">{actions}</div>}
      </header>
      {children}
    </section>
  );
}
