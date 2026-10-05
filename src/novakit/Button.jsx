import { useEffect, useRef, useState } from "react";

/**
 * Button — NovaKit Lite
 * Variants: primary | secondary
 * Sizes: md | lg
 * Confirm: tap (default) | hold
 * States: default, pressed (active), disabled, loading, focus-visible,
 *         holding (hold only)
 *
 * Labels may wrap to two lines on narrow screens, so height is a minimum.
 * Loading keeps the variant's colour (it is not "disabled") and ignores taps.
 *
 * Hold: for consequential actions where an accidental tap is costly.
 * Pointer users press and hold for `holdMs`; a fill shows progress and
 * letting go early cancels. Keyboard and assistive-tech activation
 * (Enter, Space, screen-reader "activate") confirms straight away.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  confirm = "tap",
  holdMs = 1000,
  disabled = false,
  loading = false,
  loadingLabel = "Please wait",
  onClick,
  type = "button",
  className = "",
}) {
  const hold = confirm === "hold";
  const [holding, setHolding] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const base =
    "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-md font-semibold text-center transition-colors select-none w-full " +
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

  // The hold fill does the "pressed" job, so the pressed colour is turned off.
  const holdVariant = hold ? "active:bg-brand [-webkit-touch-callout:none]" : "";

  function startHold(e) {
    if (!hold || loading || disabled || e.button > 0) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      setHolding(false);
      onClick?.(e);
    }, holdMs);
  }

  function cancelHold() {
    if (!hold) return;
    clearTimeout(timer.current);
    setHolding(false);
  }

  function handleClick(e) {
    if (loading) return;
    // A pointer click on a hold button is handled by the hold timer.
    // detail === 0 means keyboard or assistive tech: confirm now.
    if (hold && e.detail !== 0) return;
    onClick?.(e);
  }

  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onContextMenu={hold ? (e) => e.preventDefault() : undefined}
      className={`${base} ${sizes[size]} ${variants[variant]} ${holdVariant} ${loading ? "cursor-wait" : ""} ${className}`}
    >
      {hold && !loading ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-left bg-brand-pressed"
          style={{
            transform: `scaleX(${holding ? 1 : 0})`,
            transition: `transform ${holding ? holdMs : 150}ms linear`,
          }}
        />
      ) : null}
      <span className="relative inline-flex items-center justify-center gap-2">
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
      </span>
    </button>
  );
}
