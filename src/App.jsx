import { useState } from "react";
import {
  AppBar,
  Card,
  ListRow,
  Button,
  AmountText,
} from "./novakit";
import TermsScreen from "./salary-advance/TermsScreen.jsx";
import SuccessScreen from "./salary-advance/SuccessScreen.jsx";

/**
 * NovaPay home screen plus the salary-advance flow, in a mobile frame.
 * On a real phone the frame fills the screen; on wider screens it shows
 * as a 390px device.
 */
export default function App() {
  const [screen, setScreen] = useState("home");
  const [advance, setAdvance] = useState(null);

  // Until the amount picker exists, the offer opens straight on Rs 10,000.
  const amount = 10000;

  function goHome() {
    setScreen("home");
    window.scrollTo(0, 0);
  }

  function go(next) {
    setScreen(next);
    window.scrollTo(0, 0);
  }

  return (
    <div className="min-h-screen w-full flex justify-center sm:py-6">
      {/* Mobile frame */}
      <div className="relative w-full max-w-[390px] min-h-screen sm:min-h-[780px] bg-white sm:rounded-[28px] sm:shadow-xl overflow-hidden sm:border sm:border-neutral-300">
        {screen === "home" && <HomeScreen onSeeOffer={() => go("terms")} />}

        {screen === "terms" && (
          <TermsScreen
            amount={amount}
            onBack={goHome}
            onDecline={goHome}
            onAccepted={(result) => {
              setAdvance(result);
              go("success");
            }}
          />
        )}

        {screen === "success" && advance && (
          <SuccessScreen amount={advance.amount} total={advance.total} onDone={goHome} />
        )}
      </div>
    </div>
  );
}

function HomeScreen({ onSeeOffer }) {
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
          <Button size="lg" onClick={onSeeOffer}>
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
