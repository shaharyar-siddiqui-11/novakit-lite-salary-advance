import { useState } from "react";
import { AppBar, ListRow, Panel, Button, AmountText } from "../novakit";
import { PAYDAY, LATE_TODAY, daysUntil, defaultDate, formatDate } from "./terms";

/**
 * A repayment that is a few days late.
 * Warm but not soft, and calm to look at. Three zones with clear space:
 * where you stand (the amount is the one loud thing), what happens next,
 * what you can do. Promises nothing the product doesn't offer (no
 * payment plans, no new date). Nothing important behind a tap.
 */
export default function LateScreen({ total, onBack }) {
  const [stub, setStub] = useState(false);
  const daysLate = daysUntil(LATE_TODAY, PAYDAY);

  return (
    <>
      <AppBar title="Salary advance" onBack={onBack} />

      <main className="p-4 space-y-8">
        {/* Where you stand */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-title text-neutral-900">
              Your repayment is {daysLate} days late
            </h2>
            <p className="text-body text-neutral-700">Payday didn't go to plan.</p>
          </div>

          <p className="px-1">
            <span className="block text-body text-neutral-700">You owe</span>
            <AmountText amount={total} size="display" className="block" />
          </p>

          <Panel>The amount hasn't changed. No late fee.</Panel>

          <p className="text-body text-neutral-700 px-1">
            Once it's repaid, you can apply for an advance again.
          </p>
        </section>

        {/* What happens next */}
        <section className="px-1">
          <h3 className="text-body font-semibold text-neutral-900 mb-3">What happens next</h3>
          <ListRow
            leading="step"
            title="We'll try again when money lands in your wallet"
            subtitle="We only take the full amount, never part of it."
          />
          <ListRow
            leading="step"
            tone="muted"
            last
            title={`If it's still unpaid on ${formatDate(defaultDate(), { long: true })}`}
            subtitle="It's recorded as a default, which means an unpaid loan."
          />
        </section>

        {/* What you can do */}
        <section className="space-y-3">
          <Button onClick={() => setStub(true)}>Talk to support</Button>
          <Button variant="secondary" onClick={() => setStub(true)}>
            Pay now
          </Button>
          {stub ? (
            <p role="status" className="text-caption text-neutral-700 text-center">
              This step isn't part of the prototype.
            </p>
          ) : null}
        </section>
      </main>
    </>
  );
}
