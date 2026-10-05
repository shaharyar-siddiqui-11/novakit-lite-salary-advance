import { useState } from "react";
import {
  AppBar,
  Card,
  ListRow,
  Button,
  AmountText,
} from "./novakit";
import OfferScreen from "./salary-advance/OfferScreen.jsx";
import PayLessScreen from "./salary-advance/PayLessScreen.jsx";
import TermsScreen from "./salary-advance/TermsScreen.jsx";
import SuccessScreen from "./salary-advance/SuccessScreen.jsx";
import DeclineScreen from "./salary-advance/DeclineScreen.jsx";
import LateScreen from "./salary-advance/LateScreen.jsx";
import { amountAfterCheck, feeFor, PAYDAY, formatDate, formatRs } from "./salary-advance/terms";

const SCENARIOS = [
  { id: "full", label: "Approved, full amount" },
  { id: "less", label: "Approved, pays less" },
  { id: "income_unverified", label: "Declined: income not confirmed" },
  { id: "credit_score", label: "Declined: credit history" },
  { id: "other", label: "Declined: other reason" },
  { id: "late", label: "Repayment 4 days late" },
  { id: "fail_check", label: "Error: check fails" },
  { id: "fail_fee", label: "Error: fee doesn't load" },
  { id: "fail_accept", label: "Error: Accept fails" },
];
const DECLINES = ["income_unverified", "credit_score", "other"];

// Late scenario: a Rs 10,000 advance, due on payday, not yet repaid.
const LATE_TOTAL = 10000 + feeFor(10000);

/**
 * NovaPay home screen plus the salary-advance flow, in a mobile frame.
 * On a real phone the frame fills the screen; on wider screens it shows
 * as a 390px device. The scenario picker above the frame is for
 * reviewers and is not part of the app.
 */
export default function App() {
  const [scenario, setScenario] = useState("full");
  const [screen, setScreen] = useState("home");
  const [requested, setRequested] = useState(null);
  const [approved, setApproved] = useState(null);
  const [advance, setAdvance] = useState(null);

  function go(next) {
    setScreen(next);
    window.scrollTo(0, 0);
  }

  function reset() {
    setRequested(null);
    setApproved(null);
    setAdvance(null);
    go("home");
  }

  // Stand-in for the eligibility check behind "Check if you can borrow".
  function handleSeeOffer() {
    go(DECLINES.includes(scenario) ? "declined" : "offer");
  }

  function handleChecked(amount) {
    const result = amountAfterCheck(amount, scenario);
    setRequested(amount);
    setApproved(result);
    go(result < amount ? "payLess" : "terms");
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center sm:py-6 sm:gap-4">
      <ScenarioBar
        value={scenario}
        onChange={(id) => {
          setScenario(id);
          reset();
        }}
      />

      {/* Mobile frame */}
      <div className="relative w-full max-w-[390px] min-h-screen sm:min-h-[780px] bg-white sm:rounded-[28px] sm:shadow-xl overflow-hidden sm:border sm:border-neutral-300">
        {screen === "home" && (
          <HomeScreen
            late={scenario === "late"}
            failCheck={scenario === "fail_check"}
            onSeeOffer={handleSeeOffer}
            onSeeLate={() => go("late")}
          />
        )}

        {screen === "late" && <LateScreen total={LATE_TOTAL} onBack={reset} />}

        {screen === "declined" && <DeclineScreen reason={scenario} onHome={reset} />}

        {screen === "offer" && (
          <OfferScreen initialAmount={requested} onBack={reset} onContinue={handleChecked} />
        )}

        {screen === "payLess" && (
          <PayLessScreen
            requested={requested}
            amount={approved}
            onBack={() => go("offer")}
            onContinue={() => go("terms")}
            onDecline={reset}
          />
        )}

        {screen === "terms" && (
          <TermsScreen
            amount={approved}
            failFee={scenario === "fail_fee"}
            failAccept={scenario === "fail_accept"}
            onBack={() => go(approved < requested ? "payLess" : "offer")}
            onDecline={reset}
            onAccepted={(result) => {
              setAdvance(result);
              go("success");
            }}
          />
        )}

        {screen === "success" && advance && (
          <SuccessScreen
            amount={advance.amount}
            total={advance.total}
            onDone={reset}
          />
        )}
      </div>
    </div>
  );
}

function ScenarioBar({ value, onChange }) {
  return (
    <label className="w-full max-w-[390px] px-4 py-2 sm:px-0 sm:py-0 flex items-center gap-2 text-caption text-neutral-700">
      <span className="shrink-0">Prototype:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-9 min-w-0 flex-1 px-2 rounded-sm border border-neutral-500 bg-white text-body text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
      >
        {SCENARIOS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function HomeScreen({ late, failCheck, onSeeOffer, onSeeLate }) {
  const [checking, setChecking] = useState(false);
  const [checkFailed, setCheckFailed] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Prototype: with failCheck, the first check fails and the second works.
  function handleClick() {
    if (checking) return;
    setChecking(true);
    setCheckFailed(false);
    const attempt = attempts + 1;
    setAttempts(attempt);
    setTimeout(() => {
      if (failCheck && attempt === 1) {
        setChecking(false);
        setCheckFailed(true);
        return;
      }
      onSeeOffer();
    }, 1000);
  }

  return (
    <>
      <AppBar title="NovaPay" />

      <main className="p-4 space-y-4">
        <Card>
          <div className="text-caption text-neutral-700">Available balance</div>
          <div className="mt-1">
            <AmountText amount={4250} size="display" />
          </div>
        </Card>

        {late ? (
          <Card className="space-y-3">
            <div>
              <h2 className="text-body font-semibold text-neutral-900">Salary advance</h2>
              <p className="text-body text-neutral-700">
                {formatRs(LATE_TOTAL)} was due on {formatDate(PAYDAY, { long: true })}.
              </p>
            </div>
            <Button variant="secondary" onClick={onSeeLate}>
              See where things stand
            </Button>
          </Card>
        ) : (
          /* Salary advance entry: easy to find, no push (decision 8).
             No amount shown before the check has run. */
          <Card className="space-y-3">
            <div>
              <h2 className="text-body font-semibold text-neutral-900">Salary advance</h2>
              {checkFailed ? (
                <p role="alert" className="text-body text-neutral-900">
                  We couldn't check right now. Nothing was taken or charged.
                </p>
              ) : (
                <p className="text-body text-neutral-700">
                  Borrow until payday, for a one-time 3% fee.
                </p>
              )}
            </div>
            <Button variant="secondary" onClick={handleClick} loading={checking} loadingLabel="Checking">
              {checkFailed ? "Try again" : "Check if you can borrow"}
            </Button>
          </Card>
        )}

        <Card>
          <div className="text-caption text-neutral-700 mb-1">Recent activity</div>
          <ListRow
            icon="↑"
            title="Sent to Ahmed K."
            subtitle="Today, 2:14 PM"
            trailing={<AmountText amount={1500} size="body" />}
          />
          <ListRow
            icon="↓"
            title="Salary credited"
            subtitle="28 Jun"
            trailing={<AmountText amount={68000} size="body" />}
          />
          <ListRow
            icon="↑"
            title="Mobile top-up"
            subtitle="27 Jun"
            trailing={<AmountText amount={500} size="body" />}
          />
        </Card>
      </main>
    </>
  );
}
