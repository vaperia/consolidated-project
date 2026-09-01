import { useEffect, useRef, useState } from "react";
import { getSoilStatus } from "../utils/sensor";

export function useVoiceControl({ temp, soil, motion, rainStatus, act }) {
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Idle");
  const [lastHeard, setLastHeard] = useState("");

  const recognitionRef = useRef(null);

  const tempRef = useRef(temp);
  const soilRef = useRef(soil);
  const motionRef = useRef(motion);
  const rainStatusRef = useRef(rainStatus);
  const actRef = useRef(act);

  useEffect(() => {
    tempRef.current = temp;
  }, [temp]);

  useEffect(() => {
    soilRef.current = soil;
  }, [soil]);

  useEffect(() => {
    motionRef.current = motion;
  }, [motion]);

  useEffect(() => {
    rainStatusRef.current = rainStatus;
  }, [rainStatus]);

  useEffect(() => {
    actRef.current = act;
  }, [act]);

  function speak(message) {
    try {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "en-SG";
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => {
        console.log("[VOICE] speaking:", message);
      };

      utterance.onerror = (e) => {
        console.error("[VOICE] speech error:", e);
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("[VOICE] speak failed:", error);
    }
  }

  function normalizeCommand(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\blights\b/g, "light")
      .replace(/\bwindows\b/g, "window")
      .replace(/\bdoors\b/g, "door")
      .replace(/\bfans\b/g, "fan")
      .replace(/\bone\b/g, "1")
      .replace(/\btwo\b/g, "2")
      .replace(/\s+/g, " ");
  }

  function matchesAny(command, phrases) {
    return phrases.some((phrase) => command.includes(phrase));
  }

  async function tryAction(command, phrases, path, pending, ok, fail) {
    if (!matchesAny(command, phrases)) return false;

    try {
      setVoiceStatus(pending);
      await actRef.current(path);
      setVoiceStatus(ok);
      speak(ok);
    } catch (error) {
      console.error(error);
      setVoiceStatus(fail);
      speak(fail);
    }

    return true;
  }

  async function handleVoiceCommand(text) {
    if (!text.startsWith("hey homie")) {
      setVoiceStatus('Wake phrase missing. Say "hey homie ..."');
      speak('Please start with "hey homie".');
      return;
    }

    let command = text.replace("hey homie", "").trim();
    command = normalizeCommand(command);

    if (!command) {
      const msg = "I did not catch a command.";
      setVoiceStatus(msg);
      speak(msg);
      return;
    }

    if (
      matchesAny(command, [
        "what's the temperature",
        "what is the temperature",
        "temperature",
        "tell me the temperature",
      ])
    ) {
      const currentTemp = tempRef.current;

      if (currentTemp === null || currentTemp === undefined) {
        const msg = "Sorry, temperature data is not available right now.";
        setVoiceStatus(msg);
        speak(msg);
        return;
      }

      const msg = `The current temperature is ${Number(currentTemp).toFixed(1)} degrees Celsius.`;
      setVoiceStatus(msg);
      speak(msg);
      return;
    }

    if (
      matchesAny(command, [
        "is it raining",
        "what's the rain status",
        "what is the rain status",
        "rain status",
        "is it rain",
      ])
    ) {
      const currentRainStatus =
        rainStatusRef.current || getSoilStatus(soilRef.current) || "unknown";
      const msg = `The current rain status is ${currentRainStatus}.`;
      setVoiceStatus(msg);
      speak(msg);
      return;
    }

    if (
      matchesAny(command, [
        "is there motion",
        "motion status",
        "is someone outside",
        "is there someone outside",
        "motion detected",
      ])
    ) {
      const msg = motionRef.current
        ? "Motion is currently detected."
        : "No motion is currently detected.";
      setVoiceStatus(msg);
      speak(msg);
      return;
    }

    if (
      await tryAction(
        command,
        ["open window 1", "open the window 1"],
        "/api/window/1/open",
        "Opening window 1...",
        "Window 1 opened.",
        "Sorry, I could not open window 1."
      )
    ) return;

    if (
      await tryAction(
        command,
        ["close window 1", "close the window 1"],
        "/api/window/1/close",
        "Closing window 1...",
        "Window 1 closed.",
        "Sorry, I could not close window 1."
      )
    ) return;

    if (
      await tryAction(
        command,
        ["open window 2", "open the window 2"],
        "/api/window/2/open",
        "Opening window 2...",
        "Window 2 opened.",
        "Sorry, I could not open window 2."
      )
    ) return;

    if (
      await tryAction(
        command,
        ["close window 2", "close the window 2"],
        "/api/window/2/close",
        "Closing window 2...",
        "Window 2 closed.",
        "Sorry, I could not close window 2."
      )
    ) return;

    if (
      await tryAction(
        command,
        ["open all window", "open both window", "open all windows", "open both windows"],
        "/api/window/1/open",
        "Opening all windows...",
        "Window 1 opened.",
        "Sorry, I could not open the windows."
      )
    ) {
      try {
        await actRef.current("/api/window/2/open");
        setVoiceStatus("Both windows opened.");
        speak("Both windows opened.");
      } catch (error) {
        console.error(error);
      }
      return;
    }

    if (
      await tryAction(
        command,
        ["close all window", "close both window", "close all windows", "close both windows"],
        "/api/window/1/close",
        "Closing all windows...",
        "Window 1 closed.",
        "Sorry, I could not close the windows."
      )
    ) {
      try {
        await actRef.current("/api/window/2/close");
      } catch (error) {
        console.error(error);
      }
      speak("Both windows closed.");
      setVoiceStatus("Both windows closed.");
      return;
    }

    if (
      await tryAction(
        command,
        ["turn on fan", "fan on", "switch on fan", "on the fan", "start fan"],
        "/api/fan/on",
        "Turning on fan...",
        "Fan turned on.",
        "Sorry, I could not turn on the fan."
      )
    ) return;

    if (
      await tryAction(
        command,
        ["turn off fan", "fan off", "switch off fan", "off the fan", "stop fan"],
        "/api/fan/off",
        "Turning off fan...",
        "Fan turned off.",
        "Sorry, I could not turn off the fan."
      )
    ) return;

    if (
      await tryAction(
        command,
        ["turn on light", "light on", "switch on light", "on the light", "on the lights"],
        "/api/light/on",
        "Turning on light...",
        "Light turned on.",
        "Sorry, I could not turn on the light."
      )
    ) return;

    if (
      await tryAction(
        command,
        ["turn off light", "light off", "switch off light", "off the light", "off the lights"],
        "/api/light/off",
        "Turning off light...",
        "Light turned off.",
        "Sorry, I could not turn off the light."
      )
    ) return;

    if (
      await tryAction(
        command,
        ["open door", "open the door", "unlock door", "unlock the door"],
        "/api/door/open",
        "Opening door...",
        "Door opened.",
        "Sorry, I could not open the door."
      )
    ) return;

    if (
      await tryAction(
        command,
        ["close door", "close the door", "lock door", "lock the door"],
        "/api/door/close",
        "Closing door...",
        "Door closed.",
        "Sorry, I could not close the door."
      )
    ) return;

    if (
      await tryAction(
        command,
        ["turn on automation", "enable automation", "automation on"],
        "/api/automation/enable",
        "Turning on automation...",
        "Automation turned on.",
        "Sorry, I could not turn on automation."
      )
    ) return;

    if (
      await tryAction(
        command,
        ["turn off automation", "disable automation", "automation off"],
        "/api/automation/disable",
        "Turning off automation...",
        "Automation turned off.",
        "Sorry, I could not turn off automation."
      )
    ) return;

    if (
      await tryAction(
        command,
        ["turn on auto door", "enable auto door", "turn on door auto", "door auto on"],
        "/api/door-auto/enable",
        "Turning on auto door...",
        "Auto door turned on.",
        "Sorry, I could not turn on auto door."
      )
    ) return;

    if (
      await tryAction(
        command,
        ["turn off auto door", "disable auto door", "turn off door auto", "door auto off"],
        "/api/door-auto/disable",
        "Turning off auto door...",
        "Auto door turned off.",
        "Sorry, I could not turn off auto door."
      )
    ) return;

    const msg = "Sorry, I do not understand that command.";
    setVoiceStatus(msg);
    speak(msg);
  }

  function startVoiceListening() {
    if (!recognitionRef.current) return;
    setLastHeard("");
    setVoiceStatus('Listening... Try "hey homie, turn on the light"');
    window.speechSynthesis.cancel();
    recognitionRef.current.start();
  }

  function stopVoiceListening() {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  }

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      setVoiceStatus("Voice control not supported in this browser");
      return;
    }

    setVoiceSupported(true);

    const recognition = new SpeechRecognition();
    recognition.lang = "en-SG";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceListening(true);
      setVoiceStatus("Listening...");
    };

    recognition.onend = () => {
      setVoiceListening(false);
      setVoiceStatus((prev) => (prev === "Listening..." ? "Idle" : prev));
    };

    recognition.onerror = (event) => {
      setVoiceListening(false);
      setVoiceStatus(`Voice error: ${event.error}`);
      console.error("[VOICE] recognition error:", event);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      setLastHeard(transcript);
      await handleVoiceCommand(transcript);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, []);

  return {
    voiceSupported,
    voiceListening,
    voiceStatus,
    lastHeard,
    startVoiceListening,
    stopVoiceListening,
  };
}