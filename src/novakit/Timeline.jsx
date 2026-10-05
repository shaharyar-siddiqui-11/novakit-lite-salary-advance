/**
 * Timeline — NovaKit Lite
 * A short vertical list of dated steps.
 * Item: { key, when, title, body?, tone: "default" | "muted" }
 * "muted" is for a step that only happens if something goes wrong.
 * It is quieter, not hidden: text keeps full contrast.
 */
export default function Timeline({ items, className = "" }) {
  return (
    <ol className={className}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        const muted = item.tone === "muted";
        return (
          <li key={item.key} className="relative flex gap-3">
            <div className="flex flex-col items-center w-3 shrink-0" aria-hidden="true">
              <span
                className={
                  "mt-[5px] h-3 w-3 rounded-full " +
                  (muted ? "border-2 border-neutral-500 bg-white" : "bg-brand")
                }
              />
              {!last && <span className="flex-1 w-px bg-neutral-300 my-1" />}
            </div>
            <div className={last ? "" : "pb-4"}>
              <div className="text-caption text-neutral-700">{item.when}</div>
              <div className="text-body font-semibold text-neutral-900">{item.title}</div>
              {item.body ? (
                <div className="text-body text-neutral-700">{item.body}</div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
