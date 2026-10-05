/**
 * Panel — NovaKit Lite
 * A quiet tinted note box for one standing note on a screen (a limit,
 * a reminder). Not a second Card: no border, no shadow, smaller padding.
 * Use at most one per screen. Also carries a "what went wrong" message
 * in the same calm style; pass role="alert" so screen readers announce it.
 */
export default function Panel({ children, role, className = "" }) {
  return (
    <div
      role={role}
      className={"bg-brand-50 rounded-md px-4 py-3 text-body text-neutral-900 " + className}
    >
      {children}
    </div>
  );
}
