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
 * Key numbers first: what you get and what you repay, with dates, plus
 * the fee. Then what happens on payday and if it's late. Accept is
 * hold-to-confirm and its label repeats the amount and the date.
 */
export default function TermsScreen({ amount, onBack, onDecline, onAccepted }) {
  const [submitting, setSubmitting] = useState(false);
  const submitted = useRef(false);

  const fee = feeFor(amount);
  const total = amount + fee;
  const yearly = yearlyRatePercent(daysUntil(PAYDAY));
  const payday = formatDate(PAYDAY, { long: true });
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

      <main className="p-4 space-y-5">
        <Card className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-body text-neutral-700">You get today</div>
              <AmountText amount={amount} size="title" className="block font-bold" />
            </div>
            <div>
              <div className="text-body text-neutral-700">You repay on {paydayShort}</div>
              <AmountText amount={total} size="title" className="block font-bold" />
            </div>
          </div>
          <p className="border-t border-neutral-200 pt-3 text-body text-neutral-700">
            {formatRs(fee)} fee (3%), charged once. About {yearly}% as a yearly rate.
          </p>
        </Card>

        <section className="px-1">
          <ListRow
            leading="step"
            title={`${payday}: repaid from your wallet`}
            subtitle="We take it after your salary arrives. If there isn't enough, we take nothing and try again when it lands."
          />
          <ListRow
            leading="step"
            tone="muted"
            last
            title="If it's late: no late fee"
            subtitle="You can't take another advance until it's repaid. After 30 days unpaid, it's recorded as a default, which means an unpaid loan."
          />
        </section>

        <div className="space-y-3">
          <Button
            confirm="hold"
            onClick={handleAccept}
            loading={submitting}
            loadingLabel="Sending your advance"
            holdHint={<AcceptLabel first="Keep holding to accept" total={total} date={paydayShort} />}
          >
            <AcceptLabel first="Hold to accept" total={total} date={paydayShort} />
          </Button>
          <Button variant="secondary" onClick={onDecline} disabled={submitting}>
            No thanks
          </Button>
        </div>
      </main>
    </>
  );
}

function AcceptLabel({ first, total, date }) {
  return (
    <span className="flex flex-col leading-tight">
      <span>{first}</span>
      <span className="font-normal">
        Repay {formatRs(total)} on {date}
      </span>
    </span>
  );
}
