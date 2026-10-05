/**
 * ListRow — NovaKit Lite
 * One row anatomy: leading slot · title + subtitle · optional trailing.
 *
 * Leading types:
 *   icon  (default) a round icon; rows are divided by a line. For lists
 *         like recent activity. iconTone="brand" (light indigo circle,
 *         indigo icon) gives a feature its face, e.g. the salary-advance
 *         card on home. Text is cut off when there's a trailing amount,
 *         and wraps when there isn't.
 *   step  a dot joined to the next row by a line; text wraps. For a short
 *         timeline. tone="muted" gives a hollow dot for a step that only
 *         happens if something goes wrong (quieter, not hidden).
 *   radio a radio dot; the row becomes one option in a pick-one list.
 *         Wrap the rows in role="radiogroup" with an accessible name.
 *         Uses a native radio input, so arrow keys and screen readers work.
 */
export default function ListRow({
  leading = "icon",
  icon = null,
  iconTone = "default",
  title,
  subtitle,
  trailing = null,
  tone = "default",
  last = false,
  name,
  value,
  checked = false,
  onChange,
  className = "",
}) {
  if (leading === "step") {
    const muted = tone === "muted";
    return (
      <div className={"flex gap-3 " + className}>
        <div className="flex flex-col items-center w-3 shrink-0" aria-hidden="true">
          <span
            className={
              "mt-[5px] h-3 w-3 rounded-full " +
              (muted ? "border-2 border-neutral-500 bg-white" : "bg-brand")
            }
          />
          {!last && <span className="flex-1 w-px bg-neutral-300 my-1" />}
        </div>
        <div className={"min-w-0 flex-1 " + (last ? "" : "pb-4")}>
          <div className="text-body font-semibold text-neutral-900">{title}</div>
          {subtitle ? <div className="text-body text-neutral-700">{subtitle}</div> : null}
        </div>
      </div>
    );
  }

  if (leading === "radio") {
    return (
      <label
        className={
          "flex items-center gap-3 min-h-14 py-3 border-b border-neutral-200 last:border-b-0 cursor-pointer " +
          "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand has-[:focus-visible]:rounded-sm " +
          className
        }
      >
        <input
          type="radio"
          className="sr-only"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
        />
        <span
          aria-hidden="true"
          className={
            "h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center " +
            (checked ? "border-brand" : "border-neutral-500")
          }
        >
          {checked ? <span className="h-2.5 w-2.5 rounded-full bg-brand" /> : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-neutral-900">{title}</span>
          {subtitle ? (
            <span className="block text-caption text-neutral-700">{subtitle}</span>
          ) : null}
        </span>
        {trailing ? <span className="shrink-0">{trailing}</span> : null}
      </label>
    );
  }

  return (
    <div
      className={
        "flex items-center gap-3 py-3 border-b border-neutral-200 last:border-b-0 " +
        className
      }
    >
      {icon ? (
        <div
          aria-hidden="true"
          className={
            "h-9 w-9 rounded-full flex items-center justify-center shrink-0 " +
            (iconTone === "brand" ? "bg-brand-50 text-brand" : "bg-neutral-100 text-neutral-700")
          }
        >
          {icon}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className={"text-body text-neutral-900 " + (trailing ? "truncate" : "")}>{title}</div>
        {subtitle ? (
          <div className={"text-caption text-neutral-700 " + (trailing ? "truncate" : "")}>
            {subtitle}
          </div>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
