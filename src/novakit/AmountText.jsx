/**
 * AmountText — NovaKit Lite
 * Formats an integer PKR amount, e.g. 10000 -> "Rs 10,000".
 *
 * A missing amount never renders as "Rs 0". In a cost disclosure, a fee
 * that failed to load must not read as free.
 */
export default function AmountText({ amount, size = "title", className = "" }) {
  const sizes = {
    display: "text-display",
    title: "text-title",
    body: "text-body",
  };
  const sizeClass = sizes[size] || sizes.title;

  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return <span className={`${sizeClass} text-neutral-700 ${className}`}>Unavailable</span>;
  }

  const formatted = new Intl.NumberFormat("en-PK").format(amount);
  return (
    <span className={`${sizeClass} text-neutral-900 tabular-nums ${className}`}>
      Rs {formatted}
    </span>
  );
}
