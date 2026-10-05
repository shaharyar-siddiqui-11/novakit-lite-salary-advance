import { useRef, useState } from "react";
import { AppBar, Card, ListRow, Panel, Button, AmountText } from "../novakit";
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
 *
 * Edge states (prototype flags, the second try always works):
 *   failFee     the fee doesn't load: no "Rs 0", no Accept until it does
 *   failAccept  the accept request fails: hand over to the
 *               accept-failed screen (onAcceptFailed)
 */
export default function TermsScreen({
  amount,
  failFee = false,
  failAccept = false,
  onBack,
  onDecline,
  onAccepted,
  onAcceptFailed,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [feeLoaded, setFeeLoaded] = useState(!failFee);
  const [reloading, setReloading] = useState(false);
  const submitted = useRef(false);

  const fee = feeLoaded ? feeFor(amount) : null;
  const total = fee === null ? null : amount + fee;
  const yearly = yearlyRatePercent(daysUntil(PAYDAY));
  const payday = formatDate(PAYDAY, { long: true });
  const paydayShort = formatDate(PAYDAY);

  function handleAccept() {
    if (submitted.current || total === null) return; // never submit twice, never without numbers
    submitted.current = true;
    setSubmitting(true);
    // Stand-in for the real request.
    setTimeout(() => {
      if (failAccept) {
        onAcceptFailed();
        return;
      }
      onAccepted({ amount, fee, total });
    }, 1200);
  }

  function handleReload() {
    if (reloading) return;
    setReloading(true);
    setTimeout(() => {
      setReloading(false);
      setFeeLoaded(true);
    }, 1000);
  }

  return (
    <>
      <AppBar title="Salary advance" onBack={submitting || reloading ? null : onBack} />

      <main className="p-4 space-y-5">
        <Card className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {/* Out of the layout flow, so it adds no space. */}
            <h2 className="sr-only">What it costs</h2>
            <div>
              <div className="text-body text-neutral-700">You get today</div>
              <AmountText amount={amount} size="title" className="block font-bold" />
            </div>
            <div>
              <div className="text-body text-neutral-700">You repay on {paydayShort}</div>
              <AmountText amount={total} size="title" className="block font-bold" />
            </div>
          </div>
          {feeLoaded ? (
            <p className="border-t border-neutral-200 pt-3 text-body text-neutral-700">
              {formatRs(fee)} fee (3%), charged once. About {yearly}% as a yearly rate.
            </p>
          ) : null}
        </Card>

        {!feeLoaded ? (
          <>
            <Panel role="alert">
              We couldn't load your fee, so we can't show what you'd repay. You can accept
              once it's here. Nothing has been taken or charged.
            </Panel>
            <div className="space-y-3">
              <Button onClick={handleReload} loading={reloading} loadingLabel="Loading your fee…">
                Try again
              </Button>
              <Button variant="secondary" onClick={onDecline} disabled={reloading}>
                No thanks
              </Button>
            </div>
          </>
        ) : (
          <>
            <section className="px-1">
              <h2 className="sr-only">What happens next</h2>
              <ListRow
                leading="step"
                title={`Repaid from your wallet on ${payday}`}
                subtitle="We take the repayment after your salary arrives. If there isn't enough, we take nothing and try again when it lands."
              />
              <ListRow
                leading="step"
                tone="muted"
                last
                title="If it's late: no late fee"
                subtitle="You can't take another advance until it's repaid. After 30 days unpaid, it's recorded as a default, meaning the advance wasn't repaid."
              />
            </section>

            <div className="space-y-3">
              <Button
                confirm="hold"
                onClick={handleAccept}
                loading={submitting}
                loadingLabel="Sending your advance…"
                armedLabel={<AcceptLabel first="Tap again to accept" total={total} date={paydayShort} />}
                armedAnnouncement="Tap again to accept"
              >
                <AcceptLabel first="Hold to accept" total={total} date={paydayShort} />
              </Button>
              <Button variant="secondary" onClick={onDecline} disabled={submitting}>
                No thanks
              </Button>
            </div>
          </>
        )}
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
