import { AppBar, Panel, Button, AmountText } from "../novakit";
import { PAYDAY, formatDate, formatRs, reminderDate } from "./terms";

// One main thing: what they repay and when. What they got is one line above.
export default function SuccessScreen({ amount, total, onDone }) {
  return (
    <>
      <AppBar title="Salary advance" />
      <main className="p-4 space-y-5">
        <p className="text-body text-neutral-700 px-1" role="status">
          {formatRs(amount)} is in your NovaPay wallet.
        </p>

        <h2 className="px-1">
          <span className="block text-title text-neutral-900">You repay</span>
          <AmountText amount={total} size="display" className="block" />
          <span className="block text-title text-neutral-900">
            on {formatDate(PAYDAY, { long: true })}
          </span>
        </h2>

        <Panel>
          We'll remind you on {formatDate(reminderDate(), { long: true })}. Make sure the
          money is in your wallet on payday. That's when the repayment comes out.
        </Panel>

        <Button onClick={onDone}>Done</Button>
      </main>
    </>
  );
}
