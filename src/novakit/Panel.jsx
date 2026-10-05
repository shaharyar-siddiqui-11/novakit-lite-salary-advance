/**
 * Panel — NovaKit Lite
 * A quiet tinted note box for one standing note on a screen (a limit,
 * a reminder). Not a second Card: no border, no shadow, smaller padding.
 * Use at most one per screen. Pass role="alert" when the message should
 * be announced by screen readers.
 *
 * Tones:
 *   default  calm indigo tint. Standing notes and calm problems (a fee
 *            that didn't load, a late repayment).
 *   error    pale red with an icon. Only for a money action that failed,
 *            so it can't be mistaken for success. Never for anything else.
 */
export default function Panel({ children, role, tone = "default", className = "" }) {
  if (tone === "error") {
    return (
      <div
        role={role}
        className={"flex gap-3 bg-error-50 rounded-md px-4 py-3 text-body text-neutral-900 " + className}
      >
        <svg
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0 text-error mt-px"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7.5v5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1.25" fill="currentColor" />
        </svg>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    );
  }

  return (
    <div
      role={role}
      className={"bg-brand-50 rounded-md px-4 py-3 text-body text-neutral-900 " + className}
    >
      {children}
    </div>
  );
}
