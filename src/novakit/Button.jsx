/**
 * Button — NovaKit Lite
 * Variants: primary | secondary
 * Sizes: md | lg
 * States: default, pressed (active), disabled, loading, focus-visible
 *
 * Labels may wrap to two lines on narrow screens, so height is a minimum.
 * Loading keeps the variant's colour (it is not "disabled") and ignores taps.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  loadingLabel = "Please wait",
  onClick,
  type = "button",
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold text-center transition-colors select-none w-full " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

  const sizes = {
    md: "min-h-11 px-4 py-2.5 text-body",
    lg: "min-h-14 px-5 py-3 text-title",
  };

  const variants = {
    primary:
      "bg-brand text-white active:bg-brand-pressed disabled:bg-neutral-300 disabled:text-neutral-700",
    secondary:
      "bg-white text-neutral-900 border border-neutral-500 active:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-300",
  };

  function handleClick(e) {
    if (loading) return;
    onClick?.(e);
  }

  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${loading ? "cursor-wait" : ""} ${className}`}
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin"
          />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
