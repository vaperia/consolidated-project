import Card from "../ui/Card";
import TogglePair from "../ui/TogglePair";
import VoiceAssistantCard from "./VoiceAssistantCard";

function AutoSwitch({
  label,
  checked,
  disabled,
  onChange,
  accent = "pink",
  isMaster = false,
}) {
  const onBg =
    accent === "green"
      ? "bg-emerald-500/90"
      : accent === "blue"
      ? "bg-sky-500/90"
      : accent === "yellow"
      ? "bg-amber-400/90"
      : "bg-fuchsia-500/90";

  return (
    <div
      className={[
        "flex min-h-[92px] items-center justify-between rounded-2xl border px-4 py-4 backdrop-blur-sm",
        isMaster ? "border-white/25 bg-white/10" : "border-white/15 bg-white/5",
      ].join(" ")}
    >
      <div className="pr-4">
        <div
          className={[
            "font-bold leading-tight text-white",
            isMaster ? "text-xl" : "text-lg",
          ].join(" ")}
        >
          {label}
        </div>
        <div className="mt-2 text-sm text-white/60">
          {checked ? "Enabled" : "Disabled"}
        </div>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onChange}
        className={[
          "relative shrink-0 rounded-full border border-white/20 transition-all duration-300",
          isMaster ? "h-10 w-20" : "h-8 w-16",
          checked ? `${onBg} shadow-lg` : "bg-white/15",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        ].join(" ")}
        aria-pressed={checked}
        aria-label={`${label} toggle`}
      >
        <span
          className={[
            "absolute left-1 top-1 rounded-full bg-white shadow-md transition-all duration-300",
            isMaster ? "h-8 w-8" : "h-6 w-6",
            checked
              ? isMaster
                ? "translate-x-10"
                : "translate-x-8"
              : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export default function RoomControls({ piApi, pi, voice }) {
  const { state, busy, act } = pi;

  const isWindow1Open = state.window1 === "open";
  const isWindow2Open = state.window2 === "open";
  const isLightOn = !!state.light;
  const isFanOn = state.fan === "on";
  const isDoorOpen = state.door === "open";

  const isFanAutoOn = !!state.fan_auto_enabled;
  const isLightAutoOn = !!state.light_auto_enabled;
  const isWindowAutoOn = !!state.window_auto_enabled;

  const isMasterAutoOn = isFanAutoOn && isLightAutoOn && isWindowAutoOn;

  const deviceCard =
    "rounded-2xl border border-white/20 bg-black/25 p-4 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]";

  async function handleMasterToggle() {
    if (isMasterAutoOn) {
      await act("/api/automation/fan/disable");
      await act("/api/automation/light/disable");
      await act("/api/automation/window/disable");
    } else {
      await act("/api/automation/fan/enable");
      await act("/api/automation/light/enable");
      await act("/api/automation/window/enable");
    }
  }

  async function handleFanAutoToggle() {
    await act(
      isFanAutoOn
        ? "/api/automation/fan/disable"
        : "/api/automation/fan/enable"
    );
  }

  async function handleLightAutoToggle() {
    await act(
      isLightAutoOn
        ? "/api/automation/light/disable"
        : "/api/automation/light/enable"
    );
  }

  async function handleWindowAutoToggle() {
    await act(
      isWindowAutoOn
        ? "/api/automation/window/disable"
        : "/api/automation/window/enable"
    );
  }

  return (
    <Card
      title="Room Controls"
      right={
        <div className="text-xs text-white/80">
          API: <span className="font-mono text-white">{piApi}</span>
        </div>
      }
    >
      <div className="mb-5 rounded-2xl border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 p-5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="mb-1 text-lg font-extrabold text-white">
          🤖 Automation Controls
        </div>
        <div className="mb-4 text-sm text-white/70">
          Master turns all automations on or off at once. Individual switches
          let you control each one separately.
        </div>

        <div className="mb-3">
          <AutoSwitch
            label="🤖 Master Auto"
            checked={isMasterAutoOn}
            disabled={busy}
            accent="purple"
            isMaster
            onChange={handleMasterToggle}
          />
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/40">individual controls</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <AutoSwitch
            label="🌀 Fan Auto"
            checked={isFanAutoOn}
            disabled={busy}
            accent="blue"
            onChange={handleFanAutoToggle}
          />

          <AutoSwitch
            label="💡 Light Auto"
            checked={isLightAutoOn}
            disabled={busy}
            accent="yellow"
            onChange={handleLightAutoToggle}
          />

          <div className="md:col-span-2">
            <AutoSwitch
              label="🪟 Window Auto"
              checked={isWindowAutoOn}
              disabled={busy}
              accent="green"
              onChange={handleWindowAutoToggle}
            />
          </div>
        </div>

        <div className="mt-3 text-xs text-white/55">
          Door recognition stays active 24/7 and is not controlled here.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className={deviceCard}>
          <div className="font-extrabold">🪟 Window 1</div>
          <div className="mb-3 text-sm text-white/80">
            Status: {state.window1}
          </div>
          <TogglePair
            leftLabel="Open"
            rightLabel="Close"
            isLeftActive={isWindow1Open}
            disabled={busy}
            onLeft={() => act("/api/window/1/open")}
            onRight={() => act("/api/window/1/close")}
          />
        </div>

        <div className={deviceCard}>
          <div className="font-extrabold">🪟 Window 2</div>
          <div className="mb-3 text-sm text-white/80">
            Status: {state.window2}
          </div>
          <TogglePair
            leftLabel="Open"
            rightLabel="Close"
            isLeftActive={isWindow2Open}
            disabled={busy}
            onLeft={() => act("/api/window/2/open")}
            onRight={() => act("/api/window/2/close")}
          />
        </div>

        <div className={deviceCard}>
          <div className="font-extrabold">💡 Room Light</div>
          <div className="mb-3 text-sm text-white/80">
            Status: {isLightOn ? "on" : "off"}
          </div>
          <TogglePair
            leftLabel="On"
            rightLabel="Off"
            isLeftActive={isLightOn}
            disabled={busy}
            onLeft={() => act("/api/light/on")}
            onRight={() => act("/api/light/off")}
          />
        </div>

        <div className={deviceCard}>
          <div className="font-extrabold">🌀 Fan</div>
          <div className="mb-3 text-sm text-white/80">Status: {state.fan}</div>
          <TogglePair
            leftLabel="On"
            rightLabel="Off"
            isLeftActive={isFanOn}
            disabled={busy}
            onLeft={() => act("/api/fan/on")}
            onRight={() => act("/api/fan/off")}
          />
        </div>

        <div className={deviceCard}>
          <div className="font-extrabold">🚪 Door</div>
          <div className="mb-3 text-sm text-white/80">Status: {state.door}</div>
          <TogglePair
            leftLabel="Open"
            rightLabel="Close"
            isLeftActive={isDoorOpen}
            disabled={busy}
            onLeft={() => act("/api/door/open")}
            onRight={() => act("/api/door/close")}
          />
        </div>
      </div>

      <div className="mt-4 text-xs text-white/70">
        Device buttons control hardware directly. Automation switches control
        which automations are allowed to run.
      </div>

      <VoiceAssistantCard {...voice} />
    </Card>
  );
}