import { useState } from "react";
import { AppBar, Panel, Button } from "../novakit";
import { formatDate, retryDate } from "./terms";

/**
 * No offer. One screen, a different message for each reason (decision 4).
 * Each says why, as honestly as we can, and gives the next step:
 *   income_unverified  fixable now: add a payslip or bank statement
 *   credit_score       not fixable now: the date they can apply again
 *   other              we can't share the reason: a person to talk to,
 *                      and the date
 */
export default function DeclineScreen({ reason, onHome }) {
  const [stub, setStub] = useState(false);
  const retry = formatDate(retryDate(), { long: true });

  const showStub = () => setStub(true);

  const content = {
    income_unverified: {
      title: "We couldn't confirm your income",
      body: "We need to see your salary before we can offer an advance. Add a recent payslip or bank statement and we'll check again.",
      primary: { label: "Add payslip or bank statement", onClick: showStub },
      secondary: { label: "Not now", onClick: onHome },
    },
    credit_score: {
      title: "We can't offer you an advance right now",
      body: "This is based on your credit history.",
      when: retry,
      note: "Your NovaPay wallet works as normal.",
      primary: { label: "Back to home", onClick: onHome },
    },
    other: {
      title: "We can't offer you an advance right now",
      body: "We can't share the reason for this decision. You can talk to our support team.",
      when: retry,
      note: "Your NovaPay wallet works as normal.",
      primary: { label: "Contact support", onClick: showStub },
      secondary: { label: "Back to home", onClick: onHome },
    },
  }[reason];

  return (
    <>
      <AppBar title="Salary advance" onBack={onHome} />

      <main className="p-4 space-y-5">
        <section className="px-1 space-y-2">
          <h2 className="text-title text-neutral-900">{content.title}</h2>
          <p className="text-body text-neutral-700">{content.body}</p>
        </section>

        {content.when ? (
          <p className="px-1">
            <span className="block text-body text-neutral-700">You can apply again on</span>
            <span className="block text-title font-bold text-neutral-900">{content.when}</span>
            <span className="block text-body text-neutral-700">We'll check again then.</span>
          </p>
        ) : null}

        {content.note ? <Panel>{content.note}</Panel> : null}

        <div className="space-y-3">
          <Button onClick={content.primary.onClick}>{content.primary.label}</Button>
          {content.secondary ? (
            <Button variant="secondary" onClick={content.secondary.onClick}>
              {content.secondary.label}
            </Button>
          ) : null}
          {stub ? (
            <p role="status" className="text-caption text-neutral-700 text-center">
              This step isn't part of the prototype.
            </p>
          ) : null}
        </div>
      </main>
    </>
  );
}
