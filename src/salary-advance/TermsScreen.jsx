import { useRef, useState } from "react";
import { AppBar, Card, Button, AmountText, Timeline } from "../novakit";
import {
  TODAY,
  PAYDAY,
  feeFor,
  daysUntil,
  yearlyRatePercent,
  formatDate,
  formatRs,
} from "./terms";

/**
 * Terms and accept, on one screen.
 * Top: what you get, what you repay and when, side by side.
 * Then a timeline of what happens next, including the payday pull and
 * the default rule. The Accept label repeats the amount and the date.
 */
export default function TermsScreen({ amount, onBack, onDecline, onAccepted }) {
  const [submitting, setSubmitting] = useState(false);
  const submitted = useRef(false);

  const fee = feeFor(amount);
  const total = amount + fee;
  const yearly = yearlyRatePercent(daysUntil(PAYDAY));
  const payday = formatDate(PAYDAY, { weekday: true });
  const paydayShort = formatDate(PAYDAY);

  function handleAccept() {
    if (submitted.current) return; // a double tap must not submit twice
    submitted.current = true;
    setSubmitting(true);
    // Stand-in for the real request.
    setTimeout(() => onAccepted({ amount, fee, total }), 1200);
  }

  const steps = [
    {
      key: "today",
      when: `Today, ${formatDate(TODAY)}`,
      title: `${formatRs(amount)} lands in your wallet`,
    },
    {
      key: "payday",
      when: `${payday}, your payday`,
      title: `We take ${formatRs(total)} after your salary arrives`,
      body: "Not enough in your wallet? We take nothing, let you know, and try again when it lands.",
    },
    {
      key: "default",
      tone: "muted",
      when: "If it's still unpaid 30 days later",
      title: "It's marked as default",
      body: "No late fee. You just can't take another advance until it's repaid.",
    },
  ];

  return (
    <>
      <AppBar title="Salary advance" onBack={submitting ? null : onBack} />

      <main className="p-4 space-y-4">
        <Card className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-caption text-neutral-700">You get</div>
              <AmountText amount={amount} size="title" className="block font-bold" />
              <div className="text-body text-neutral-700">today</div>
            </div>
            <div>
              <div className="text-caption text-neutral-700">You repay</div>
              <AmountText amount={total} size="title" className="block font-bold" />
              <div className="text-body text-neutral-700">on {payday}</div>
            </div>
          </div>
          <p className="border-t border-neutral-200 pt-3 text-body text-neutral-700">
            {formatRs(fee)} fee, charged once. About {yearly}% as a yearly rate.
          </p>
        </Card>

        <section className="px-1">
          <h2 className="text-body font-semibold text-neutral-900 mb-3">What happens next</h2>
          <Timeline items={steps} />
        </section>

        <div className="space-y-3 pt-1 pb-2">
          <Button
            onClick={handleAccept}
            loading={submitting}
            loadingLabel="Sending your advance"
          >
            Accept · repay {formatRs(total)} on {paydayShort}
          </Button>
          <Button variant="secondary" onClick={onDecline} disabled={submitting}>
            No thanks
          </Button>
        </div>
      </main>
    </>
  );
}
