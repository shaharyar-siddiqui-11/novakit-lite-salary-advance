import { useState } from "react";
import { AppBar, Card, ListRow, Panel, Button, AmountText } from "../novakit";
import { TIERS, LIMIT, PAYDAY, feeFor, formatDate, formatRs } from "./terms";

/**
 * Pick an amount.
 * Only tiers up to the user's limit are shown (decision 6), smallest
 * first, and nothing is picked for them (decision 9).
 */
export default function OfferScreen({ initialAmount = null, onBack, onContinue }) {
  const [amount, setAmount] = useState(initialAmount);
  const [checking, setChecking] = useState(false);

  const options = TIERS.filter((t) => t <= LIMIT);

  function handleContinue() {
    if (checking || !amount) return;
    setChecking(true);
    // Stand-in for the risk check that runs before the terms (decision 3).
    setTimeout(() => onContinue(amount), 1000);
  }

  return (
    <>
      <AppBar title="Salary advance" onBack={checking ? null : onBack} />

      <main className="p-4 space-y-5">
        <section className="px-1 space-y-1">
          <h2 id="amount-heading" className="text-title text-neutral-900">
            How much do you need?
          </h2>
          <p className="text-body text-neutral-700">
            You repay it on {formatDate(PAYDAY, { long: true })}. That's your payday.
          </p>
        </section>

        <Card className="py-1">
          <div role="radiogroup" aria-labelledby="amount-heading">
            {options.map((tier) => (
              <ListRow
                key={tier}
                leading="radio"
                name="amount"
                value={tier}
                checked={amount === tier}
                onChange={setAmount}
                title={<AmountText amount={tier} size="title" />}
                subtitle={`Repay ${formatRs(tier + feeFor(tier))}, including a ${formatRs(feeFor(tier))} fee (3%)`}
              />
            ))}
          </div>
        </Card>

        <Panel>You can take up to {formatRs(LIMIT)}, based on your salary and how you've used NovaPay.</Panel>

        <Button
          onClick={handleContinue}
          disabled={!amount}
          loading={checking}
          loadingLabel="Checking your amount…"
        >
          {amount ? `Continue with ${formatRs(amount)}` : "Pick an amount"}
        </Button>
      </main>
    </>
  );
}
