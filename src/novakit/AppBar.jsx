/**
 * AppBar — NovaKit Lite
 * title + optional back affordance (44px touch target)
 */
export default function AppBar({ title, onBack = null }) {
  return (
    <header className="h-14 flex items-center gap-1 px-2 border-b border-neutral-100 bg-white">
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Back"
          className="h-11 w-11 flex items-center justify-center rounded-full text-neutral-900 active:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}
      <h1 className={`text-title text-neutral-900 ${onBack ? "" : "pl-1"}`}>{title}</h1>
    </header>
  );
}
