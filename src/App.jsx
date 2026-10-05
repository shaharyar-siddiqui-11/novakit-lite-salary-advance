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
import { amountAfterCheck } from "./salary-advance/terms";

const SCENARIOS = [
  { id: "full", label: "Approved, full amount" },
  { id: "less", label: "Approved, pays less" },
  { id: "income_unverified", label: "Declined: income not confirmed" },
  { id: "credit_score", label: "Declined: credit history" },
  { id: "other", label: "Declined: other reason" },
];
const DECLINES = ["income_unverified", "credit_score", "other"];

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

  // Stand-in for the eligibility check behind "See your offer".
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
        {screen === "home" && <HomeScreen onSeeOffer={handleSeeOffer} />}

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

function HomeScreen({ onSeeOffer }) {
  const [checking, setChecking] = useState(false);

  function handleClick() {
    if (checking) return;
    setChecking(true);
    setTimeout(onSeeOffer, 1000);
  }

  return (
    <>
      <AppBar title="NovaPay" />

      <main className="p-4 space-y-4">
        <Card>
          <div className="text-caption text-neutral-500">Available balance</div>
          <div className="mt-1">
            <AmountText amount={4250} size="display" />
          </div>
        </Card>

        <Card className="space-y-3">
          <div>
            <div className="text-title text-neutral-900">Need cash before payday?</div>
            <div className="text-body text-neutral-700 mt-1">
              You may qualify for a NovaPay salary advance.
            </div>
          </div>
          <Button size="lg" onClick={handleClick} loading={checking} loadingLabel="Checking">
            See your offer
          </Button>
        </Card>

        <Card>
          <div className="text-caption text-neutral-500 mb-1">Recent activity</div>
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
