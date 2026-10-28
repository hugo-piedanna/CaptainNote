export function IconButton({
  text,
  label,
  focusKey,
  disabled,
  onClick,
}: {
  text: string;
  label: string;
  focusKey: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="icon"
      title={label}
      aria-label={label}
      disabled={disabled}
      data-focus-key={focusKey}
      onClick={onClick}>
      <span aria-hidden="true">{text}</span>
    </button>
  );
}
