import { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_PI_API || "http://127.0.0.1:8000";

export default function VoiceControl() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [heardText, setHeardText] = useState("");
  const [status, setStatus] = useState("Idle");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      setStatus("Speech recognition not supported");
      return;
    }

    setSupported(true);

    const recognition = new SpeechRecognition();
    recognition.lang = "en-SG";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setStatus("Listening...");
    };

    recognition.onend = () => {
      setListening(false);
      setStatus((prev) => (prev === "Listening..." ? "Stopped listening" : prev));
    };

    recognition.onerror = (event) => {
      setListening(false);
      setStatus(`Error: ${event.error}`);
      console.error("[VOICE CONTROL] recognition error:", event);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      setHeardText(transcript);
      setStatus(`Heard: "${transcript}"`);

      try {
        await handleVoiceCommand(transcript);
      } catch (err) {
        console.error(err);
        setStatus(`Command failed: ${err.message}`);
        speak("Sorry, the command failed.");
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, []);

  function speak(message) {
    try {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "en-SG";
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("[VOICE CONTROL] speak failed:", error);
    }
  }

  async function getSensorData() {
    const res = await fetch(`${API_BASE}/api/temperature`);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    return data;
  }

  async function getStateData() {
    const res = await fetch(`${API_BASE}/api/state`);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    return data;
  }

  async function postCommand(path) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    return data;
  }

  async function handleVoiceCommand(text) {
    if (!text.startsWith("hey homie")) {
      setStatus('Wake phrase missing. Say "hey homie ..."');
      speak('Please start with "hey homie".');
      return;
    }

    const command = text.replace("hey homie", "").trim();

    if (!command) {
      setStatus("No command detected");
      speak("I did not catch a command.");
      return;
    }

    if (
      command.includes("what's the temperature") ||
      command.includes("what is the temperature") ||
      command === "temperature" ||
      command.includes("tell me the temperature")
    ) {
      setStatus("Checking temperature...");
      const data = await getSensorData();

      const temp = data.temperature_c;

      if (temp === undefined || temp === null) {
        setStatus("Temperature data unavailable");
        speak("Sorry, I cannot find the temperature right now.");
        return;
      }

      const reply = `The current temperature is ${temp} degrees Celsius.`;
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("humidity") ||
      command.includes("what's the humidity") ||
      command.includes("what is the humidity")
    ) {
      setStatus("Checking humidity...");
      const data = await getSensorData();

      const humidity = data.humidity;

      if (humidity === undefined || humidity === null) {
        setStatus("Humidity data unavailable");
        speak("Sorry, I cannot find the humidity right now.");
        return;
      }

      const reply = `The current humidity is ${humidity} percent.`;
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("is it raining") ||
      command.includes("what's the rain status") ||
      command.includes("what is the rain status") ||
      command.includes("rain status")
    ) {
      setStatus("Checking rain status...");
      const data = await getSensorData();

      const rain = data.rain_status;

      if (!rain) {
        setStatus("Rain status unavailable");
        speak("Sorry, I cannot find the rain status right now.");
        return;
      }

      const reply = `The current rain condition is ${rain}.`;
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("is there motion") ||
      command.includes("motion detected") ||
      command.includes("what's the motion status") ||
      command.includes("what is the motion status")
    ) {
      setStatus("Checking motion...");
      const data = await getSensorData();

      const motion = !!data.motion;
      const reply = motion
        ? "Yes, motion is currently detected."
        : "No, there is no motion detected right now.";

      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("open window 1") ||
      command.includes("open the window 1") ||
      command.includes("open window one")
    ) {
      await postCommand("/api/window/1/open");
      const reply = "Opening window 1.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("close window 1") ||
      command.includes("close the window 1") ||
      command.includes("close window one")
    ) {
      await postCommand("/api/window/1/close");
      const reply = "Closing window 1.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("open window 2") ||
      command.includes("open the window 2") ||
      command.includes("open window two")
    ) {
      await postCommand("/api/window/2/open");
      const reply = "Opening window 2.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("close window 2") ||
      command.includes("close the window 2") ||
      command.includes("close window two")
    ) {
      await postCommand("/api/window/2/close");
      const reply = "Closing window 2.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("open all windows") ||
      command.includes("open both windows")
    ) {
      await postCommand("/api/window/1/open");
      await postCommand("/api/window/2/open");
      const reply = "Opening both windows.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("close all windows") ||
      command.includes("close both windows")
    ) {
      await postCommand("/api/window/1/close");
      await postCommand("/api/window/2/close");
      const reply = "Closing both windows.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("turn on the light") ||
      command.includes("light on") ||
      command.includes("switch on the light")
    ) {
      await postCommand("/api/light/on");
      const reply = "Turning on the light.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("turn off the light") ||
      command.includes("light off") ||
      command.includes("switch off the light")
    ) {
      await postCommand("/api/light/off");
      const reply = "Turning off the light.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("turn on the fan") ||
      command.includes("fan on") ||
      command.includes("switch on the fan")
    ) {
      await postCommand("/api/fan/on");
      const reply = "Turning on the fan.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("turn off the fan") ||
      command.includes("fan off") ||
      command.includes("switch off the fan")
    ) {
      await postCommand("/api/fan/off");
      const reply = "Turning off the fan.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("open the door") ||
      command.includes("unlock the door") ||
      command.includes("door open")
    ) {
      await postCommand("/api/door/open");
      const reply = "Opening the door.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("close the door") ||
      command.includes("lock the door") ||
      command.includes("door close")
    ) {
      await postCommand("/api/door/close");
      const reply = "Closing the door.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("turn on automation") ||
      command.includes("enable automation") ||
      command.includes("automation on")
    ) {
      await postCommand("/api/automation/enable");
      const reply = "Automation has been turned on.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("turn off automation") ||
      command.includes("disable automation") ||
      command.includes("automation off")
    ) {
      await postCommand("/api/automation/disable");
      const reply = "Automation has been turned off.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("turn on auto door") ||
      command.includes("enable auto door") ||
      command.includes("enable auto unlock") ||
      command.includes("door auto on")
    ) {
      await postCommand("/api/door-auto/enable");
      const reply = "Auto door access has been turned on.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("turn off auto door") ||
      command.includes("disable auto door") ||
      command.includes("disable auto unlock") ||
      command.includes("door auto off")
    ) {
      await postCommand("/api/door-auto/disable");
      const reply = "Auto door access has been turned off.";
      setStatus(reply);
      speak(reply);
      return;
    }

    if (
      command.includes("what is the system status") ||
      command.includes("system status") ||
      command.includes("what's the system status")
    ) {
      setStatus("Checking system status...");
      const data = await getStateData();

      const reply = `Automation is ${
        data.automation_enabled ? "on" : "off"
      }, the fan is ${data.fan}, the door is ${data.door}, and the rain status is ${
        data.rain_status || "unknown"
      }.`;

      setStatus(reply);
      speak(reply);
      return;
    }

    setStatus(`Unknown command: "${command}"`);
    speak("Sorry, I do not understand that command.");
  }

  function startListening() {
    if (!recognitionRef.current) return;
    setHeardText("");
    window.speechSynthesis.cancel();
    recognitionRef.current.start();
  }

  function stopListening() {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  }

  if (!supported) {
    return (
      <div className="rounded-xl border p-4">
        <h2 className="text-lg font-bold">Voice Control</h2>
        <p className="mt-2 text-sm">{status}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <h2 className="text-lg font-bold">Voice Control</h2>

      <p className="text-sm">
        Try saying: <strong>“Hey homie, turn on the fan”</strong>
      </p>

      <div className="flex gap-2">
        <button
          onClick={startListening}
          disabled={listening}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Start Mic
        </button>

        <button
          onClick={stopListening}
          disabled={!listening}
          className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Stop
        </button>
      </div>

      <div className="text-sm">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Last heard:</strong> {heardText || "-"}</p>
      </div>
    </div>
  );
}