import { AppBar, Card, Button, AmountText } from "../novakit";
import { PAYDAY, formatDate, formatRs, reminderDate } from "./terms";

// What they owe and when leads. What they got is the smaller line.
export default function SuccessScreen({ amount, fee, total, onDone }) {
  const payday = formatDate(PAYDAY, { weekday: true });

  return (
    <>
      <AppBar title="Salary advance" />
      <main className="p-4 space-y-4">
        <p className="text-body text-neutral-900 px-1" role="status">
          {formatRs(amount)} is in your NovaPay wallet.
        </p>

        <Card className="space-y-1">
          <div className="text-caption text-neutral-700">You repay</div>
          <AmountText amount={total} size="display" className="block" />
          <div className="text-title text-neutral-900">on {payday}</div>
          <div className="text-caption text-neutral-700 pt-1">
            {formatRs(amount)} plus {formatRs(fee)} fee (3%)
          </div>
        </Card>

        <p className="text-body text-neutral-700 px-1">
          We'll remind you on {formatDate(reminderDate(), { weekday: true })}. Make sure{" "}
          {formatRs(total)} is in your wallet on {formatDate(PAYDAY)}. That's when the
          repayment comes out.
        </p>

        <Button onClick={onDone}>Done</Button>
      </main>
    </>
  );
}
