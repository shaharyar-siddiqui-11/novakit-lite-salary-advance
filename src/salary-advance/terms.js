// Product rules from PRODUCT_REFERENCE.md, plus the prototype's scenario.

export const FEE_RATE = 0.03; // 3% of the amount paid out, charged once

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

export function formatDate(date, { weekday = false } = {}) {
  return date.toLocaleDateString("en-GB", {
    ...(weekday ? { weekday: "short" } : {}),
    day: "numeric",
    month: "short",
  });
}

export function formatRs(amount) {
  return "Rs " + new Intl.NumberFormat("en-PK").format(amount);
}
