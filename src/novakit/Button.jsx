import { useEffect, useRef, useState } from "react";

/**
 * Button — NovaKit Lite
 * Variants: primary | secondary
 * Sizes: md | lg
 * Confirm: tap (default) | hold
 * States: default, pressed (active), disabled, loading, focus-visible,
 *         holding and armed (hold only)
 *
 * Labels may wrap to two lines on narrow screens, so height is a minimum.
 * The label, armed and loading layers share one grid cell, so the button
 * keeps the same height in every state.
 * Loading keeps the variant's colour (it is not "disabled") and ignores taps.
 *
 * Hold: for consequential actions where an accidental tap is costly.
 * Two ways to confirm, so nobody is locked out:
 *   - press and hold for `holdMs`; a fill shows progress, letting go early
 *     cancels.
 *   - a short tap "arms" the button: the label becomes `armedLabel` and a
 *     second tap confirms. The second tap only counts once the new label
 *     has been on screen for `armedDelayMs`, so a quick accidental
 *     double tap doesn't confirm. The armed state ends after `armedMs`.
 *   This also covers screen readers (TalkBack, VoiceOver), where a
 *   double-tap arrives as one short tap and a hold isn't practical.
 * Keyboard activation (Enter, Space) confirms straight away.
 * Hold buttons have no pressed colour: the fill is the pressed feedback.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  confirm = "tap",
  holdMs = 1000,
  armedLabel = "Tap again to confirm",
  armedAnnouncement = "Tap again to confirm",
  armedDelayMs = 400,
  armedMs = 6000,
  disabled = false,
  loading = false,
  loadingLabel = "Please wait",
  onClick,
  type = "button",
  className = "",
}) {
  const hold = confirm === "hold";
  const [holding, setHolding] = useState(false);
  const [armed, setArmed] = useState(false);
  const holdTimer = useRef(null);
  const armedTimer = useRef(null);
  const armedAt = useRef(0);
  const lastPointerUp = useRef(0);

  useEffect(
    () => () => {
      clearTimeout(holdTimer.current);
      clearTimeout(armedTimer.current);
    },
    []
  );

  const base =
    "relative overflow-hidden inline-flex items-center justify-center rounded-md font-semibold text-center transition-colors select-none w-full " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

  const sizes = {
    md: "min-h-11 px-4 py-2.5 text-body",
    lg: "min-h-14 px-5 py-3 text-title",
  };

  const variants = {
    primary: {
      rest: "bg-brand text-white disabled:bg-neutral-300 disabled:text-neutral-700",
      pressed: "active:bg-brand-pressed",
    },
    secondary: {
      rest: "bg-white text-neutral-900 border border-neutral-500 disabled:text-neutral-500 disabled:border-neutral-300",
      pressed: "active:bg-neutral-100",
    },
  };
  const v = variants[variant];
  const look = hold ? `${v.rest} [-webkit-touch-callout:none]` : `${v.rest} ${v.pressed}`;

  function confirmNow(e) {
    clearTimeout(holdTimer.current);
    clearTimeout(armedTimer.current);
    holdTimer.current = null;
    setHolding(false);
    setArmed(false);
    onClick?.(e);
  }

  // A short tap: arm the button, or confirm if it's already armed.
  function tap(e) {
    if (armed) {
      if (Date.now() - armedAt.current >= armedDelayMs) confirmNow(e);
      return;
    }
    armedAt.current = Date.now();
    setArmed(true);
    clearTimeout(armedTimer.current);
    armedTimer.current = setTimeout(() => setArmed(false), armedMs);
  }

  function startHold(e) {
    if (!hold || loading || disabled || e.button > 0) return;
    setHolding(true);
    holdTimer.current = setTimeout(() => confirmNow(e), holdMs);
  }

  function endHold(e) {
    if (!hold || !holdTimer.current) return;
    clearTimeout(holdTimer.current);
    holdTimer.current = null;
    setHolding(false);
    lastPointerUp.current = Date.now();
    tap(e);
  }

  // Finger slid off or the browser took over (e.g. to scroll): no tap.
  function abandonHold() {
    if (!hold || !holdTimer.current) return;
    clearTimeout(holdTimer.current);
    holdTimer.current = null;
    setHolding(false);
  }

  function handleClick(e) {
    if (loading) return;
    if (!hold) return onClick?.(e);
    // Keyboard (detail === 0): confirm now.
    if (e.detail === 0) return confirmNow(e);
    // Already handled as a tap on pointer up.
    if (Date.now() - lastPointerUp.current < 500) return;
    // A click with no pointer events first (some screen readers): a tap.
    tap(e);
  }

  const layer = "[grid-area:1/1] flex items-center justify-center gap-2";
  const showArmed = armed && !holding && !loading;

  return (
    <>
      <button
        type={type}
        disabled={disabled}
        aria-disabled={loading || undefined}
        aria-busy={loading || undefined}
        onClick={handleClick}
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={abandonHold}
        onPointerCancel={abandonHold}
        onContextMenu={hold ? (e) => e.preventDefault() : undefined}
        className={`${base} ${sizes[size]} ${look} ${loading ? "cursor-wait" : ""} ${className}`}
      >
        {hold && !loading ? (
          <span
            aria-hidden="true"
            data-hold-fill
            className="absolute inset-0 origin-left bg-brand-pressed"
            style={{
              transform: `scaleX(${holding ? 1 : 0})`,
              transition: `transform ${holding ? holdMs : 150}ms linear`,
            }}
          />
        ) : null}
        <span className="relative grid">
          <span className={`${layer} ${loading || showArmed ? "invisible" : ""}`}>{children}</span>
          {hold ? (
            <span className={`${layer} ${showArmed ? "" : "invisible"}`} aria-hidden={!showArmed}>
              {armedLabel}
            </span>
          ) : null}
          <span className={`${layer} ${loading ? "" : "invisible"}`} aria-hidden={!loading}>
            <span
              aria-hidden="true"
              className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin"
            />
            <span>{loadingLabel}</span>
          </span>
        </span>
      </button>
      {hold ? (
        // Tells screen-reader users the button changed. Outside the button
        // so it isn't read as part of its name. Takes no space.
        <span role="status" className="sr-only">
          {showArmed ? armedAnnouncement : ""}
        </span>
      ) : null}
    </>
  );
}
