import { Icon, type IconName } from './Icon';

export function IconButton({
  icon,
  label,
  focusKey,
  disabled,
  danger,
  onClick,
}: {
  icon: IconName;
  label: string;
  focusKey: string;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={'icon-btn' + (danger ? ' icon-btn--danger' : '')}
      title={label}
      aria-label={label}
      disabled={disabled}
      data-focus-key={focusKey}
      onClick={onClick}>
      <Icon name={icon} />
    </button>
  );
}
