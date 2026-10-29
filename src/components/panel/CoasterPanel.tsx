import { browser } from "#imports";
import { t, withStars } from "@/lib/i18n";
import type { CaptainPage } from "@/lib/captain";
import { CoasterCriteriaList } from "@/components/panel/CoasterCriteriaList";
import { CoasterSummary } from "@/components/panel/CoasterSummary";
import { StarsLabel } from "@/components/panel/StarsLabel";
import { useCoasterPanel } from "@/hooks/useCoasterPanel";
import "./panel.css";
import "@/components/stars/StarInput.css";

export function CoasterPanel({ page }: { page: CaptainPage }) {
  const panel = useCoasterPanel(page);

  return (
    <div
      ref={panel.rootRef}
      onFocusCapture={panel.captureFocusKey}>
      <section
        className="cn"
        aria-labelledby="cn-title">
        <header className="cn__head">
          <p className="cn__eyebrow">Captain Note</p>
          <h2
            id="cn-title"
            className="cn__title">
            {t.panelTitle}
          </h2>
        </header>
        <p
          id="cn-help"
          className="cn-sr">
          {t.keyboardHelp}
        </p>
        <ul
          className="cn__list"
          aria-label={t.criteriaListLabel}>
          <CoasterCriteriaList
            active={panel.active}
            rating={panel.rating}
            onScore={panel.setScore}
          />
        </ul>

        <CoasterSummary
          value={panel.value}
          raw={panel.raw}
          counted={panel.counted}
          activeCount={panel.activeCount}
          captainValue={panel.captainValue}
          busy={panel.busy}
          status={panel.status}
        />

        <button
          type="button"
          className="cn__send"
          data-focus-key="send"
          aria-disabled={!panel.canSend}
          aria-describedby={panel.reason ? "cn-send-why" : undefined}
          onClick={() => void panel.send()}>
          {panel.busy ? (
            t.sendingShort
          ) : panel.upToDate ? (
            t.upToDate
          ) : panel.value === null ? (
            t.send
          ) : (
            <>
              {withStars(t.sendStars)[0]}
              <StarsLabel value={panel.value} />
              {withStars(t.sendStars)[1]}
            </>
          )}
        </button>
        <p
          id="cn-send-why"
          className="cn__hint"
          hidden={!panel.reason}>
          {panel.reason ?? ""}
        </p>
        <button
          type="button"
          className="cn__settings"
          data-focus-key="settings"
          onClick={() => void browser.runtime.sendMessage({ type: "open-options" })}>
          {t.manageCriteria}
          <span className="cn-sr">{t.opensNewTab}</span>
        </button>
        <div
          ref={panel.regionRef}
          className="cn__live cn-sr"
          role="status"
        />
        <div
          ref={panel.alertRef}
          className="cn__alert cn-sr"
          role="alert"
        />
      </section>
    </div>
  );
}
