// Product rules from PRODUCT_REFERENCE.md, plus the prototype's scenario.

export const FEE_RATE = 0.03; // 3% of the amount paid out, charged once
export const TIERS = [5000, 10000, 15000];

// Prototype scenario: this user's limit is the middle tier, so the
// Rs 15,000 tier is hidden (decision 6).
export const LIMIT = 10000;

// Prototype scenario for the check that runs after the user picks:
// "full" pays what they asked; "less" pays one tier lower (decision 3).
export function amountAfterCheck(requested, scenario) {
  if (scenario !== "less") return requested;
  const lower = TIERS.filter((t) => t < requested);
  return lower.length ? lower[lower.length - 1] : requested;
}

// Prototype scenario. Dates line up with the starter's "Salary credited 28 Jun".
export const TODAY = new Date(2026, 6, 7); // Tue 7 Jul 2026
export const PAYDAY = new Date(2026, 6, 28); // Tue 28 Jul 2026

export function feeFor(amount) {
  return Math.round(amount * FEE_RATE);
}

export function daysUntil(date, from = TODAY) {
  return Math.round((date - from) / 86400000);
}

// Simple yearly rate, for comparison only: fee rate spread over the days held.
export function yearlyRatePercent(days) {
  return Math.round((FEE_RATE * 365 * 100) / days);
}

// Long form for sentences ("Tuesday 28 July").
// Short form only where space is tight ("28 Jul").
export function formatDate(date, { long = false } = {}) {
  const text = date.toLocaleDateString(
    "en-GB",
    long
      ? { weekday: "long", day: "numeric", month: "long" }
      : { day: "numeric", month: "short" }
  );
  return text.replace(/(\d+) /, "$1\u00A0"); // keep "25 July" on one line
}

export function formatRs(amount) {
  return "Rs\u00A0" + new Intl.NumberFormat("en-PK").format(amount);
}

// Assumption: one reminder, 3 days before payday.
export const REMINDER_DAYS_BEFORE = 3;

export function reminderDate() {
  const d = new Date(PAYDAY);
  d.setDate(d.getDate() - REMINDER_DAYS_BEFORE);
  return d;
}

// Assumption: a declined user can apply again 30 days later.
export const RETRY_DAYS = 30;

export function retryDate() {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + RETRY_DAYS);
  return d;
}
