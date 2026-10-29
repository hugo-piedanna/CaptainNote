import { useEffect, useId, useRef, useState } from 'react';
import { t } from '@/lib/i18n';
import { MAX_VALUE, MIN_VALUE, type Score } from '@/lib/rating';
import { scoreText } from '@/lib/scoreText';
import './StarInput.css';

const STAR_PATH =
  'M12 2.8l2.7 6.1 6.6.6-5 4.4 1.5 6.5L12 17l-5.8 3.4 1.5-6.5-5-4.4 6.6-.6z';

export interface StarInputProps {
  label: string;
  value: Score;
  onChange: (value: Score) => void;
  starsFocusKey?: string;
  clearFocusKey?: string;
  describedBy?: string;
}

export function StarInput({ label, value: valueProp, onChange, starsFocusKey, clearFocusKey, describedBy }: StarInputProps) {
  const id = useId().replace(/:/g, '');
  const sliderRef = useRef<HTMLDivElement>(null);
  const lastScore = useRef<number | null>(valueProp);
  const [value, setValue] = useState(valueProp);
  const valueRef = useRef(valueProp);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<Score | null>(null);

  useEffect(() => {
    setValue(valueProp);
    valueRef.current = valueProp;
    if (valueProp !== null) lastScore.current = valueProp;
  }, [valueProp]);

  const shown = preview ?? value;

  const paintFill = (starIndex: number, v: Score) => (v === null ? 0 : Math.min(1, Math.max(0, v - starIndex)));

  const commit = (next: Score) => {
    setPreview(null);
    if (next === valueRef.current) return;
    valueRef.current = next;
    setValue(next);
    if (next !== null) lastScore.current = next;
    onChange(next);
  };

  const valueAt = (clientX: number): number => {
    const rect = sliderRef.current!.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * MAX_VALUE;
    return Math.min(MAX_VALUE, Math.max(MIN_VALUE, Math.ceil(raw * 2) / 2));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const current = valueRef.current ?? 0;
    const steps: Record<string, number> = {
      ArrowRight: current + 0.5,
      ArrowUp: current + 0.5,
      ArrowLeft: current - 0.5,
      ArrowDown: current - 0.5,
      PageUp: current + 1,
      PageDown: current - 1,
      Home: MIN_VALUE,
      End: MAX_VALUE,
      Delete: 0,
      Backspace: 0,
      '0': 0,
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
    };
    const next = steps[e.key];
    if (next === undefined) return;
    e.preventDefault();
    commit(next < MIN_VALUE ? null : Math.min(MAX_VALUE, next));
  };

  return (
    <div className={`cn-stars${shown === null ? ' is-empty' : ''}`}>
      <div
        ref={sliderRef}
        className="cn-stars__track"
        tabIndex={0}
        role="slider"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={MAX_VALUE}
        aria-valuenow={value === null ? 0 : value}
        aria-valuetext={scoreText(value)}
        aria-orientation="horizontal"
        aria-describedby={describedBy}
        data-focus-key={starsFocusKey}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          setDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
          setPreview(valueAt(e.clientX));
        }}
        onPointerMove={(e) => {
          if (dragging || e.pointerType === 'mouse') setPreview(valueAt(e.clientX));
        }}
        onPointerUp={(e) => {
          if (!dragging) return;
          setDragging(false);
          commit(valueAt(e.clientX));
        }}
        onPointerLeave={() => {
          if (!dragging) setPreview(null);
        }}
        onPointerCancel={() => {
          setDragging(false);
          setPreview(null);
        }}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const star = i + 1;
          const fill = paintFill(i, shown);
          const gradient = `${id}-${star}`;
          return (
            <svg key={star} className="cn-star" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id={gradient}>
                  <stop offset="0" className="cn-star__on" />
                  <stop offset={String(fill)} className="cn-star__on" data-split />
                  <stop offset={String(fill)} className="cn-star__off" data-split />
                  <stop offset="1" className="cn-star__off" />
                </linearGradient>
              </defs>
              <path d={STAR_PATH} fill={`url(#${gradient})`} className="cn-star__shape" />
            </svg>
          );
        })}
      </div>
      <button
        type="button"
        className="cn-stars__clear"
        title={t.notApplicableHere}
        aria-label={t.clearLabel(label)}
        aria-pressed={value === null}
        data-focus-key={clearFocusKey}
        onClick={() => {
          if (value !== null) return commit(null);
          if (lastScore.current !== null) return commit(lastScore.current);
          sliderRef.current?.focus();
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M6 18L18 6" />
        </svg>
      </button>
    </div>
  );
}
