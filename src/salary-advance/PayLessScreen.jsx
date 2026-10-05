import { AppBar, Button, AmountText } from "../novakit";
import { formatRs } from "./terms";

/**
 * The check came back lower than the amount the user picked.
 * Shown before the terms, so the terms always show the real amount
 * (decision 3). Nothing has been agreed or charged yet.
 * One main thing: the amount we can pay, with the asked amount quieter.
 */
export default function PayLessScreen({ requested, amount, onBack, onContinue, onDecline }) {
  return (
    <>
      <AppBar title="Salary advance" onBack={onBack} />

      <main className="p-4 space-y-5">
        <h2 className="px-1">
          <span className="block text-title text-neutral-900">We can pay</span>
          <AmountText amount={amount} size="display" className="block" />
          <span className="block text-body text-neutral-700 mt-1">
            not the {formatRs(requested)} you asked for
          </span>
        </h2>

        <p className="text-body text-neutral-700 px-1">
          After today's check of your account, this is the most we can pay right now.
          Nothing has been taken or charged.
        </p>

        <div className="space-y-3">
          <Button onClick={onContinue}>See terms for {formatRs(amount)}</Button>
          <Button variant="secondary" onClick={onDecline}>
            No thanks
          </Button>
        </div>
      </main>
    </>
  );
}
