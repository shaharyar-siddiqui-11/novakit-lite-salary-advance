import { useRef, useState } from "react";
import { AppBar, Card, ListRow, Button, AmountText } from "../novakit";
import {
  PAYDAY,
  feeFor,
  daysUntil,
  yearlyRatePercent,
  formatDate,
  formatRs,
} from "./terms";

/**
 * Terms and accept, on one screen.
 * Everything the user agrees to sits above the buttons, and the Accept
 * label repeats the amount and the date (decision 11).
 */
export default function TermsScreen({ amount, onBack, onDecline, onAccepted }) {
  const [submitting, setSubmitting] = useState(false);
  const submitted = useRef(false);

  const fee = feeFor(amount);
  const total = amount + fee;
  const days = daysUntil(PAYDAY);
  const payday = formatDate(PAYDAY, { weekday: true });
  const paydayShort = formatDate(PAYDAY);

  function handleAccept() {
    if (submitted.current) return; // a double tap must not submit twice
    submitted.current = true;
    setSubmitting(true);
    // Stand-in for the real request.
    setTimeout(() => onAccepted({ amount, fee, total }), 1200);
  }

  return (
    <>
      <AppBar title="Salary advance" onBack={submitting ? null : onBack} />

      <main className="p-4 space-y-4">
        <section>
          <div className="text-caption text-neutral-700">You get</div>
          <AmountText amount={amount} size="display" className="block mt-1" />
          <p className="text-body text-neutral-700 mt-1">
            Paid into your NovaPay wallet today.
          </p>
        </section>

        <Card className="py-1">
          <h2 className="sr-only">What it costs</h2>
          <ListRow title="You get" trailing={<AmountText amount={amount} size="body" />} />
          <ListRow
            title="One-time fee (3%)"
            trailing={<AmountText amount={fee} size="body" />}
          />
          <ListRow
            title={<span className="font-semibold">You repay</span>}
            trailing={<AmountText amount={total} size="body" className="font-semibold" />}
          />
          <ListRow
            title="Repayment date"
            subtitle={`Your payday, in ${days} days`}
            trailing={<span className="text-body text-neutral-900">{payday}</span>}
          />
        </Card>

        <p className="text-caption text-neutral-700 px-1">
          As a yearly rate, this is about {yearlyRatePercent(days)}%. It's a single
          fee, not interest. The rate is here so you can compare with other loans.
        </p>

        <Card className="space-y-3">
          <h2 className="text-body font-semibold text-neutral-900">How you repay</h2>
          <ul className="space-y-2 text-body text-neutral-700 list-disc pl-5">
            <li>
              On {paydayShort}, after your salary arrives, we take {formatRs(total)} from
              your NovaPay wallet.
            </li>
            <li>
              If there isn't enough, we don't take part of it. We tell you, and try again
              when your salary lands.
            </li>
            <li>
              No late fee. If it's 30 days unpaid, it's marked as default and you can't
              take another advance until it's repaid.
            </li>
          </ul>
        </Card>

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
