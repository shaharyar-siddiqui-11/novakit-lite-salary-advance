import { AppBar, Panel, Button } from "../novakit";

/**
 * Where you land when Accept didn't go through. The partner of the
 * success screen: after Accept you always land on a screen that says what
 * happened. Error styling, because a money action failed and he must not
 * think he has money that never arrived. No amounts, date or timeline:
 * nothing changed, so there's nothing to repay.
 */
export default function AcceptFailedScreen({ onRetry, onHome }) {
  return (
    <>
      <AppBar title="Salary advance" />
      <main className="p-4 space-y-5">
        <Panel tone="error" role="alert">
          <h2 className="text-title text-neutral-900">Your advance didn't go through</h2>
          <p className="text-body text-neutral-900 mt-1">
            Nothing was paid out, taken or charged.
          </p>
        </Panel>

        <div className="space-y-3">
          <Button onClick={onRetry}>Try again</Button>
          <Button variant="secondary" onClick={onHome}>
            Back to home
          </Button>
        </div>
      </main>
    </>
  );
}
