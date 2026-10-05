import { AppBar, Card, Button, AmountText } from "../novakit";
import { PAYDAY, formatDate, formatRs } from "./terms";

// Placeholder. Rough on purpose until the flow around it is decided.
export default function SuccessScreen({ amount, total, onDone }) {
  return (
    <>
      <AppBar title="Salary advance" />
      <main className="p-4 space-y-4">
        <Card className="space-y-2">
          <AmountText amount={amount} size="display" className="block" />
          <p className="text-body text-neutral-700">is in your NovaPay wallet.</p>
          <p className="text-body text-neutral-900">
            You repay {formatRs(total)} on {formatDate(PAYDAY, { weekday: true })}.
          </p>
        </Card>
        <Button onClick={onDone}>Done</Button>
      </main>
    </>
  );
}
