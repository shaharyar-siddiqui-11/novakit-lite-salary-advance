import { useEffect, useRef, useState } from "react";
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
import AcceptFailedScreen from "./salary-advance/AcceptFailedScreen.jsx";
import { amountAfterCheck, feeFor, PAYDAY, formatDate, formatRs } from "./salary-advance/terms";

const SCENARIOS = [
  { id: "full", label: "Approved, full amount" },
  { id: "less", label: "Approved, pays less (pick Rs 10,000)" },
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
const BALANCE = 4250;

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
  // Prototype: with "Accept fails", only the first accept fails.
  const [acceptFailedOnce, setAcceptFailedOnce] = useState(false);
  // An advance taken in this session. Home shows it after "Done".
  const [active, setActive] = useState(null);
  const frame = useRef(null);
  const firstRender = useRef(true);

  // On every screen change, move focus to the screen's main heading so a
  // screen reader announces the new screen. Not on first load.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const heading = frame.current?.querySelector("main h2") || frame.current?.querySelector("h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }, [screen]);

  function go(next) {
    setScreen(next);
    window.scrollTo(0, 0);
  }

  function reset() {
    setRequested(null);
    setApproved(null);
    setAdvance(null);
    setAcceptFailedOnce(false);
    go("home");
  }

  // Stand-in for the eligibility check behind "See if you can borrow".
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
          setActive(null);
          reset();
        }}
      />

      {/* Mobile frame */}
      <div ref={frame} className="relative w-full max-w-[390px] min-h-screen sm:min-h-[780px] bg-white sm:rounded-[28px] sm:shadow-xl overflow-hidden sm:border sm:border-neutral-300">
        {screen === "home" && (
          <HomeScreen
            key={scenario}
            late={scenario === "late"}
            active={active}
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
            failAccept={scenario === "fail_accept" && !acceptFailedOnce}
            onBack={() => go(approved < requested ? "payLess" : "offer")}
            onDecline={reset}
            onAccepted={(result) => {
              setAdvance(result);
              setActive(result);
              go("success");
            }}
            onAcceptFailed={() => {
              setAcceptFailedOnce(true);
              go("acceptFailed");
            }}
          />
        )}

        {screen === "acceptFailed" && (
          <AcceptFailedScreen onRetry={() => go("terms")} onHome={reset} />
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

function HomeScreen({ late, active, failCheck, onSeeOffer, onSeeLate }) {
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
            <AmountText amount={BALANCE + (active ? active.amount : 0)} size="display" />
          </div>
        </Card>

        {active ? (
          /* An advance taken this session: show it, don't invite another. */
          <Card>
            <div className="-my-3">
              <ListRow
                icon={<CalendarIcon />}
                iconTone="brand"
                title={<h2 className="font-semibold">Salary advance</h2>}
                subtitle={
                  <span className="text-body">
                    {formatRs(active.total)} due on {formatDate(PAYDAY, { long: true, weekday: false })}.
                  </span>
                }
              />
            </div>
          </Card>
        ) : late ? (
          <Card className="space-y-3">
            <div className="-my-3">
              <ListRow
                icon={<CalendarIcon />}
                iconTone="brand"
                title={<h2 className="font-semibold">Salary advance</h2>}
                subtitle={
                  <span className="text-body">
                    {formatRs(LATE_TOTAL)} was due on {formatDate(PAYDAY, { long: true, weekday: false })}.
                  </span>
                }
              />
            </div>
            <Button variant="secondary" onClick={onSeeLate}>
              See where things stand
            </Button>
          </Card>
        ) : (
          /* Salary advance entry: easy to find, no push (decision 8).
             No amount shown before the check has run. */
          <EntryCard
            checking={checking}
            checkFailed={checkFailed}
            onClick={handleClick}
          />
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

// Calendar icon for the salary-advance card ("until payday").
// The kit has no icon set, so it lives here as a plain SVG.
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* Salary advance entry: easy to find, no push (decision 8). The icon
   gives it a face. No amount shown before the check has run. */
function EntryCard({ checking, checkFailed, onClick }) {
  return (
    <Card className="space-y-3">
      <div className="-my-3">
        <ListRow
          icon={<CalendarIcon />}
          iconTone="brand"
          title={<h2 className="font-semibold">Salary advance</h2>}
          subtitle={
            checkFailed ? (
              <span role="alert" className="text-body text-neutral-900">
                We couldn't check right now.
              </span>
            ) : (
              <span className="text-body">Borrow until payday, for a one-time 3%&nbsp;fee.</span>
            )
          }
        />
      </div>
      <Button variant="secondary" onClick={onClick} loading={checking} loadingLabel="Checking…">
        {checkFailed ? "Try again" : "See if you can borrow"}
      </Button>
    </Card>
  );
}
